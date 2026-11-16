"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "./api";

interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  role: string;
  regionId: string;
  districtId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginAsSeller: (sellerProfile: User) => void;
  returnToDefaultIdentity: () => void;
  isSwitchedIdentity: boolean;
}

const DEMO_SWITCHED_KEY = "uzsavdo_demo_switched";

const defaultAdminUser: User = {
  id: "admin-id",
  login: "admin",
  firstName: "Admin",
  lastName: "Hokimiyat",
  companyName: "Toshkent shahar Hokimiyati",
  phone: "+998 71 200 00 00",
  role: "ADMIN",
  regionId: "reg-1",
  districtId: "dist-1"
};

const defaultDemoUser: User = {
  id: "demo-id",
  login: "demo",
  firstName: "Alisher",
  lastName: "Usmonov",
  companyName: "Sharq Agro Fayz MCHJ",
  phone: "+998 90 123 45 67",
  role: "USER",
  regionId: "reg-2",
  districtId: "dist-2"
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
  loginAsSeller: () => {},
  returnToDefaultIdentity: () => {},
  isSwitchedIdentity: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const isLoggedOut = localStorage.getItem("uzsavdo_logged_out");
      if (isLoggedOut === "true") {
        return null;
      }
      const saved = localStorage.getItem("uzsavdo_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
      // If first time visit and not logged out, default to demo user
      return defaultDemoUser;
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [isSwitchedIdentity, setIsSwitchedIdentity] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(DEMO_SWITCHED_KEY) === "true";
  });

  const refreshUser = async () => {
    if (typeof window !== "undefined" && localStorage.getItem("uzsavdo_logged_out") === "true") {
      setUser(null);
      return;
    }
    try {
      const data = await apiFetch("/me");
      if (data && (data.user || data.id)) {
        const u = data.user || data;
        setUser(u);
        if (typeof window !== "undefined") {
          localStorage.setItem("uzsavdo_user", JSON.stringify(u));
        }
      }
    } catch {}
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const applyIdentity = (userData: User, switched: boolean) => {
    setUser(userData);
    setIsSwitchedIdentity(switched);
    if (typeof window !== "undefined") {
      localStorage.removeItem("uzsavdo_logged_out");
      localStorage.setItem("uzsavdo_user", JSON.stringify(userData));
      if (switched) {
        localStorage.setItem(DEMO_SWITCHED_KEY, "true");
      } else {
        localStorage.removeItem(DEMO_SWITCHED_KEY);
      }
    }
  };

  const login = (userData: User) => applyIdentity(userData, false);

  const loginAsSeller = (sellerProfile: User) => applyIdentity(sellerProfile, true);

  const returnToDefaultIdentity = () => applyIdentity(defaultDemoUser, false);

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.setItem("uzsavdo_logged_out", "true");
      localStorage.removeItem("uzsavdo_user");
      localStorage.removeItem(DEMO_SWITCHED_KEY);
    }
    setUser(null);
    setIsSwitchedIdentity(false);
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser, loginAsSeller, returnToDefaultIdentity, isSwitchedIdentity }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { defaultAdminUser, defaultDemoUser };
