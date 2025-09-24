import {
  getCurrentDraw,
  getLastDraw,
  getListDraw,
  getType,
  history,
} from "@/apis/lotto";
import { useAuthStore } from "@/stores/authStore";
import { useCallback, useEffect, useState } from "react";

export interface DrawType {
  id?: number;
  draw_no?: string;
  end_time?: string;
  name?: string;
}

export interface LastDrawType {
  id?: number;
  draw_no?: string;
  end_time?: string;
  result?: any;
  groupedNumbers?: any;
}

export interface HistoryType {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalRecord: number;
  totalBet: number;
  totalWin: number;
  totalResult: number;
  data: HistoryItemType[];
}

export interface HistoryItemType {
  id?: number;
  title?: string;
  draw_no?: string;
  type?: string;
  bill_numbers?: string;
  bet_point: number;
  money?: number;
  money_win?: number;
  code?: string;
  rate?: number;
  created_time?: string;
}

export interface Button {
  id: number;
  help: string;
  name: string;
}
export interface ButtonGroup {
  groupTitle: string;
  buttons: Button[];
}

export interface Type {
  [key: string]: ButtonGroup[];
}

export const useCurrentDraw = (schedule_id: number, lotto_type: number) => {
  const [currentDraw, setCurrentDraw] = useState<DrawType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentDraw = async () => {
      try {
        const data = await getCurrentDraw({ schedule_id, lotto_type });
        setCurrentDraw(data.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentDraw();
  }, [schedule_id]);

  return { currentDraw, loading, error };
};

export const useLastDraw = (draw_id: number, lotto_type: number, scheduler_id: number) => {
  const [lastDraw, setLastDraw] = useState<LastDrawType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentDraw = async () => {
      try {
        const data = await getLastDraw({ draw_id, lotto_type, scheduler_id });
        setLastDraw(data.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentDraw();
  }, [draw_id]);

  return { lastDraw, loading, error };
};

export const useListDraw = (schedule_id: number, lotto_type: number) => {
  const [listDraw, setListDraw] = useState<DrawType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentDraw = async () => {
      try {
        const data = await getListDraw({ schedule_id, lotto_type }).then(
          (res) => {
            setListDraw(res.data || []);
          }
        );
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentDraw();
  }, [schedule_id]);

  return { listDraw, loading, error };
};

export const useGetType = () => {
  const [lottoType, setLottoType] = useState<Type | null>(null);

  useEffect(() => {
    const fetchType = async () => {
      try {
        const res = await getType();
        setLottoType(res.data || []);
      } catch (err: any) {
        console.error(err);
      } finally {
        console.log("done");
      }
    };

    fetchType();
  }, []);

  return { lottoType };
};

export const useHistory = (pageIndex: number, pageSize: number) => {
  const [lottoHistory, setLottoHistory] = useState<HistoryType | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { accessToken } = useAuthStore();

  const fetchHistory = useCallback(async () => {
    if (!accessToken) {
      console.error("Access token is null");
      return;
    }

    setIsRefreshing(true);
    try {
      const res = await history({ jwt_key: accessToken, pageIndex, pageSize });
      // Add a small delay to ensure backend has processed the new bet
      await new Promise((resolve) => setTimeout(resolve, 300));
      setLottoHistory(res.data || null);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [accessToken]);

  const reloadHistory = useCallback(() => {
    return fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { lottoHistory, reloadHistory, isRefreshing };
};
