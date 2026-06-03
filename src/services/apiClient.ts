import { createAPIClient } from '@wareraprojects/api';

let apiClient: any = null;

export const getApiClient = (token?: string) => {
  if (!token && !apiClient) {
    return null;
  }
  
  if (token && !apiClient) {
    try {
      apiClient = createAPIClient({ token });
      console.log('✅ API Client created');
    } catch (error) {
      console.error('❌ Failed to create API client:', error);
      return null;
    }
  }
  
  return apiClient;
};

// ============ دالة البحث الأساسية ============
export const searchPlayersReal = async (query: string, token: string): Promise<any> => {
  const url = `https://api5.warera.io/trpc/search.searchAnything?batch=1`;
  
  const requestBody = {
    "0": {
      "searchText": query
    }
  };
  
  console.log(`📡 Searching for: "${query}"`);
  
  try {
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
    
    const data = await response.json();
    console.log(`✅ Search response received`);
    return data;
    
  } catch (error) {
    console.error('❌ Search failed:', error);
    throw error;
  }
};

// ============ جلب لاعب واحد مع طباعة كاملة للـ Response ============
export const getSingleUser = async (userId: string, token: string): Promise<any> => {
  const url = `https://api5.warera.io/trpc/user.getUserLite?batch=1`;
  
  const requestBody = {
    "0": {
      "userId": userId
    }
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      console.log(`❌ Failed to fetch user ${userId.substring(0, 8)}...: HTTP ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // 🔍 طباعة الـ Response كامل عشان نشوف فيه إيه (wealth, damage, etc.)
    console.log(`📦 Full response for user ${userId.substring(0, 8)}...:`);
    console.log(JSON.stringify(data, null, 2));
    
    return data;
    
  } catch (error) {
    console.error(`❌ Error fetching user ${userId.substring(0, 8)}...:`, error);
    return null;
  }
};

// ============ جلب تفاصيل لاعبين واحد واحد ============
export const getUsersLiteBatch = async (userIds: string[], token: string): Promise<any> => {
  const allResults: any[] = [];
  
  console.log(`📡 Fetching ${userIds.length} users one by one...`);
  
  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    const result = await getSingleUser(userId, token);
    
    if (result && Array.isArray(result) && result.length > 0) {
      allResults.push(...result);
      console.log(`✅ [${i + 1}/${userIds.length}] Fetched user: ${userId.substring(0, 8)}...`);
    } else {
      console.log(`❌ [${i + 1}/${userIds.length}] Failed to fetch user: ${userId.substring(0, 8)}... (skipping)`);
    }
  }
  
  console.log(`✅ Total results: ${allResults.length} out of ${userIds.length} users`);
  return allResults;
};

// ============ جلب لاعب واحد ============
export const getUserLite = async (userId: string, token: string): Promise<any> => {
  return getSingleUser(userId, token);
};

// ============ جلب كل إحصائيات لاعب ============
export const getUserFullStats = async (userId: string, token: string): Promise<any> => {
  const userData = await getSingleUser(userId, token);
  const data = userData?.[0]?.result?.data;
  
  return {
    wealth: data?.wealth || data?.stats?.wealth || 0,
    totalDamage: data?.damage?.total || data?.totalDamage || data?.stats?.totalDamage || 0,
    weeklyDamage: data?.damage?.weekly || data?.weeklyDamage || data?.stats?.weeklyDamage || 0,
    bountyEarned: data?.bounty?.earned || data?.bountyEarned || data?.stats?.bountyEarned || 0,
    casesOpened: data?.cases?.opened || data?.casesOpened || data?.stats?.casesOpened || 0,
    level: data?.leveling?.level || data?.level || 0,
    xp: data?.leveling?.totalXp || data?.xp || 0,
  };
};

// ============ جلب إحصائيات عدة لاعبين ============
export const getMultipleUsersFullStats = async (userIds: string[], token: string): Promise<Map<string, any>> => {
  const statsMap = new Map<string, any>();
  
  for (const userId of userIds) {
    const stats = await getUserFullStats(userId, token);
    statsMap.set(userId, stats);
  }
  
  return statsMap;
};

// ============ جلب الـ Leaderboard ============
export const getLeaderboard = async (rankingType: string, token: string): Promise<any> => {
  const url = `https://api5.warera.io/trpc/ranking.getRanking?batch=1`;

  const requestBody = {
    "0": {
      "rankingType": rankingType
    }
  };

  console.log(`🏆 Fetching leaderboard: ${rankingType}`);

  try {
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

    const data = await response.json();
    console.log(`✅ Leaderboard received`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to fetch leaderboard:`, error);
    throw error;
  }
};

// ============ دوال الإدارة ============
export const setApiToken = (token: string) => {
  localStorage.setItem('warera_api_token', token);
  apiClient = null;
  return getApiClient(token);
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('warera_api_token');
};

export const clearApiToken = () => {
  apiClient = null;
  localStorage.removeItem('warera_api_token');
};