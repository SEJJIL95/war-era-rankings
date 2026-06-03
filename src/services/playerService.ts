import { searchPlayersReal, getUsersLiteBatch } from './apiClient';
import { Player } from '../types';

// ============ البحث عن لاعب ============
export const searchPlayers = async (query: string, token: string): Promise<Player[]> => {
  console.log('🔍 Searching for player:', query);
  
  const searchResult = await searchPlayersReal(query, token);
  const userIds = extractUserIds(searchResult);
  
  if (userIds.length === 0) {
    console.warn('⚠️ No user IDs found');
    return [];
  }
  
  const batchResponse = await getUsersLiteBatch(userIds, token);
  let players = extractPlayersWithFullStats(batchResponse); // ✅ استخدم الدالة الجديدة
  
  return players;
};

// ============ جلب 51 لاعب حوالين لاعب حسب XP (userLevel) ============
export const getPlayersAroundByXP = async (
  targetUserId: string,
  token: string,
  range: number = 25
): Promise<Player[]> => {
  console.log(`📍 Getting ${range} players around ${targetUserId} by XP (userLevel leaderboard)`);

  try {
    const url = `https://api5.warera.io/trpc/ranking.getRanking?batch=1`;
    const requestBody = {
      "0": {
        "rankingType": "userLevel"
      }
    };

    console.log(`📡 Fetching XP leaderboard...`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const leaderboardData = await response.json();
    const items = leaderboardData?.[0]?.result?.data?.items;

    if (!items || !Array.isArray(items)) {
      console.warn("No items found in leaderboard response");
      return [];
    }

    console.log(`📊 Leaderboard has ${items.length} total items (XP ranking)`);

    const targetItemIndex = items.findIndex((item: any) => item.user === targetUserId);

    if (targetItemIndex === -1) {
      console.warn(`Target user ${targetUserId} not found in XP leaderboard`);
      return [];
    }

    console.log(`🎯 Target found at XP rank: ${targetItemIndex + 1} (Value: ${items[targetItemIndex].value} XP)`);

    const startIndex = Math.max(0, targetItemIndex - range);
    const endIndex = Math.min(items.length, targetItemIndex + range + 1);
    const surroundingItems = items.slice(startIndex, endIndex);

    console.log(`📋 Found ${surroundingItems.length} players around target (${startIndex + 1} to ${endIndex})`);

    const userIds = surroundingItems.map((item: any) => item.user);

    const batchResponse = await getUsersLiteBatch(userIds, token);
    let players = extractPlayersWithFullStats(batchResponse);

    // نضيف الترتيب وقيمة XP لكل لاعب
    for (let i = 0; i < surroundingItems.length; i++) {
      const player = players.find(p => p.id === surroundingItems[i].user);
      if (player) {
        (player as any).xpRank = surroundingItems[i].rank;
        (player as any).xpValue = surroundingItems[i].value;
      }
    }

    // نرتبهم حسب الترتيب
    players.sort((a, b) => {
      const rankA = surroundingItems.find(i => i.user === a.id)?.rank || 0;
      const rankB = surroundingItems.find(i => i.user === b.id)?.rank || 0;
      return rankA - rankB;
    });

    console.log(`✅ Returning ${players.length} players with full stats`);
    return players;

  } catch (error) {
    console.error('❌ Failed to get players around by XP:', error);
    throw error;
  }
};

// ============ دالة استخراج اللاعبين مع كل الإحصائيات من rankings ============
const extractPlayersWithFullStats = (batchResponse: any): Player[] => {
  const players: Player[] = [];
  
  if (!Array.isArray(batchResponse)) return players;
  
  for (const item of batchResponse) {
    const userData = item?.result?.data;
    if (userData && userData._id) {
      const rankings = userData.rankings || {};
      
      players.push({
        id: userData._id,
        name: userData.username,
        level: userData.leveling?.level || userData.level,
        xp: rankings.userLevel?.value || userData.leveling?.totalXp || userData.xp || 0,
        wealth: rankings.userWealth?.value || 0,
        totalDamage: rankings.userDamages?.value || 0,
        weeklyDamage: rankings.weeklyUserDamages?.value || 0,
        bountyEarned: rankings.userBounty?.value || 0,
        casesOpened: rankings.userCasesOpened?.value || 0,
      });
      
      console.log(`📊 ${userData.username}: XP=${rankings.userLevel?.value || 0}, Wealth=${rankings.userWealth?.value || 0}, Damage=${rankings.userDamages?.value || 0}`);
    }
  }
  
  return players;
};

// ============ دالة للتوافق مع App.tsx ============
export const getPlayersAroundInLeaderboard = async (
  targetUserId: string,
  rankingType: string,
  token: string,
  range: number = 25
): Promise<Player[]> => {
  if (rankingType === "userLevel" || rankingType === "totalUserXp") {
    return getPlayersAroundByXP(targetUserId, token, range);
  }
  
  console.log(`📍 Getting players around in ${rankingType} leaderboard`);

  try {
    const url = `https://api5.warera.io/trpc/ranking.getRanking?batch=1`;
    const requestBody = { "0": { "rankingType": rankingType } };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const leaderboardData = await response.json();
    const items = leaderboardData?.[0]?.result?.data?.items;

    if (!items || !Array.isArray(items)) {
      return [];
    }

    const targetItemIndex = items.findIndex((item: any) => item.user === targetUserId);
    if (targetItemIndex === -1) return [];

    const startIndex = Math.max(0, targetItemIndex - range);
    const endIndex = Math.min(items.length, targetItemIndex + range + 1);
    const surroundingItems = items.slice(startIndex, endIndex);
    const userIds = surroundingItems.map((item: any) => item.user);

    const batchResponse = await getUsersLiteBatch(userIds, token);
    let players = extractPlayersWithFullStats(batchResponse);

    return players;
  } catch (error) {
    console.error('❌ Failed to get players around:', error);
    throw error;
  }
};

// ============ دالة للتوافق ============
export const getPlayersAround = getPlayersAroundInLeaderboard;

export const getLeaderboard = async (rankingType: string, token: string) => {
  const url = `https://api5.warera.io/trpc/ranking.getRanking?batch=1`;
  const requestBody = { "0": { "rankingType": rankingType } };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  return response.json();
};

// ============ دوال مساعدة ============
const extractUserIds = (data: any): string[] => {
  if (Array.isArray(data) && data.length > 0) {
    const userIds = data[0]?.result?.data?.userIds;
    if (Array.isArray(userIds)) return userIds;
  }
  return [];
};