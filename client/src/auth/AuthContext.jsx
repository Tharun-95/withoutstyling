import React, { createContext, useContext, useMemo, useState } from 'react';
import { authenticate, clearSession, getSession, persistSession } from './authStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Keep initial state in sync with localStorage so refresh keeps session.
  const [session, setSession] = useState(() => getSession());

  const value = useMemo(() => {
    const role = session?.role ?? null;
    const isAuthenticated = Boolean(session?.token && session?.role);

    return {
      session,
      role,
      isAuthenticated,

      /**
       * Performs dummy authentication and persists session.
       * Returns { ok: true } or { ok: false, error: 'wrong_role' | 'invalid_credentials' }.
       */
      login({ role: selectedRole, email, password }) {
        const result = authenticate({ role: selectedRole, email, password });
        if (!result.ok) return result;
        persistSession(result.session);
        setSession(result.session);
        return { ok: true };
      },

      logout() {
        clearSession();
        setSession(null);
      },
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
}

import React, { createContext, useContext, useMemo, useState } from 'react';
import { authenticate, clearSession, getSession, persistSession } from './authStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Keep initial state in sync with localStorage so refresh keeps session.
  const [session, setSession] = useState(() => getSession());

  const value = useMemo(() => {
    const role = session?.role ?? null;
    const isAuthenticated = Boolean(session?.token && session?.role);

    return {
      session,
      role,
      isAuthenticated,

      /**
       * Performs dummy authentication and persists session.
       * Returns { ok: true } or { ok: false, error: 'wrong_role' | 'invalid_credentials' }.
       */
      login({ role: selectedRole, email, password }) {
        const result = authenticate({ role: selectedRole, email, password });
        if (!result.ok) return result;
        persistSession(result.session);
        setSession(result.session);
        return { ok: true };
      },

      logout() {
        clearSession();
        setSession(null);
      },
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
}

