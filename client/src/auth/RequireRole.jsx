import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Route guard for role-based pages.
 * - Not logged in => redirects to /login
 * - Logged in with wrong role => redirects to /login
 */
export default function RequireRole({ role }) {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && session?.role !== role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, error: 'wrong_role' }}
      />
    );
  }

  return <Outlet />;
}

