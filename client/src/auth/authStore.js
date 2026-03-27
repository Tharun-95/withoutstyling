// Centralized client-side auth helpers.
// This project requirement is dummy authentication (no database / no API).

const STORAGE_KEY = 'dummyAuth';

const DUMMY_ACCOUNTS = {
  user: { email: 'user@gmail.com', password: '1234' },
  admin: { email: 'admin@gmail.com', password: 'admin123' },
};

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
  // Back-compat: older pages in this repo read these keys directly.
  localStorage.removeItem('userRole');
  localStorage.removeItem('userToken');
}

export function persistSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  // Back-compat: keep these in sync so existing pages keep working.
  localStorage.setItem('userRole', session.role);
  localStorage.setItem('userToken', session.token);
}

/**
 * Dummy login validator.
 *
 * Error handling requirements:
 * - Invalid credentials (email/password don't match any dummy account)
 * - Wrong role selected (credentials are valid, but for the other role)
 */
export function authenticate({ role, email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '');
  const selectedRole = role === 'admin' ? 'admin' : 'user';

  const selected = DUMMY_ACCOUNTS[selectedRole];
  const otherRole = selectedRole === 'admin' ? 'user' : 'admin';
  const other = DUMMY_ACCOUNTS[otherRole];

  const matchesSelected =
    normalizedEmail === selected.email && normalizedPassword === selected.password;
  if (matchesSelected) {
    // Token is intentionally fake; it's only used as a "logged in" flag.
    return {
      ok: true,
      session: {
        token: `dummy-${selectedRole}-token`,
        role: selectedRole,
        email: normalizedEmail,
        loggedInAt: Date.now(),
      },
    };
  }

  const matchesOther =
    normalizedEmail === other.email && normalizedPassword === other.password;
  if (matchesOther) {
    return { ok: false, error: 'wrong_role' };
  }

  return { ok: false, error: 'invalid_credentials' };
}

