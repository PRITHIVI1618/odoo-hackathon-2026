import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { name: string; email: string } | null;
  login: (token: string, user: { name: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  user: null, // Ideally decode from JWT or fetch from /me
  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ isAuthenticated: true, token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, token: null, user: null });
  },
}))
