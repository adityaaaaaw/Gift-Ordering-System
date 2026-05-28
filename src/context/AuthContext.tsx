"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "customer";
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, displayName: string) => Promise<boolean>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemoMode = !isFirebaseConfigured;

  // Track Auth state
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Check if user has admin email (simplification for clean role checking out-of-box)
          const isAdmin =
            firebaseUser.email?.toLowerCase() === "admin@giftly.com" ||
            firebaseUser.email?.toLowerCase() === "admin@gift.com" ||
            firebaseUser.email?.toLowerCase().includes("admin");

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
            role: isAdmin ? "admin" : "customer",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Mock Auth State initialization from LocalStorage
      if (typeof window !== "undefined") {
        const cachedUser = localStorage.getItem("giftly_auth_user");
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        await signInWithEmailAndPassword(auth, email, password);
        return true;
      } else {
        // Mock Login
        const lowercaseEmail = email.toLowerCase();
        if ((lowercaseEmail === "admin@giftly.com" || lowercaseEmail === "admin@gift.com") && password === "admin123") {
          // Success admin
          const adminUser: UserProfile = {
            uid: "mock-admin-uid",
            email: lowercaseEmail,
            displayName: "System Administrator",
            role: "admin",
          };
          setUser(adminUser);
          localStorage.setItem("giftly_auth_user", JSON.stringify(adminUser));
          setLoading(false);
          return true;
        } else if (password) {
          // Normal mock user login (any password works for demo!)
          const mockUser: UserProfile = {
            uid: "mock-user-" + Math.random().toString(36).substr(2, 9),
            email: email,
            displayName: email.split("@")[0],
            role: "customer",
          };
          setUser(mockUser);
          localStorage.setItem("giftly_auth_user", JSON.stringify(mockUser));
          setLoading(false);
          return true;
        }
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await auth.signOut();
      } else {
        // Mock Logout
        localStorage.removeItem("giftly_auth_user");
        setUser(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, displayName: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
        // Create user with dummy random password since we're focused on custom profiles
        const dummyPassword = "userpassword123";
        const credential = await createUserWithEmailAndPassword(auth, email, dummyPassword);
        await updateProfile(credential.user, { displayName });
        return true;
      } else {
        // Mock Register
        const mockUser: UserProfile = {
          uid: "mock-user-" + Math.random().toString(36).substr(2, 9),
          email,
          displayName,
          role: "customer",
        };
        setUser(mockUser);
        localStorage.setItem("giftly_auth_user", JSON.stringify(mockUser));
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
