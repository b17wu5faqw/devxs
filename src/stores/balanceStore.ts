import { create } from "zustand";
import { getAccountBalance } from "@/apis/auth";

interface BalanceState {
  balance: number | null;
  loading: boolean;
  error: string | null;
  fetchBalance: () => void;
}

const useBalanceStore = create<BalanceState>((set) => {
  return {
    balance: null,
    loading: false,
    error: null,

    fetchBalance: async () => {
      set({ loading: true, error: null });
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        try {
          const response = await getAccountBalance(access_token);
          if (response.status == 1) {
            set({ balance: response.data.balance, loading: false });
          } else {
            set({ balance: 0, loading: false });
          }
        } catch (error) {
          set({
            balance: 0,
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch balance",
            loading: false,
          });
        }
      } else {
        console.error("Access token is null");
      }
    },
  };
});

export default useBalanceStore;
