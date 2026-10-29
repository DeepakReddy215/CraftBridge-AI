import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { UserProfile, UserRole } from '../types/api';
import { api } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  signup: (name: string, email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AUTH_USER_KEY = 'craftbridge_user_v1';
const AUTH_TOKEN_KEY = 'craftbridge_jwt_v1';

const defaultUser: UserProfile = {
  id: 'usr-artisan-01',
  name: 'Devi Prasad',
  email: 'devi.potter@craftbridge.io',
  role: 'artisan',
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultUser;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || 'mock_jwt_token_role_artisan';
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.setToken(token);
    } else {
      api.setToken(null);
    }
  }, [token]);

  const login = async (email: string, chosenRole: UserRole = 'customer') => {
    setIsLoading(true);
    try {
      const mockU: UserProfile = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        role: chosenRole,
        created_at: new Date().toISOString(),
      };
      const dummyToken = `jwt_${mockU.role}_${mockU.id}`;
      setUser(mockU);
      setToken(dummyToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockU));
      localStorage.setItem(AUTH_TOKEN_KEY, dummyToken);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        created_at: new Date().toISOString(),
      };
      const dummyToken = `jwt_${role}_${newUser.id}`;
      setUser(newUser);
      setToken(dummyToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(AUTH_TOKEN_KEY, dummyToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    api.setToken(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) {
      login(`artisan@craftbridge.io`, newRole);
      return;
    }
    const updated = { ...user, role: newRole };
    const newToken = `jwt_${newRole}_${user.id}`;
    setUser(updated);
    setToken(newToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        token,
        isLoading,
        login,
        signup,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
