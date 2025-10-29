import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentDraw, getListLastDraw, getBetTypes, sellBetV2, getStatisticResultV2, getStatisticLast30ResultV2, getStatisticGeneralV2, getStatisticDoubleBetV2, getLastDrawV2 } from '@/apis/sicbo';
import { useAuthStore } from '@/stores/authStore';
export interface SicboCurrentDraw {
  id: number;
  draw_no: string;
  start_time: string;
  end_time: string;
  status: number;
}
export interface SicboLastDraw {
  id: number;
  draw_no: string;
  start_time: string;
  end_time: string;
  result: string | number[];
}
export interface SicboBetType {
  id: number;
  name: string;
  code: string;
  odds: number;
  price_rate: string;
  prize_rate: string;
  description: string;
  example: string;
  help: string;
}
export interface SicboSellBetParams {
  codes: string;
  amount: string;
  drawId: string;
  betTypeId: string;
  betPoint: string;
}
export interface SicboSellBetResponse {
  status: number;
  message: string;
  data?: any;
}
export interface SicboStatisticResult {
  [key: string]: number | string;
}
export interface SicboStatisticLast30Result {
  [key: string]: number | string;
}

// Lấy kỳ hiện tại
export const useCurrentDraw = () => {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ['sicbo', 'currentDraw'],
    queryFn: async () => {
      const response = await getCurrentDraw({ jwt_key: accessToken || '' });
      return response;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    throwOnError: false,
  });
};

// Lấy danh sách kết quả gần nhất (5 items)
export const useListLastDraw = () => {
  const { accessToken } = useAuthStore();
  
  return useQuery({
    queryKey: ['sicbo', 'listLastDraw'],
    queryFn: async () => {
      const response = await getListLastDraw({ jwt_key: accessToken || '' });
      return response;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
  });
};

export const useBetTypes = () => {
  const { accessToken } = useAuthStore();
  
  return useQuery({
    queryKey: ['sicbo', 'betTypes'],
    queryFn: async () => {
      const response = await getBetTypes({ jwt_key: accessToken || '' });
      return response;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });
};

export const useSellBet = () => {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const sellBet = async (params: SicboSellBetParams) => {
    const response = await sellBetV2({
      ...params,
      jwt_key: accessToken || ''
    });
    
    // Invalidate related queries after successful bet
    await queryClient.invalidateQueries({ queryKey: ['sicbo', 'currentDraw'] });
    await queryClient.invalidateQueries({ queryKey: ['sicbo', 'listLastDraw'] });
    
    return response;
  };

  return { sellBet };
};

export const useStatisticGeneral = () => {
  const { accessToken } = useAuthStore();
  
  return useQuery({
    queryKey: ['sicbo', 'statisticGeneral'],
    queryFn: async () => {
      const response = await getStatisticGeneralV2({ jwt_key: accessToken || '' });
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });
};
// Tab Thống kê
export const useStatisticResult = () => {
  const { accessToken } = useAuthStore();
  
  return useQuery({
    queryKey: ['sicbo', 'statisticResult'],
    queryFn: async () => {
      const response = await getStatisticResultV2({ jwt_key: accessToken || '' });
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });
};

// Tab điểm số (Thống kê 30 kỳ gần nhất)
export const useStatisticLast30Result = () => {
  const { accessToken } = useAuthStore();
  
  return useQuery({
    queryKey: ['sicbo', 'statisticLast30Result'],
    queryFn: async () => {
      const response = await getStatisticLast30ResultV2({ jwt_key: accessToken || '' });
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });
};

// Tab Kèo Đôi
export const useStatisticDoubleBet = () => {
  const { accessToken } = useAuthStore();
  
  return useQuery({
    queryKey: ['sicbo', 'statisticDoubleBet'],
    queryFn: async () => {
      const response = await getStatisticDoubleBetV2({ jwt_key: accessToken || '' });
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });
};

// Lấy phiên hiện tại (dùng cho mục đích fill số kỳ)
export const useLastDraw = () => {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ['sicbo', 'lastDraw'],
    queryFn: async () => {
      const response = await getLastDrawV2({ jwt_key: accessToken || '' });
      return response;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    throwOnError: false,
  });
};

export const useInvalidateSicboQueries = () => {
  const queryClient = useQueryClient();
  
  const invalidateCurrentDraw = () => {
    return queryClient.invalidateQueries({ queryKey: ['sicbo', 'currentDraw'] });
  };
  
  const invalidateListLastDraw = () => {
    return queryClient.invalidateQueries({ queryKey: ['sicbo', 'listLastDraw'] });
  };

  const invalidateLastDraw = () => {
    return queryClient.invalidateQueries({ queryKey: ['sicbo', 'lastDraw'] });
  };

  const invalidateStatisticGeneral = () => {
    return queryClient.invalidateQueries({ queryKey: ['sicbo', 'statisticGeneral'] });
  };

  const invalidateStatisticResult = () => {
    return queryClient.invalidateQueries({ queryKey: ['sicbo', 'statisticResult'] });
  };

  const invalidateStatisticLast30Result = () => {
    return queryClient.invalidateQueries({ queryKey: ['sicbo', 'statisticLast30Result'] });
  };

  const invalidateStatisticDoubleBet = () => {
    return queryClient.invalidateQueries({ queryKey: ['sicbo', 'statisticDoubleBet'] });
  };
  
  const invalidateAllSicboQueries = () => {
    return queryClient.invalidateQueries({ queryKey: ['sicbo'] });
  };
  
  return {
    invalidateCurrentDraw,
    invalidateListLastDraw,
    invalidateLastDraw,
    invalidateStatisticGeneral,
    invalidateStatisticResult,
    invalidateStatisticLast30Result,
    invalidateStatisticDoubleBet,
    invalidateAllSicboQueries,
  };
}; 