'use client';

import { create } from 'zustand';
import { useRouter } from "next/navigation";
import { authenticateUser } from '@/service/axios.http';

interface AuthState {
  user: { email: string; isAdmin: boolean; token: string; } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const response = await authenticateUser(email, password);
    if (!!response) {
      set({ user: { email, isAdmin: true, token: `Bearer ${response.token}` } });
    }

    return !!response;
  },
  logout: () => {
    set({ user: null });
  },
}));

export const useLogout = () => {
  const router = useRouter();
  const logout = useAuth((state) => state.logout);

  return () => {
    router.push("/");
    logout();
  };
};