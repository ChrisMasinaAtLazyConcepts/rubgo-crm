// frontend/src/components/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with actual API call
    if (email === 'admin@rubgo.com' && password === 'admin') {
      setIsAuthenticated(true);
      setUser({ email, role: 'admin' } as any);
      return true;
    }
    // For demo, allow any login
    setIsAuthenticated(true);
    setUser({ email, role: 'user' } as any);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};