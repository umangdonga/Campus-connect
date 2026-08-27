import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { StudentProfile } from '../types';
import { INITIAL_STUDENT } from '../data/campusData';

interface AuthContextType {
  user: User | null;
  student: StudentProfile;
  loading: boolean;
  authError: string | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfileData: (updates: Partial<StudentProfile>) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as Partial<StudentProfile>;
            setStudent({
              ...INITIAL_STUDENT,
              ...data,
              userId: currentUser.uid,
              name: data.name || currentUser.displayName || INITIAL_STUDENT.name,
              email: currentUser.email || INITIAL_STUDENT.email,
              photoURL: currentUser.photoURL || undefined,
              isGoogleLinked: true,
            });
          } else {
            // New user registration - populate default student record
            const newProfile: StudentProfile = {
              ...INITIAL_STUDENT,
              userId: currentUser.uid,
              name: currentUser.displayName || INITIAL_STUDENT.name,
              email: currentUser.email || INITIAL_STUDENT.email,
              photoURL: currentUser.photoURL || undefined,
              isGoogleLinked: true,
            };

            await setDoc(userDocRef, {
              ...newProfile,
              updatedAt: new Date().toISOString(),
            });

            setStudent(newProfile);
          }
        } catch (err: unknown) {
          console.error('Error syncing user profile from Firestore:', err);
          // Fallback to in-memory profile with Google credentials
          setStudent({
            ...INITIAL_STUDENT,
            userId: currentUser.uid,
            name: currentUser.displayName || INITIAL_STUDENT.name,
            email: currentUser.email || INITIAL_STUDENT.email,
            photoURL: currentUser.photoURL || undefined,
            isGoogleLinked: true,
          });
        }
      } else {
        setStudent(INITIAL_STUDENT);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      console.error('Google Sign-In error:', err);
      const message = err instanceof Error ? err.message : 'Google authentication failed';
      // User closed popup or cancelled
      if (message.includes('popup-closed-by-user')) {
        setAuthError('Sign-in cancelled. Please try again.');
      } else {
        setAuthError(message);
      }
    }
  };

  const signOutUser = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setStudent(INITIAL_STUDENT);
    } catch (err: unknown) {
      console.error('Sign-out error:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      setAuthError(message);
    }
  };

  const updateProfileData = async (updates: Partial<StudentProfile>) => {
    const updated = { ...student, ...updates };
    setStudent(updated);

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(
          userDocRef,
          {
            ...updated,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error updating profile in Firestore:', err);
      }
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        loading,
        authError,
        isAuthModalOpen,
        setIsAuthModalOpen,
        signInWithGoogle,
        signOutUser,
        updateProfileData,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
