import React from 'react';

interface SortBarProps {
  currentSort: string;
  sortOrder: 'asc' | 'desc';
  onSort: (key: string) => void;
}

const SortBar: React.FC<SortBarProps> = ({ currentSort, sortOrder, onSort }) => {
  const sortOptions = [
    { key: 'localRank', label: 'Rank', icon: '🔢' },
    { key: 'wealth', label: 'Wealth', icon: '💰' },
    { key: 'bountyEarned', label: 'Bounty', icon: '🎯' },
    { key: 'casesOpened', label: 'Cases', icon: '📦' },
    { key: 'totalDamage', label: 'Total Dmg', icon: '💥' },
    { key: 'weeklyDamage', label: 'Weekly Dmg', icon: '⚡' },
  ];

  return (
    <div style={styles.container}>
      <span style={styles.label}>📌 Sort by (Highest to Lowest ↓):</span>
      <div style={styles.buttonGroup}>
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onSort(option.key)}
            style={{
              ...styles.button,
              ...(currentSort === option.key ? styles.buttonActive : {}),
            }}
          >
            <span style={styles.buttonIcon}>{option.icon}</span>
            {option.label}
            {currentSort === option.key && (
              <span style={styles.orderIndicator}>↓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '16px',
    padding: '12px 16px',
    background: 'rgba(20, 20, 30, 0.5)',
    borderRadius: '12px',
    border: '1px solid rgba(168, 85, 247, 0.15)',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    color: '#a855f7',
    marginBottom: '10px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(30, 30, 40, 0.8)',
    border: '1px solid rgba(74, 74, 84, 0.5)',
    borderRadius: '20px',
    color: '#a1a1aa',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  buttonActive: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    borderColor: 'transparent',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
  },
  buttonIcon: {
    fontSize: '12px',
  },
  orderIndicator: {
    marginLeft: '4px',
    fontSize: '11px',
  },
} as const;

export default SortBar;