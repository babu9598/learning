import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roleCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('droptaxi_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('droptaxi_admin_token')
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res: any = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('droptaxi_admin_user', JSON.stringify(res.data));
        } catch (err) {
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email: string, password = 'adminPassword123!') => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/login', { email, password });
      const { user: loggedInUser, token: authToken } = res.data;

      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('droptaxi_admin_token', authToken);
      localStorage.setItem('droptaxi_admin_user', JSON.stringify(loggedInUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('droptaxi_admin_token');
    localStorage.removeItem('droptaxi_admin_user');
  };

  const hasRole = (roleCode: string): boolean => {
    if (!user || !user.role) return false;
    return user.role.code === 'SUPER_ADMIN' || user.role.code === roleCode;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role) return false;
    if (user.role.code === 'SUPER_ADMIN') return true;

    const rolePerms = user.role.permissions || [];
    const customPerms = user.customPermissions || [];
    return rolePerms.includes(permission) || customPerms.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
