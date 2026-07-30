import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('eloquate_auth') === 'true'
  );
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: null,
    dailyGoal: 20,
    streak: 7,
  });

  const login = useCallback(() => {
    localStorage.setItem('eloquate_auth', 'true');
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('eloquate_auth');
    setIsAuthenticated(false);
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
