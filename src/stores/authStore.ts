import { create } from "zustand";

import { setAuth } from "@/apis/request";
import { loginAccount } from "@/apis/auth";

interface User {
  id: number;
  username: string;
  balance: number;
  redirect_url: string;
  agency_id: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  checkAuthOnLoad: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  checkAuthOnLoad: async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        const response = await loginAccount({ jwt_key: access_token });
        if (response.status == 1) {
          set({
            user: { ...response.data },
            accessToken: response.data.access_token,
          });
          setAuth(response.data.access_token);
          // const fetchWallets = useBalanceStore.getState().fetchBalance;
          // fetchWallets();
        }
      }
    } catch (error) {
      set({
        user: null,
      });
    }
  },
  setAccessToken: (token: string | null) => set({ accessToken: token }),
  setUser: (user: User | null) => set({ user }),
}));
