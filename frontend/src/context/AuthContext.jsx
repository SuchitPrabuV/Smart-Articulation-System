import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('eloquate_auth') === 'true'
  );

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('eloquate_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData) => {
    const profile = {
      name: userData?.name || userData?.email?.split('@')[0] || 'User',
      email: userData?.email || '',
      avatar: userData?.avatar || null,
      dailyGoal: 20,
      streak: 7,
    };
    localStorage.setItem('eloquate_auth', 'true');
    localStorage.setItem('eloquate_user', JSON.stringify(profile));
    setIsAuthenticated(true);
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('eloquate_auth');
    localStorage.removeItem('eloquate_user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
