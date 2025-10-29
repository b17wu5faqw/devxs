import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentDraw, getListLastDraw, getBetTypes, sellBetV2, getLastDrawV2, getStatisticResultV2, getStatisticDoubleBetV2 } from '@/apis/rps';
import { useAuthStore } from '@/stores/authStore';

const INTERVAL_ENABLED = false;

export interface RpsCurrentDraw {
  id: number;
  draw_no: string;
  start_time?: string;
  end_time: string;
  status: number;
}

export interface RpsLastDraw {
  id: number;
  draw_no: string;
  start_time?: string;
  end_time: string;
  winner: 'CAI' | 'CON' | 'TIE';
  dealer: 'BUA' | 'KEO' | 'BAO';
  player: 'BUA' | 'KEO' | 'BAO';
  result?: string | number[];
}

export interface RpsBetType {
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

export interface RpsSellBetParams {
  codes: string;
  amount: string;
  drawId: string;
  betTypeId: string;
  betPoint: string;
}

export interface RpsSellBetResponse {
  status: number;
  message: string;
  data?: any;
}

// Lấy kỳ hiện tại
export const useCurrentDraw = () => {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ['rps', 'currentDraw'],
    queryFn: async () => {
      const response = await getCurrentDraw({ jwt_key: accessToken || '' });
      return response;
    },
    refetchInterval: INTERVAL_ENABLED ? 5000 : false,
    refetchIntervalInBackground: false,
    throwOnError: false,
  });
};

export const useListLastDraw = () => {
  const { accessToken } = useAuthStore();
  
  return useQuery({
    queryKey: ['rps', 'listLastDraw'],
    queryFn: async () => {
      const response = await getListLastDraw({ jwt_key: accessToken || '' });
      return response;
    },
    refetchInterval: 4000,
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
    queryKey: ['rps', 'betTypes'],
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

  const sellBet = async (params: RpsSellBetParams) => {
    const response = await sellBetV2({
      ...params,
      jwt_key: accessToken || ''
    });
    
    // Invalidate related queries after successful bet
    await queryClient.invalidateQueries({ queryKey: ['rps', 'currentDraw'] });
    await queryClient.invalidateQueries({ queryKey: ['rps', 'listLastDraw'] });
    
    return response;
  };

  return { sellBet };
};

// Lấy phiên hiện tại (dùng cho mục đích fill số kỳ)
export const useLastDraw = () => {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ['rps', 'lastDraw'],
    queryFn: async () => {
      const response = await getLastDrawV2({ jwt_key: accessToken || '' });
      return response;
    },
    refetchInterval: 4000,
    refetchIntervalInBackground: false,
    throwOnError: false,
  });
};

export const useInvalidateRpsQueries = () => {
  const queryClient = useQueryClient();
  
  const invalidateCurrentDraw = () => {
    return queryClient.invalidateQueries({ queryKey: ['rps', 'currentDraw'] });
  };
  
  const invalidateListLastDraw = () => {
    return queryClient.invalidateQueries({ queryKey: ['rps', 'listLastDraw'] });
  };

  const invalidateLastDraw = () => {
    return queryClient.invalidateQueries({ queryKey: ['rps', 'lastDraw'] });
  };
  
  const invalidateAllRpsQueries = () => {
    return queryClient.invalidateQueries({ queryKey: ['rps'] });
  };
  
  return {
    invalidateCurrentDraw,
    invalidateListLastDraw,
    invalidateLastDraw,
    invalidateAllRpsQueries,
  };
};

// Statistics hooks for RPS
export const useStatisticResult = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['rps', 'statisticResult'],
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

export const useStatisticDoubleBet = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['rps', 'statisticDoubleBet'],
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