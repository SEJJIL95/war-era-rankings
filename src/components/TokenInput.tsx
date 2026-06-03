import React, { useState, useEffect, useCallback } from 'react';
import { getStoredToken, setApiToken, clearApiToken } from '../services/apiClient';

interface TokenInputProps {
  onTokenSet: (token: string) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ onTokenSet }) => {
  const [token, setToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  // استخدم useCallback عشان منعملش infinite loop
  const handleTokenSet = useCallback((newToken: string) => {
    onTokenSet(newToken);
    setIsTokenSet(true);
  }, [onTokenSet]);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
      setApiToken(storedToken);
      handleTokenSet(storedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependency array فاضي عشان يشغل مرة واحدة بس

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      setApiToken(token.trim());
      handleTokenSet(token.trim());
    }
  };

  const handleClear = () => {
    clearApiToken();
    setToken('');
    setIsTokenSet(false);
    handleTokenSet('');
  };

  if (isTokenSet) {
    return (
      <div style={styles.tokenSetContainer}>
        <span style={styles.successBadge}>✅ API Token Configured</span>
        <button onClick={handleClear} style={styles.clearButton}>
          Change Token
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>
          🔑 War Era API Token
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your API token"
            style={styles.input}
            required
          />
        </label>
        <button type="submit" style={styles.button}>
          Initialize API Client
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  },
  label: {
    flex: 1,
    fontSize: '14px',
    fontWeight: 600,
    color: '#e0e0e0',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #4a4a4a',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#5d8196',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  },
  tokenSetContainer: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#223822',
    opacity: 0.8,
    borderRadius: '6px',
  },
  successBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#10b981',
    fontSize: '12px',
    fontWeight: 500,
  },
  clearButton: {
    padding: '5px 10px',
    backgroundColor: '#383d7e',
    color: 'white',
    opacity: 0.9,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11.5px',
    fontWeight: 400,
  },
} as const;

export default TokenInput;