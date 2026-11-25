import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import * as authService from '../services/authService';
import { ROLES } from '../constants/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getStoredSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const switchMode = useCallback(async (newMode) => {
    if (!user) return null;
    const target = newMode || (user.activeMode === ROLES.OWNER ? ROLES.SEEKER : ROLES.OWNER);
    const updated = await authService.switchMode(user, target);
    setUser(updated);
    return updated;
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      activeMode: user?.activeMode || user?.role || ROLES.SEEKER,
      switchMode,
      signIn: async (payload) => setUser(await authService.loginWithEmail(payload)),
      register: async (payload) => setUser(await authService.registerWithEmail(payload)),
      signOut: async () => {
        await authService.logout();
        setUser(null);
      },
    }),
    [user, loading, switchMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
}
