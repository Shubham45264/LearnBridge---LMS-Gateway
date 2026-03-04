import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/services/authService";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  enrolledCourses?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const res = await authService.getProfile();
      //Profile API returns { success: true, data: { ...user } }
      //Login/Signup API returns { success: true, user: { ...user } }
      const userDoc = res.data.data || res.data.user || res.data;
      setUser(userDoc);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshProfile().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.signin({ email, password });
    setUser(res.data.user || res.data);
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    const res = await authService.signup({ name, email, password, role });
    setUser(res.data.user || res.data);
  };

  const logout = async () => {
    await authService.signout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
