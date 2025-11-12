
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from './types';

// Mock users database
const MOCK_USERS: User[] = [
  { id: '1', email: 'editor@sulnews.com', role: UserRole.EDITOR },
  { id: '2', email: 'admin@sulnews.com', role: UserRole.ADMIN },
  { id: '3', email: 'collab@sulnews.com', role: UserRole.COLLABORATOR },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email);
        // In a real app, you'd check the password hash
        if (foundUser && pass === 'password123') {
          setUser(foundUser);
          resolve();
        } else {
          reject(new Error('Credenciais inválidas.'));
        }
      }, 500); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
