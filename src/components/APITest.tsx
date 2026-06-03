import React, { useState } from 'react';
import { getApiClient } from '../services/apiClient';

interface APITestProps {
  token: string;
}

const APITest: React.FC<APITestProps> = ({ token }) => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPIConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const client = getApiClient(token);
      console.log('API Client:', client);
      console.log('Available methods:', client ? Object.keys(client) : 'No client');
      
      setResult({
        clientExists: !!client,
        methods: client ? Object.keys(client) : [],
        tokenPrefix: token.substring(0, 10) + '...',
      });
    } catch (err: any) {
      setError(err.message);
      console.error('API Test Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={testAPIConnection} disabled={loading} style={styles.button}>
        {loading ? 'Testing...' : '🔧 Test API Connection'}
      </button>
      
      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={styles.result}>
          <h4>API Test Results:</h4>
          <pre style={styles.pre}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4a4a4a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#3a1a1a',
    border: '1px solid #dc2626',
    borderRadius: '4px',
    color: '#fca5a5',
  },
  result: {
    marginTop: '10px',
  },
  pre: {
    backgroundColor: '#0a0a0a',
    padding: '10px',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '12px',
    color: '#4ade80',
  },
} as const;

export default APITest;