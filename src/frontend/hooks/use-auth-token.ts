import { useState, useEffect } from 'react';

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('auth_token');
    setToken(storedToken);
  }, []);

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
    if (isClient) {
      if (newToken) {
        localStorage.setItem('auth_token', newToken);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  };

  return {
    token,
    updateToken,
    isClient
  };
} 