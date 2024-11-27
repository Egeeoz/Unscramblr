import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  username?: string;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const login = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
