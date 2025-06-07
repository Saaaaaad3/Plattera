"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserRole = "RestOwner" | "Customer" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (token: string) => void;
  logout: (restaurantId?: string) => void;
}

interface DecodedToken {
  role: string; // Changed from UserRole to string since backend sends "RESTOWNER"
  sub: number;
  mobileNumber: string;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT token
function decodeToken(token: string): DecodedToken | null {
  try {
    // JWT tokens are in format: header.payload.signature
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Helper function to convert backend role to frontend role
function convertRole(backendRole: string): UserRole {
  switch (backendRole.toUpperCase()) {
    case "RESTOWNER":
      return "RestOwner";
    case "CUSTOMER":
      return "Customer";
    default:
      return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem("auth_token");
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.role) {
        setIsAuthenticated(true);
        setUserRole(convertRole(decodedToken.role));
      } else {
        // If token is invalid or doesn't contain role, clear it
        localStorage.removeItem("auth_token");
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []);

  const login = (token: string) => {
    const decodedToken = decodeToken(token);
    if (decodedToken && decodedToken.role) {
      localStorage.setItem("auth_token", token);
      setIsAuthenticated(true);
      setUserRole(convertRole(decodedToken.role));
    } else {
      console.error("Invalid token or missing role");
      // Don't set authentication state if token is invalid
    }
  };

  const logout = (restaurantId?: string) => {
    if (restaurantId) {
      // Use replace to prevent the authentication check from intercepting
      router.replace(`/restaurant/menu/${restaurantId}`);
    } else {
      router.replace("/");
    }
    // Clear auth state after navigation
    setTimeout(() => {
      localStorage.removeItem("auth_token");
      setIsAuthenticated(false);
      setUserRole(null);
    }, 0);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
