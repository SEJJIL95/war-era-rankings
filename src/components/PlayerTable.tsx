import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import SortBar from './SortBar';

interface PlayerTableProps {
  players: Player[];
  highlightedPlayerId?: string;
}

type SortKey = 'localRank' | 'wealth' | 'bountyEarned' | 'casesOpened' | 'totalDamage' | 'weeklyDamage';

const PlayerTable: React.FC<PlayerTableProps> = ({ players, highlightedPlayerId }) => {
  const [sortKey, setSortKey] = useState<SortKey>('localRank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // asc for localRank, desc for others

  const formatNumber = (value: number | undefined): string => {
    if (!value && value !== 0) return '-';
    return Math.floor(value).toLocaleString();
  };

  const getRankColor = (localRank: number) => {
    if (localRank <= 10) return '#ffd700';
    if (localRank <= 50) return '#c0c0c0';
    if (localRank <= 100) return '#cd7f32';
    return '#fff';
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key as SortKey);
      // For localRank, default to asc (1 first). For others, default to desc (highest first)
      setSortOrder(key === 'localRank' ? 'asc' : 'desc');
    }
  };

  const getColumnHighlight = (columnKey: SortKey) => {
    return sortKey === columnKey ? {
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      borderBottom: '2px solid #a855f7',
    } : {};
  };

  const sortedPlayers = useMemo(() => {
    const sorted = [...players];
    
    sorted.sort((a, b) => {
      let aVal: any;
      let bVal: any;
      
      switch (sortKey) {
        case 'localRank':
          aVal = (a as any).localRank || 0;
          bVal = (b as any).localRank || 0;
          break;
        case 'wealth':
          aVal = a.wealth || 0;
          bVal = b.wealth || 0;
          break;
        case 'bountyEarned':
          aVal = a.bountyEarned || 0;
          bVal = b.bountyEarned || 0;
          break;
        case 'casesOpened':
          aVal = a.casesOpened || 0;
          bVal = b.casesOpened || 0;
          break;
        case 'totalDamage':
          aVal = a.totalDamage || 0;
          bVal = b.totalDamage || 0;
          break;
        case 'weeklyDamage':
          aVal = a.weeklyDamage || 0;
          bVal = b.weeklyDamage || 0;
          break;
        default:
          aVal = 0;
          bVal = 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return sorted.map((player, idx) => {
      (player as any).localRank = idx + 1;
      return player;
    });
  }, [players, sortKey, sortOrder]);

  const highlightedRowIndex = useMemo(() => {
    return sortedPlayers.findIndex(p => p.id === highlightedPlayerId);
  }, [sortedPlayers, highlightedPlayerId]);

  if (!players || players.length === 0) {
    return <div style={styles.empty}>No players to display</div>;
  }

  return (
    <div style={styles.tableContainer}>
      <SortBar currentSort={sortKey} sortOrder={sortOrder} onSort={handleSort} />
      
      <div 
        style={styles.tableWrapper} 
        ref={(el) => {
          if (el && highlightedRowIndex !== -1) {
            const rows = el.querySelectorAll('tbody tr');
            if (rows[highlightedRowIndex]) {
              rows[highlightedRowIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }}
      >
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={{ ...styles.th, ...getColumnHighlight('localRank') }}>#</th>
              <th style={styles.th}>Player Name</th>
              <th style={styles.th}>Level</th>
              <th style={styles.th}>XP</th>
              <th style={{ ...styles.th, ...getColumnHighlight('wealth') }}>Wealth</th>
              <th style={{ ...styles.th, ...getColumnHighlight('bountyEarned') }}>Bounty</th>
              <th style={{ ...styles.th, ...getColumnHighlight('casesOpened') }}>Cases</th>
              <th style={{ ...styles.th, ...getColumnHighlight('totalDamage') }}>Total Dmg</th>
              <th style={{ ...styles.th, ...getColumnHighlight('weeklyDamage') }}>Weekly Dmg</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, idx) => {
              const localRank = (player as any).localRank || idx + 1;
              const rankColor = getRankColor(localRank);
              const isHighlighted = player.id === highlightedPlayerId;
              
              return (
                <tr
                  key={player.id || idx}
                  style={{
                    ...styles.row,
                    ...(isHighlighted ? styles.highlightedRow : {}),
                  }}
                >
                  <td style={{ ...styles.td, color: rankColor, fontWeight: 'bold' }}>{localRank}</td>
                  <td style={styles.td}>
                    <strong>{player.name || 'Unknown'}</strong>
                    {isHighlighted && <span style={styles.youBadge}> (You)</span>}
                  </td>
                  <td style={styles.td}>{player.level || '-'}</td>
                  <td style={styles.td}>{formatNumber(player.xp)}</td>
                  <td style={styles.td}>{formatNumber(player.wealth)}</td>
                  <td style={styles.td}>{formatNumber(player.bountyEarned)}</td>
                  <td style={styles.td}>{formatNumber(player.casesOpened)}</td>
                  <td style={styles.td}>{formatNumber(player.totalDamage)}</td>
                  <td style={styles.td}>{formatNumber(player.weeklyDamage)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div style={styles.footerNote}>
        <span>🏆 Gold: Top 10</span> | <span>🥈 Silver: Top 50</span> | <span>🥉 Bronze: Top 100</span>
        <span style={{ marginLeft: '20px' }}>✨ # sorted from 1 to 51 (ascending)</span>
      </div>
    </div>
  );
};

const styles = {
  tableContainer: {
    marginTop: '20px',
    borderRadius: '12px',
    backgroundColor: 'rgba(18, 18, 24, 0.7)',
    backdropFilter: 'blur(10px)',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(168, 85, 247, 0.15)',
  },
  tableWrapper: {
    overflowX: 'auto' as const,
    maxHeight: '550px',
    overflowY: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '1000px',
  },
  headerRow: {
    backgroundColor: 'rgba(28, 28, 36, 0.95)',
    borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  },
  th: {
    padding: '16px 12px',
    textAlign: 'left' as const,
    color: '#c4b5fd',
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    backgroundColor: 'rgba(28, 28, 36, 0.95)',
    position: 'sticky' as const,
    top: 0,
    transition: 'all 0.2s ease',
  },
  row: {
    borderBottom: '1px solid rgba(55, 55, 65, 0.4)',
    transition: 'all 0.2s ease',
  },
  highlightedRow: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderLeft: '3px solid #a855f7',
    borderRight: '3px solid #a855f7',
    boxShadow: 'inset 0 0 12px rgba(168, 85, 247, 0.1)',
  },
  td: {
    padding: '14px 12px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontWeight: 400,
  },
  empty: {
    textAlign: 'center' as const,
    padding: '60px',
    color: '#64748b',
    fontSize: '15px',
  },
  youBadge: {
    color: '#a855f7',
    fontSize: '11px',
    marginLeft: '8px',
    fontWeight: 500,
  },
  footerNote: {
    padding: '12px 16px',
    textAlign: 'center' as const,
    color: '#64748b',
    fontSize: '11px',
    borderTop: '1px solid rgba(55, 55, 65, 0.3)',
    backgroundColor: 'rgba(15, 15, 20, 0.5)',
    letterSpacing: '0.5px',
  },
} as const;

export default PlayerTable;