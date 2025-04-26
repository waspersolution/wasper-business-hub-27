
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionContext as SessionContextType, UserRole } from '@/types/auth';

// Default session context
const defaultSession: SessionContextType = {
  userId: '',
  currentCompanyId: '',
  currentBranchId: '',
  currentRole: 'staff' as UserRole, // Explicitly cast to UserRole to satisfy TypeScript
  isAuthenticated: false,
};

type SessionContextProviderProps = {
  children: ReactNode;
};

// Create context with a default value
const SessionContextData = createContext<{
  session: SessionContextType;
  setSession: (session: SessionContextType) => void;
  clearSession: () => void;
  setRole: (role: UserRole) => void;
}>({
  session: defaultSession,
  setSession: () => {},
  clearSession: () => {},
  setRole: () => {},
});

// Custom hook for using the session context
export const useSession = () => useContext(SessionContextData);

export const SessionProvider: React.FC<SessionContextProviderProps> = ({ children }) => {
  const [session, setSessionState] = useState<SessionContextType>(() => {
    // Try to get session from localStorage on initial load
    try {
      const savedSession = localStorage.getItem('wasper_session');
      return savedSession ? JSON.parse(savedSession) : defaultSession;
    } catch (error) {
      console.error('Failed to parse session from localStorage:', error);
      return defaultSession;
    }
  });

  // Update localStorage when session changes
  useEffect(() => {
    try {
      if (session.isAuthenticated) {
        localStorage.setItem('wasper_session', JSON.stringify(session));
      } else {
        localStorage.removeItem('wasper_session');
      }
    } catch (error) {
      console.error('Failed to update session in localStorage:', error);
    }
  }, [session]);

  const setSession = (newSession: SessionContextType) => {
    setSessionState(newSession);
  };

  const clearSession = () => {
    setSessionState(defaultSession);
    localStorage.removeItem('wasper_session');
  };

  // Set only the current role (mock, for switching)
  const setRole = (role: UserRole) => {
    setSessionState((prev) => ({ ...prev, currentRole: role, isAuthenticated: true }));
  };

  const contextValue = {
    session,
    setSession,
    clearSession,
    setRole
  };

  return (
    <SessionContextData.Provider value={contextValue}>
      {children}
    </SessionContextData.Provider>
  );
};
