import React, { useState } from 'react';
import { searchPlayers } from '../services/playerService';
import { Player } from '../types';
import { getApiClient } from '../services/apiClient'; // <-- ضيف السطر ده

interface PlayerSearchProps {
  token: string;
  onPlayerSelect: (player: Player) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ token, onPlayerSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // ===== debugging messages =====
    const client = getApiClient(token);
    console.log('🧪 الـ Client methods:', Object.keys(client || {}));
    console.log('🧪 الـ token موجود؟:', token ? '✅ نعم' : '❌ لا');
    console.log('🧪 البحث عن:', query);
    // ==============================

    setLoading(true);
    setError(null);
    try {
      const players = await searchPlayers(query, token);
      console.log('✅ النتيجة:', players);
      setResults(players);
      if (players.length === 0) {
        setError('No players found matching your search.');
      }
    } catch (err) {
      console.error('❌ الخطأ:', err);
      setError('Failed to search players. Please check your API token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a player by name..."
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      {results.length > 0 && (
        <div style={styles.results}>
          <h3 style={styles.resultsTitle}>Search Results ({results.length})</h3>
          <div style={styles.resultsList}>
            {results.map((player) => (
              <div
                key={player.id}
                onClick={() => onPlayerSelect(player)}
                style={styles.resultItem}
              >
                <div>
                  <strong>{player.name}</strong>
                  {player.level && <span style={styles.level}> Lvl {player.level}</span>}
                </div>
                {player.xp && <span style={styles.xp}>XP: {player.xp.toLocaleString()}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #4a4a4a',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
  },
  error: {
    padding: '10px',
    backgroundColor: '#3a1a1a',
    border: '1px solid #dc2626',
    borderRadius: '6px',
    color: '#fca5a5',
    marginBottom: '15px',
  },
  results: {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    padding: '15px',
  },
  resultsTitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    color: '#e0e0e0',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  resultItem: {
    padding: '10px',
    backgroundColor: '#2a2a2a',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  level: {
    marginLeft: '8px',
    color: '#a78bfa',
    fontSize: '12px',
  },
  xp: {
    color: '#fbbf24',
    fontSize: '14px',
  },
} as const;

export default PlayerSearch;