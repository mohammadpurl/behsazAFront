import { useState, useEffect } from 'react';

interface User {
  role: string;
  municipality: string;
  name: string;
  permissions: string[];
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };
};
