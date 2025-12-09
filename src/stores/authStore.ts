import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      signIn: async (email, password) => {
        set({ loading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Demo login - in production, this would validate against a real API
          if (email === 'demo@example.com' && password === 'password') {
            set({
              user: {
                id: '1',
                email,
                fullName: 'Demo User',
              },
            });
          } else {
            throw new Error('Invalid credentials');
          }
        } finally {
          set({ loading: false });
        }
      },
      signUp: async (email, password, fullName) => {
        set({ loading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set({
            user: {
              id: Math.random().toString(36).substr(2, 9),
              email,
              fullName,
            },
          });
        } finally {
          set({ loading: false });
        }
      },
      signOut: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);