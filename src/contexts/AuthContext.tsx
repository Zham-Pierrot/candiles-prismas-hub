import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '@/types/admin';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

const mockUsers: Record<UserRole, User> = {
  admin: { id: '1', name: 'Carlos Admin', email: 'admin@candiles.mx', role: 'admin' },
  vendedor: { id: '2', name: 'Laura Ventas', email: 'ventas@candiles.mx', role: 'vendedor' },
  instalador: { id: '3', name: 'Miguel Instalador', email: 'instalador@candiles.mx', role: 'instalador' },
  contador: { id: '4', name: 'Patricia Contadora', email: 'contabilidad@candiles.mx', role: 'contador' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (_email: string, _password: string, role: UserRole) => {
    const u = mockUsers[role];
    setUser(u);
    localStorage.setItem('admin_user', JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
