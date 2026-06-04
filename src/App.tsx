import React, { useState } from 'react';
import TokenInput from './components/TokenInput';
import PlayerSearch from './components/PlayerSearch';
import PlayerTable from './components/PlayerTable';
import Instructions from './components/Instructions';
import { Player } from './types';
import { getPlayersAroundInLeaderboard } from './services/playerService';
import { Analytics } from "@vercel/analytics/react"

const App: React.FC = () => {
  const [apiToken, setApiToken] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playersAround, setPlayersAround] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalRank, setGlobalRank] = useState<number | null>(null);

  const handleTokenSet = (token: string) => {
    setApiToken(token);
    setSelectedPlayer(null);
    setPlayersAround([]);
    setError(null);
    setGlobalRank(null);
  };

  const handlePlayerSelect = async (player: Player) => {
    setSelectedPlayer(player);
    setLoading(true);
    setError(null);

    try {
      const rankingType = "userLevel";
      
      console.log(`📡 Fetching leaderboard with type: ${rankingType}`);
      const players = await getPlayersAroundInLeaderboard(player.id, rankingType, apiToken, 25);
      setPlayersAround(players);
      
      // حفظ الترتيب العام للاعب المختار
      const playerData = players.find(p => p.id === player.id);
      if (playerData && (playerData as any).xpRank) {
        setGlobalRank((playerData as any).xpRank);
      } else {
        setGlobalRank(null);
      }
      
      if (players.length === 0) {
        setError('No players found around this player in the leaderboard.');
      }
    } catch (err) {
      setError('Failed to fetch leaderboard. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.app}>
    <Analytics />
      <div style={styles.animatedBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img 
            src="/logo.png" 
            alt="War Era Rankings Logo" 
            style={styles.logoImage}
          />
        </div>
          <p style={styles.subtitle}>
            Compare yourself with the same level players in the War Era universe.
          </p>
        </header>

        <TokenInput onTokenSet={handleTokenSet} />

        {apiToken && (
          <>
            <PlayerSearch token={apiToken} onPlayerSelect={handlePlayerSelect} />

            {loading && (
              <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Loading player data...</p>
              </div>
            )}

            {error && <div style={styles.error}>{error}</div>}

            {selectedPlayer && playersAround.length > 0 && (
              <>
                <div style={styles.selectedInfo}>
                  <h2 style={styles.selectedTitle}>
                    🎯 Showing players around <span style={styles.highlight}>{selectedPlayer.name}</span>
                  </h2>
                  <div style={styles.globalRankContainer}>
                    <span style={styles.globalRankLabel}>🌍 Global Rank:</span>
                    <span style={styles.globalRankValue}>#{globalRank?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <p style={styles.stats}>
                    Local ranking: 1 to {playersAround.length} | Total players displayed: {playersAround.length}
                  </p>
                </div>

                {/* Stat Cards with Icons */}
<div style={styles.statsCards}>
  <div className="stat-card">
    <div className="stat-icon">⭐</div>
    <div className="stat-value">{selectedPlayer.level || '-'}</div>
    <div className="stat-label">Level</div>
  </div>
  <div className="stat-card">
    <div className="stat-icon">📊</div>
    <div className="stat-value">{selectedPlayer.xp?.toLocaleString() || '-'}</div>
    <div className="stat-label">XP</div>
  </div>
  <div className="stat-card">
    <div className="stat-icon">💰</div>
    <div className="stat-value">{selectedPlayer.wealth ? Math.floor(selectedPlayer.wealth).toLocaleString() : '-'}</div>
    <div className="stat-label">Wealth</div>
  </div>
  <div className="stat-card">
    <div className="stat-icon">💥</div>
    <div className="stat-value">{selectedPlayer.totalDamage?.toLocaleString() || '-'}</div>
    <div className="stat-label">Total Damage</div>
  </div>
  <div className="stat-card">
    <div className="stat-icon">⚡</div>
    <div className="stat-value">{selectedPlayer.weeklyDamage?.toLocaleString() || '-'}</div>
    <div className="stat-label">Weekly Damage</div>
  </div>
  <div className="stat-card">
    <div className="stat-icon">🎯</div>
    <div className="stat-value">{selectedPlayer.bountyEarned ? Math.floor(selectedPlayer.bountyEarned).toLocaleString() : '-'}</div>
    <div className="stat-label">Bounty Earned</div>
  </div>
  <div className="stat-card">
    <div className="stat-icon">📦</div>
    <div className="stat-value">{selectedPlayer.casesOpened?.toLocaleString() || '-'}</div>
    <div className="stat-label">Cases Opened</div>
  </div>
</div>

                <PlayerTable 
                  players={playersAround} 
                  highlightedPlayerId={selectedPlayer.id}
                />
              </>
            )}

            {selectedPlayer && playersAround.length === 0 && !loading && (
              <div style={styles.noResults}>
                <p>No players found around {selectedPlayer.name}</p>
              </div>
            )}
          </>
        )}
      </div>

      <footer style={styles.footer}>
        <p>Made with ❤️ by War Era Community | Free Palestine 🇵🇸</p>
        Project fan made by SEJJIL | Special thanks to "Dog" War Era admin
      </footer>

      <Instructions />
    </div>
  );
};

const styles = {
    app: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    backgroundImage: 'url("/background3.png")', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative' as const,
    overflowX: 'hidden' as const,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  animatedBg: {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.16)', // ← القيمة ثابتة
  pointerEvents: 'none' as const,
  zIndex: 0,
},
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    paddingBottom: '100px',
    position: 'relative' as const,
    zIndex: 1,
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    animation: 'fadeInDown 0.8s ease',
  },

  logoContainer: {
  marginBottom: '1px',
  },
  logoImage: {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '180px',
    objectFit: 'contain' as const,
    filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 0.3))',
    transition: 'all 0.3s ease',
  },
  titleIcon: {
    marginRight: '10px',
  },
  subtitle: {
    color: 'rgba(170, 170, 170, 0.93)',
    fontSize: '1rem',
    maxWidth: '400px',
    margin: '0 auto',
  },
  selectedInfo: {
  marginTop: '30px',
  marginBottom: '20px',
  padding: '20px',              // ← قلل ده إلى '12px'
  backgroundColor: 'rgba(30, 30, 40, 0.6)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(124, 58, 237, 0.2)',
  animation: 'fadeInUp 0.5s ease',
  textAlign: 'center',          // ← أضف السطر ده
  maxWidth: '500px',            // ← أضف السطر ده عشان يضيق
  margin: '30px auto 20px auto', // ← أضف السطر ده عشان يتوسط
},
  selectedTitle: {
    fontSize: '1.3rem',
    marginBottom: '12px',
    color: '#e0e0e0',
  },
  highlight: {
    color: '#dc2626',
    fontWeight: 'bold' as const,
    background: 'rgba(220, 38, 38, 0.15)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  globalRankContainer: {
    marginTop: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(42, 42, 52, 0.8)',
    borderRadius: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
  },
  globalRankLabel: {
    color: '#a78bfa',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  globalRankValue: {
    color: '#fbbf24',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  stats: {
    color: '#aaa',
    fontSize: '13px',
    marginTop: '12px',
  },
  statsCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
    marginBottom: '25px',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '60px',
    color: '#49af57',
    fontSize: '16px',
    border: '1px solid rgba(35, 37, 35, 0.5)',
    backgroundColor: 'rgba(26, 29, 26, 0.88)',
    borderRadius: '12px',
    width: 'fit-content',
    margin: '40px auto',
  },
  spinner: {
    display: 'inline-block',
    width: '50px',
    height: '50px',
    border: '3px solid rgba(124, 58, 237, 0.2)',
    borderTopColor: '#7c3aed',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    padding: '15px 20px',
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    border: '1px solid rgba(220, 38, 38, 0.5)',
    borderRadius: '12px',
    color: '#fca5a5',
    marginTop: '20px',
    textAlign: 'center' as const,
  },
  noResults: {
    textAlign: 'center' as const,
    padding: '60px',
    color: '#888',
    fontSize: '16px',
  },
  footer: {
  position: 'fixed' as const,
  bottom: 0,
  left: 0,
  right: 0,
  textAlign: 'center' as const,
  padding: '7px',
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.03)',
  color: 'rgba(170, 170, 170, 0.8)',
  fontSize: '10px',
  zIndex: 100,
  fontFamily: "'Inter', sans-serif",
},
} as const;

// Add global styles for animations and stat cards
const globalStyleSheet = document.createElement('style');
globalStyleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(30, 30, 40, 0.5);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #7c3aed;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #a78bfa;
  }
.stat-card {
  background: rgba(30, 30, 40, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px 12px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  cursor: pointer;
}
.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(124, 58, 237, 0.6);
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.2);
  background: rgba(40, 40, 55, 0.8);
}
.stat-icon {
  font-size: 24px;
  margin-bottom: 8px;
  display: block;
}
.stat-value {
  font-size: 22px;
  font-weight: bold;
  background: linear-gradient(135deg, #a78bfa, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stat-label {
  font-size: 10px;
  color: rgba(170, 170, 170, 0.7);
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
`;
document.head.appendChild(globalStyleSheet);

export default App;