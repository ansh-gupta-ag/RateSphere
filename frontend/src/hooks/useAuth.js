import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
    setLoading(false);
  }, []);

  return { user, loading, isAuthenticated: isAuthenticated() };
};
