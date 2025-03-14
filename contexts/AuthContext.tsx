// contexts/AuthContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { db } from '../lib/db';
import { AuthContextType } from '../types';
import { seedUserWithOnboardingNotes } from '../lib/onboarding';

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  error: null,
  signIn: async () => { },
  verifyCode: async () => { },
  signOut: async () => { },
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const previousUserRef = useRef<string | null>(null);

  // Get auth state from InstantDB
  const { isLoading, user, error } = db.useAuth();

  // Send magic code to email
  const signIn = async (email: string) => {
    try {
      await db.auth.sendMagicCode({ email });
      setSentEmail(email);
    } catch (error) {
      console.error('Failed to send magic code:', error);
      throw error;
    }
  };

  // Verify magic code and sign in
  const verifyCode = async (email: string, code: string) => {
    try {
      await db.auth.signInWithMagicCode({ email, code });
      setSentEmail(null);
    } catch (error) {
      console.error('Failed to verify code:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await db.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  };

  // Check if user is new and create onboarding notes
  useEffect(() => {
    const checkUserAndCreateNotes = async () => {
      // If we have a user and didn't have one before
      if (user && user.id && previousUserRef.current !== user.id) {
        try {
          // Query to check if user has any notes already
          const { data } = await db.queryOnce({
            notes: {
              $: {
                where: { 'creator.id': user.id },
                limit: 1
              }
            }
          });

          // If the user has no notes, they're likely new
          if (!data.notes || data.notes.length === 0) {
            console.log('Creating onboarding notes for new user');
            await seedUserWithOnboardingNotes(user);
          }

          // Update the previous user ref
          previousUserRef.current = user.id;
        } catch (error) {
          console.error('Error checking user notes:', error);
        }
      }
    };

    if (!isLoading && user) {
      checkUserAndCreateNotes();
    }
  }, [isLoading, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user && !sentEmail && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, user, sentEmail, router]);

  // Context value
  const value: AuthContextType = {
    isLoading,
    isAuthenticated: !!user,
    user,
    error: error as Error | null,
    signIn,
    verifyCode,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
