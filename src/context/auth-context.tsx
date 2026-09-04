'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  phone?: string | null;
  name: string;
  role: string;
  isArchivalMember: boolean;
}

export type AuthChannel = 'sms' | 'whatsapp' | 'email';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  defaultChannel: AuthChannel | 'password';
  openAuthModal: (channel?: AuthChannel | 'password') => void;
  closeAuthModal: () => void;
  sendOtp: (
    destination: string,
    channel: AuthChannel,
    countryCode?: string
  ) => Promise<{ success: boolean; error?: string; devOtp?: string; destination?: string }>;
  verifyOtp: (
    destination: string,
    otp: string,
    countryCode?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [defaultChannel, setDefaultChannel] = useState<AuthChannel | 'password'>('sms');

  // Verify active session on load
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      }
    } catch {
      // Session unavailable
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const openAuthModal = useCallback((channel: AuthChannel | 'password' = 'sms') => {
    setDefaultChannel(channel);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const sendOtp = useCallback(
    async (destination: string, channel: AuthChannel, countryCode: string = '+91') => {
      try {
        const res = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination,
            channel,
            countryCode,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || 'Failed to dispatch verification code.' };
        }

        return {
          success: true,
          devOtp: data.devOtp,
          destination: data.destination,
        };
      } catch {
        return { success: false, error: 'Network communication error. Please try again.' };
      }
    },
    []
  );

  const verifyOtp = useCallback(
    async (destination: string, otp: string, countryCode: string = '+91') => {
      try {
        const res = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination,
            otp,
            countryCode,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || 'Invalid verification code.' };
        }

        setUser(data.user);
        setIsAuthModalOpen(false);
        return { success: true };
      } catch {
        return { success: false, error: 'Verification service error. Please try again.' };
      }
    },
    []
  );

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    // Basic credential validation
    if (!email.includes('@') || password.length < 8) {
      return { success: false, error: 'Please provide a valid email and 8+ character password.' };
    }

    // In this archival architecture, credentials issue session
    const mockUser: AuthUser = {
      id: `usr_cred_${email.replace(/\W/g, '').slice(0, 8)}`,
      email,
      name: email.split('@')[0] ?? 'Collector',
      role: 'CUSTOMER',
      isArchivalMember: true,
    };

    setUser(mockUser);
    setIsAuthModalOpen(false);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue cleanup
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        defaultChannel,
        openAuthModal,
        closeAuthModal,
        sendOtp,
        verifyOtp,
        loginWithPassword,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
