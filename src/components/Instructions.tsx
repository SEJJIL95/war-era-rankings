import React, { useState } from 'react';

const Instructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button style={styles.helpButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✖ Close Guide' : '❓ How to Use'}
      </button>
      
      {isOpen && (
        <div style={styles.overlay} onClick={() => setIsOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>📖 War Era Rankings Tool</h2>
              <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>✖</button>
            </div>
            
            <div style={styles.modalBody}>
              <section style={styles.section}>
                <h3>🎯 What is this tool?</h3>
                <p>A comprehensive player rankings tool for <strong>War Era</strong> that allows you to search for players and compare their stats with players around them on the same level.</p>
              </section>

              <section style={styles.section}>
                <h3>🚀 How to Use</h3>
                <ol style={styles.list}>
                  <li><strong>Get your API Token</strong> - From the game account settings, Scroll down and create a new token</li>
                  <li><strong>Paste token</strong> - Enter it in the API Token field above</li>
                  <li><strong>Search for a player</strong> - Type any username and click Search</li>
                  <li><strong>Select a player</strong> - Click on any result to see 51 players around them</li>
                  <li><strong>Sort columns</strong> - Click on any column header to sort by that stat</li>
                  <li><strong>Compare stats</strong> - See Wealth, Damage, Bounty, Cases and more!</li>
                </ol>
              </section>

              <section style={styles.section}>
                <h3>📊 What stats are shown?</h3>
                <ul style={styles.list}>
                  <li>🏆 <strong>Global Rank</strong> - Your position in the worldwide leaderboard</li>
                  <li>⭐ <strong>Level & XP</strong> - Current level and experience points</li>
                  <li>💰 <strong>Wealth</strong> - Total in-game currency</li>
                  <li>💥 <strong>Total Damage</strong> - Lifetime damage dealt</li>
                  <li>⚡ <strong>Weekly Damage</strong> - Damage in the current week</li>
                  <li>🎁 <strong>Bounty Earned</strong> - Total bounty collected</li>
                  <li>📦 <strong>Cases Opened</strong> - Number of cases opened</li>
                </ul>
              </section>

              <section style={styles.section}>
                <h3>🎨 Color Guide</h3>
                <ul style={styles.list}>
                  <li style={{ color: '#ffd700' }}>🥇 Gold - Top 10 in local ranking</li>
                  <li style={{ color: '#c0c0c0' }}>🥈 Silver - Top 50 in local ranking</li>
                  <li style={{ color: '#cd7f32' }}>🥉 Bronze - Top 100 in local ranking</li>
                  <li style={{ color: '#7c3aed' }}>💜 Purple - Your selected player</li>
                </ul>
              </section>

              <section style={styles.section}>
                <h3>💡 Tips</h3>
                <ul style={styles.list}>
                  <li>Click on any column header to sort the table</li>
                  <li>The local ranking (#1-51) shows position relative to your search</li>
                  <li>Global rank shows worldwide position</li>
                  <li>Data updates directly from War Era API</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  helpButton: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    padding: '12px 20px',
    backgroundColor: '#7c3aed86',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    zIndex: 100,
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(5px)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  modal: {
    backgroundColor: 'rgba(30, 30, 40, 0.98)',
    borderRadius: '20px',
    maxWidth: '550px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(124, 58, 237, 0.3)',
    animation: 'slideUp 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(74, 74, 74, 0.5)',
    backgroundColor: 'rgba(20, 20, 30, 0.5)',
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto' as const,
    maxHeight: 'calc(80vh - 70px)',
  },
  section: {
    marginBottom: '24px',
  },
  list: {
    marginLeft: '20px',
    lineHeight: '1.8',
    color: '#ccc',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
  },
};

// Add animations to document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .player-row:hover {
    background-color: rgba(124, 58, 237, 0.1);
    transform: scale(1.01);
  }
`;
document.head.appendChild(styleSheet);

export default Instructions;