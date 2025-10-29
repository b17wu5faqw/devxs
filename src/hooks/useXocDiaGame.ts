import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  useWebSocket,
  WS_EVENTS,
} from "@/components/providers/WebSocketProvider";
import {
  useBetTypes,
  useSellBet,
  useInvalidateSicboQueries,
  useCurrentDraw,
  useListLastDraw,
} from "@/hooks/useSicbo";
import useModalStore from "@/stores/modalStore";
import { MODAL } from "@/constant/modal";
import { reliableTimeout } from "@/utils/reliableTimeout";

export interface DrawType {
  id: number;
  draw_no: string;
  end_time: string;
  name: string;
}

export interface BettingState {
  selectedChoices: string[];
  betChip: number;
  totalChip: number;
  totalPrize: number;
  isSubmitting: boolean;
  message: string;
}

export enum GamePhase {
  DEFAULT = "default",
  SHOWING_RESULT = "showing_result",
  SHOW_RESULT = "show_result",
}

export interface GameConfig {
  SHOWING_RESULT_SECONDS?: number;
  DEFAULT_SECONDS?: number;
  BETTING_SECONDS?: number;
  TEST_MODEL_PopupBettingClosed?: boolean;
  LOG_SHOW?: boolean;
  USE_MODAL_STORE?: boolean; // Để phân biệt desktop (true) và mobile (false)
}

let sessionResult: any = null;

const setSessionResult = (result: any) => {
  sessionResult = {
    ...result,
    timestamp: new Date().toISOString(),
  };
};

const printSessionResult = (sessionId: string) => {
};

const resetSessionResult = () => {
  sessionResult = null;
};

export const useXocDiaGame = (config: GameConfig = {}) => {
  const {
    SHOWING_RESULT_SECONDS = 3,
    DEFAULT_SECONDS = 3,
    BETTING_SECONDS = 30 -
    (config.SHOWING_RESULT_SECONDS || 3) -
    (config.DEFAULT_SECONDS || 3),
    TEST_MODEL_PopupBettingClosed = false,
    LOG_SHOW = true,
    USE_MODAL_STORE = true, // Desktop mặc định dùng modal store
  } = config;
  const { isConnected } = useWebSocket();
  const openModal = useModalStore((state) => state.openModal);
  const { data: betTypesData } = useBetTypes();
  const { data: lastDrawData } = useListLastDraw();
  const { sellBet } = useSellBet();
  const { invalidateAllSicboQueries } = useInvalidateSicboQueries();
  const { data: currentDrawData, isLoading: isLoadingCurrentDraw } =
    useCurrentDraw();

  const [currentDraw, setCurrentDraw] = useState<DrawType>({
    id: 1,
    draw_no: "XD250608385",
    end_time: "2024-12-31T23:59:59",
    name: "Xóc Đĩa KU",
  });

  const [bettingState, setBettingState] = useState<BettingState>({
    selectedChoices: [],
    betChip: 0,
    totalChip: 0,
    totalPrize: 0,
    isSubmitting: false,
    message: "",
  });

  useEffect(() => {
    const calculateTotals = () => {
      if (bettingState.selectedChoices.length === 0 || bettingState.betChip <= 0) {
        return { totalChip: 0, totalPrize: 0 };
      }

      const totalChip = bettingState.betChip * bettingState.selectedChoices.length;

      const prizeRate = 1.985; // Có thể lấy từ betTypesData nếu cần
      const totalPrize = bettingState.betChip * prizeRate;

      return { totalChip, totalPrize };
    };

    const { totalChip, totalPrize } = calculateTotals();

    if (bettingState.totalChip !== totalChip || bettingState.totalPrize !== totalPrize) {
      setBettingState(prev => ({
        ...prev,
        totalChip,
        totalPrize
      }));
    }
  }, [bettingState.selectedChoices, bettingState.betChip, bettingState.totalChip, bettingState.totalPrize]);

  const [isLoading, setIsLoading] = useState(true);
  const [gameResults, setGameResults] = useState<any[]>([]);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);
  const [isShowingResult, setIsShowingResult] = useState<boolean>(false);

  useEffect(() => {
  }, [isShowingResult, LOG_SHOW]);
  const [currentPhaseResult, setCurrentPhaseResult] = useState<any>(null);
  const [lastProcessedDrawNo, setLastProcessedDrawNo] = useState<string>("");
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.DEFAULT);
  const [hasShownBettingClosedDialog, setHasShownBettingClosedDialog] =
    useState<boolean>(false);
  const [isBlinkingResults, setIsBlinkingResults] = useState<boolean>(false);

  useEffect(() => {
    if (LOG_SHOW) {
      if (currentDraw?.end_time) {
        const endTs = Date.parse(currentDraw.end_time);
        const now = Date.now();
        const diffSeconds = Number.isNaN(endTs)
          ? null
          : Math.floor(Math.max(0, (endTs - now) / 1000));
      }
    }
  }, [countdownSeconds, LOG_SHOW]);

  useEffect(() => {
    if (previousGamePhaseRef.current !== gamePhase) {
      previousGamePhaseRef.current = gamePhase;

      if (gamePhase === GamePhase.SHOW_RESULT) {
        invalidateAllSicboQueries();
      }
    }
  }, [gamePhase, LOG_SHOW, countdownSeconds, isShowingResult, isBlinkingResults, currentDraw.draw_no, invalidateAllSicboQueries]);

  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [sessionBets, setSessionBets] = useState<any[]>([]);
  const [hasLoggedSession, setHasLoggedSession] = useState<boolean>(false);

  const previousGamePhaseRef = useRef<GamePhase | null>(null);
  const lastSyncedEndTimeRef = useRef<string | null>(null);
  const initialOffsetAppliedForEndTimeRef = useRef<string | null>(null);
  const calculateInitialCountdown = useCallback(() => {
    const nowMs = Date.now();
    const endTime = currentDraw?.end_time;

    if (endTime) {
      const endMs = Date.parse(endTime);
      if (!Number.isNaN(endMs)) {
        const remainingInBlock = Math.max(0, Math.floor((endMs - nowMs) / 1000));
        return Math.min(BETTING_SECONDS, remainingInBlock);
      }
    }

    const now = new Date();
    const currentSeconds = now.getSeconds();
    const remainingInBlock = (30 - (currentSeconds % 30)) % 30 || 30;
    return Math.min(BETTING_SECONDS, remainingInBlock);
  }, [currentDraw?.end_time, BETTING_SECONDS, LOG_SHOW]);

  const computeCountdownFromEndTime = useCallback(
    (endTime: string, applyInitialOffset: boolean) => {
      // Chuẩn hóa format thời gian phổ biến "YYYY-MM-DD HH:mm:ss" sang ISO để Date.parse ổn định trên production
      const normalizedEndTime =
        typeof endTime === "string" && endTime.includes(" ") && !endTime.includes("T")
          ? endTime.replace(" ", "T")
          : endTime;

      const endTimestamp = Date.parse(normalizedEndTime);
      if (Number.isNaN(endTimestamp)) return calculateInitialCountdown();

      const now = Date.now();
      let diffSeconds = Math.floor((endTimestamp - now) / 1000);

      if (applyInitialOffset) {
        const initialOffsetSeconds = 60 + 5;
        if (diffSeconds > initialOffsetSeconds) {
          diffSeconds -= initialOffsetSeconds;
        }
      }

      if (diffSeconds <= 0) {
        return calculateInitialCountdown();
      }

      return Math.min(BETTING_SECONDS, diffSeconds);
    },
    [calculateInitialCountdown, BETTING_SECONDS]
  );

  const analyzeDiceResult = useCallback((result: string) => {
    if (!result) return { taiXiu: '', chanLe: '', dicePattern: '' };

    const dices = result.split(',');
    const redCount = dices.filter(d => d === 'R').length;
    const whiteCount = dices.filter(d => d === 'W').length;

    const taiXiu = redCount >= 3 ? 'BIG' : 'SMALL';
    const chanLe = redCount % 2 === 0 ? 'EVEN' : 'ODD';

    let dicePattern = '';
    if (redCount === 4) dicePattern = 'ODDS_40';
    else if (whiteCount === 4) dicePattern = 'ODDS_04';
    else if (redCount === 3) dicePattern = 'ODDS_31';
    else if (whiteCount === 3) dicePattern = 'ODDS_13';
    else dicePattern = 'ODDS_22';

    return { taiXiu, chanLe, dicePattern };
  }, []);

  useEffect(() => {
    if (previousGamePhaseRef.current !== gamePhase) {
      previousGamePhaseRef.current = gamePhase;

      if (gamePhase === GamePhase.SHOW_RESULT) {
        invalidateAllSicboQueries();
      }
    }
  }, [gamePhase, LOG_SHOW, countdownSeconds, isShowingResult, isBlinkingResults, currentDraw.draw_no, invalidateAllSicboQueries]);

  useEffect(() => {
    if (gamePhase !== GamePhase.DEFAULT || isShowingResult) return;
    if (!currentDraw?.end_time) return;
    if (lastSyncedEndTimeRef.current === currentDraw.end_time) return;

    const shouldApplyInitialOffset = initialOffsetAppliedForEndTimeRef.current !== currentDraw.end_time;
    const syncedRaw = computeCountdownFromEndTime(currentDraw.end_time, shouldApplyInitialOffset);
    const synced = syncedRaw > 0 ? syncedRaw : calculateInitialCountdown();
    setCountdownSeconds((prev) => {
      if (prev <= 0) return synced; // khởi tạo
      return Math.min(prev, synced);
    });
    if (shouldApplyInitialOffset) {
      initialOffsetAppliedForEndTimeRef.current = currentDraw.end_time;
    }
    lastSyncedEndTimeRef.current = currentDraw.end_time;
  }, [gamePhase, isShowingResult, currentDraw.end_time, computeCountdownFromEndTime, LOG_SHOW]);

  useEffect(() => {
    if (TEST_MODEL_PopupBettingClosed) {
      const timer = setTimeout(() => {
        openModal(MODAL.BETTING_CLOSED);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [TEST_MODEL_PopupBettingClosed, openModal, LOG_SHOW]);

  useEffect(() => {
    if (currentDrawData?.data) {
      const drawData = currentDrawData.data;
      setCurrentDraw({
        id: drawData.id,
        draw_no: drawData.draw_no,
        end_time: drawData.end_time,
        name: "Xóc Đĩa KU",
      });
      setIsLoading(false);

      if (lastSyncedEndTimeRef.current !== drawData.end_time) {
        // Đồng bộ lần đầu mỗi kỳ: thử áp dụng offset nhưng có fallback an toàn
        const syncedWithOffset = computeCountdownFromEndTime(drawData.end_time, true);
        const safeSynced = syncedWithOffset > 0
          ? syncedWithOffset
          : computeCountdownFromEndTime(drawData.end_time, false);
        setCountdownSeconds(safeSynced);
        initialOffsetAppliedForEndTimeRef.current = drawData.end_time;
        lastSyncedEndTimeRef.current = drawData.end_time;
      }
    }
  }, [currentDrawData, computeCountdownFromEndTime, LOG_SHOW]);

  const handleStartResultPhase = useCallback(() => {
    if (!hasShownBettingClosedDialog && !TEST_MODEL_PopupBettingClosed) {
      if (USE_MODAL_STORE) {
        openModal(MODAL.BETTING_CLOSED);
      }
      setHasShownBettingClosedDialog(true);
    }
    setGamePhase(GamePhase.SHOWING_RESULT);
    setIsShowingResult(true);
    setIsBlinkingResults(false);
  }, [
    hasShownBettingClosedDialog,
    TEST_MODEL_PopupBettingClosed,
    USE_MODAL_STORE,
    openModal,
    LOG_SHOW,
  ]);

  const handleShowingResultTimeoutRef = useRef<(blinkingFallbackTimeout: NodeJS.Timeout | null) => void>();

  const phaseTimeoutsRef = useRef<{
    blinkingFallback: NodeJS.Timeout | null;
    showingResult: string | null;
    showResult: string | null;
    default: string | null;
  }>({
    blinkingFallback: null,
    showingResult: null,
    showResult: null,
    default: null,
  });

  const hasTriggeredPhaseTimeouts = useRef(false);

  const handleStartBetRef = useRef<any>(null);
  const handleEndBetRef = useRef<any>(null);
  const handleGameResultRef = useRef<any>(null);

  handleShowingResultTimeoutRef.current = (blinkingFallbackTimeout: NodeJS.Timeout | null) => {
    if (blinkingFallbackTimeout) {
      clearTimeout(blinkingFallbackTimeout);
    }

    setIsShowingResult(false);
    setGamePhase(GamePhase.SHOW_RESULT);
    setIsBlinkingResults(true);

    phaseTimeoutsRef.current.showResult = reliableTimeout.setTimeout(() => {
      setGamePhase(GamePhase.DEFAULT);
      setIsShowingResult(false);
      setIsBlinkingResults(false);

      phaseTimeoutsRef.current.default = reliableTimeout.setTimeout(() => {
        setCountdownSeconds(BETTING_SECONDS);
        setHasLoggedSession(false);
        setHasShownBettingClosedDialog(false);
      }, DEFAULT_SECONDS * 1000, 'default-timeout');
    }, SHOWING_RESULT_SECONDS * 1000, 'show-result-timeout');
  };

  const handleLogEvent = useCallback(
    (eventType: string, data: any) => {
    },
    [LOG_SHOW]
  );

  const addToSessionLog = useCallback(
    (action: string, data: any) => {
    },
    [LOG_SHOW]
  );

  const handleStartBet = useCallback(
    (event: CustomEvent) => {
      const { draw_no, end_time } = event.detail;
      const validId = currentDrawData?.data?.id || currentDraw.id || 1;

      setCurrentDraw(prev => {
        const newDraw = {
          id: validId,
          draw_no,
          end_time,
          name: "Xóc Đĩa KU",
        };

        setBettingState(prevBetting => ({
          ...prevBetting,
          betChip: 0,
          selectedChoices: [],
          totalChip: 0,
          totalPrize: 0,
          message: "",
        }));

        if (lastSyncedEndTimeRef.current !== end_time) {
          const shouldApplyInitialOffset = initialOffsetAppliedForEndTimeRef.current !== end_time;
          const synced = computeCountdownFromEndTime(end_time, shouldApplyInitialOffset);
          setCountdownSeconds((prev) => (prev <= 0 ? synced : Math.min(prev, synced)));
          if (shouldApplyInitialOffset) {
            initialOffsetAppliedForEndTimeRef.current = end_time;
          }
          lastSyncedEndTimeRef.current = end_time;
          setIsLoading(false);
          setHasLoggedSession(false);
        } else if (LOG_SHOW) {
        }

        return newDraw;
      });
    },
    [LOG_SHOW, currentDrawData, currentDraw.id, computeCountdownFromEndTime]
  );

  const handleEndBet = useCallback(
    (event: CustomEvent) => {
      const { draw_no, end_time, result } = event.detail;

      if (draw_no !== lastProcessedDrawNo) {
        setCurrentPhaseResult({ draw_no, end_time, result });
        setLastProcessedDrawNo(draw_no);
      }
    },
    [
      lastProcessedDrawNo,
      LOG_SHOW,
      sessionStartTime,
      bettingState,
      sessionBets,
      gamePhase,
      countdownSeconds,
      isShowingResult,
      isBlinkingResults
    ]
  );

  const handleGameResult = useCallback(
    (event: CustomEvent) => {
      const results = event.detail;
      if (Array.isArray(results)) {
        setGameResults(results.slice(0, 7));
        setIsLoading(false);
      }
    },
    [LOG_SHOW]
  );

  handleStartBetRef.current = handleStartBet;
  handleEndBetRef.current = handleEndBet;
  handleGameResultRef.current = handleGameResult;

  useEffect(() => {
    const startBetHandler = (event: Event) => handleStartBetRef.current?.(event);
    const endBetHandler = (event: Event) => handleEndBetRef.current?.(event);
    const gameResultHandler = (event: Event) => handleGameResultRef.current?.(event);

    window.addEventListener(WS_EVENTS.TX_START_BET, startBetHandler);
    window.addEventListener(WS_EVENTS.TX_END_BET, endBetHandler);
    window.addEventListener(WS_EVENTS.TX_GAME_RESULT, gameResultHandler);

    return () => {
      window.removeEventListener(WS_EVENTS.TX_START_BET, startBetHandler);
      window.removeEventListener(WS_EVENTS.TX_END_BET, endBetHandler);
      window.removeEventListener(WS_EVENTS.TX_GAME_RESULT, gameResultHandler);
    };
  }, []);

  const setupPhaseTimeouts = useCallback(() => {
    if (hasTriggeredPhaseTimeouts.current) return;
    hasTriggeredPhaseTimeouts.current = true;

    phaseTimeoutsRef.current.blinkingFallback = setTimeout(() => {
      setIsBlinkingResults(false);
    }, 10000);

    phaseTimeoutsRef.current.showingResult = reliableTimeout.setTimeout(() => {
      if (phaseTimeoutsRef.current.blinkingFallback) {
        clearTimeout(phaseTimeoutsRef.current.blinkingFallback);
        phaseTimeoutsRef.current.blinkingFallback = null;
      }

      handleShowingResultTimeoutRef.current?.(null);
    }, SHOWING_RESULT_SECONDS * 1000, 'showing-result-timeout');
  }, [SHOWING_RESULT_SECONDS, LOG_SHOW]);

  useEffect(() => {
    return () => {
      if (phaseTimeoutsRef.current.blinkingFallback) {
        clearTimeout(phaseTimeoutsRef.current.blinkingFallback);
        phaseTimeoutsRef.current.blinkingFallback = null;
      }

      if (phaseTimeoutsRef.current.showingResult) {
        reliableTimeout.clearTimeout(phaseTimeoutsRef.current.showingResult);
        phaseTimeoutsRef.current.showingResult = null;
      }

      if (phaseTimeoutsRef.current.showResult) {
        reliableTimeout.clearTimeout(phaseTimeoutsRef.current.showResult);
        phaseTimeoutsRef.current.showResult = null;
      }

      if (phaseTimeoutsRef.current.default) {
        reliableTimeout.clearTimeout(phaseTimeoutsRef.current.default);
        phaseTimeoutsRef.current.default = null;
      }

      invalidateAllSicboQueries();
    };
  }, []);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (gamePhase === GamePhase.DEFAULT && !isShowingResult && countdownSeconds > 0) {
      timerInterval = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            if (timerInterval) {
              clearInterval(timerInterval);
              timerInterval = null;
            }

            setHasLoggedSession(true);
            resetSessionResult();

            handleStartResultPhase();

            hasTriggeredPhaseTimeouts.current = false;

            setupPhaseTimeouts();

            return 0;
          }

          if (prev <= 0) {
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [
    gamePhase,
    isShowingResult,
    countdownSeconds,
    BETTING_SECONDS,
    SHOWING_RESULT_SECONDS,
    DEFAULT_SECONDS,
    handleStartResultPhase,
    setupPhaseTimeouts,
  ]);

  const recentDraws = useMemo(() => {
    const base: any[] =
      gameResults.length > 0
        ? gameResults
        : Array.isArray(lastDrawData?.data)
          ? (lastDrawData!.data as any[])
          : [];

    if (!currentPhaseResult) return base;

    const exists = base.some(
      (d: any) => String(d.draw_no) === String(currentPhaseResult.draw_no)
    );
    if (exists) return base;

    const merged: any[] = [currentPhaseResult, ...base];
    const seen = new Set<string>();
    const deduped: any[] = [];
    for (const item of merged) {
      const key = String(item.draw_no);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(item);
      }
    }
    return deduped;
  }, [gameResults, lastDrawData, currentPhaseResult]);

  const getWinningCodes = useCallback(() => {
    const result =
      currentPhaseResult || (recentDraws.length > 0 ? recentDraws[0] : null);
    if (!result) return [];

    const codes: string[] = [];

    if (result.result) {
      const analysis = analyzeDiceResult(result.result);
      codes.push(analysis.taiXiu, analysis.chanLe, analysis.dicePattern);
    }

    return codes;
  }, [currentPhaseResult, recentDraws, analyzeDiceResult]);

  const winningCodes = useMemo(() => getWinningCodes(), [getWinningCodes]);

  const getXocDiaFallbackBetTypeId = useCallback((betCode: string): string => {
    const xocDiaMapping: { [key: string]: string } = {
      'BIG': '1',
      'SMALL': '1',
      'ODD': '1',
      'EVEN': '1',

      'ODDS_04': '2',
      'ODDS_40': '2',
      'ODDS_13': '2',
      'ODDS_31': '2',
      'ODDS_22': '2',
      'ODDS_44': '2',
    };

    return xocDiaMapping[betCode] || "1";
  }, []);

  const getSicboBetTypeId = useCallback((betCode: string, betTypesData: any): string => {
    if (!betTypesData?.data) {
      return "1";
    }

    if (Array.isArray(betTypesData.data)) {
      const betType = betTypesData.data.find((bt: any) => bt.code === betCode);
      const result = betType?.id?.toString() || "1";
      return result;
    }

    if (typeof betTypesData.data === 'object') {
      for (const [groupId, group] of Object.entries(betTypesData.data)) {
        const groupData = group as any;

        if (groupData.options) {
          const found = groupData.options.find(
            (option: any) => option.code === betCode
          );
          if (found) {
            return groupId;
          }
        }

        if (groupData.code === betCode) {
          return groupId;
        }
      }
    }

    const xocDiaFallback = getXocDiaFallbackBetTypeId(betCode);
    if (xocDiaFallback !== "1") {
      return xocDiaFallback;
    }

    return "1";
  }, []);

  return {
    currentDraw,
    setCurrentDraw,
    bettingState,
    setBettingState,
    isLoading,
    setIsLoading,
    gameResults,
    setGameResults,
    countdownSeconds,
    setCountdownSeconds,
    isShowingResult,
    setIsShowingResult,
    currentPhaseResult,
    setCurrentPhaseResult,
    gamePhase,
    setGamePhase,
    isBlinkingResults,
    setIsBlinkingResults,
    hasShownBettingClosedDialog,
    setHasShownBettingClosedDialog,
    lastProcessedDrawNo,
    setLastProcessedDrawNo,

    sessionStartTime,
    setSessionStartTime,
    sessionBets,
    setSessionBets,
    hasLoggedSession,
    setHasLoggedSession,

    betTypesData,
    lastDrawData,
    isConnected,
    isLoadingCurrentDraw,
    currentDrawData,

    handleLogEvent,
    calculateInitialCountdown,
    sellBet,
    invalidateAllSicboQueries,
    openModal,
    analyzeDiceResult,

    setSessionResult: LOG_SHOW ? setSessionResult : () => { },
    printSessionResult: LOG_SHOW ? printSessionResult : () => { },
    resetSessionResult: LOG_SHOW ? resetSessionResult : () => { },
    addToSessionLog,

    recentDraws,
    getWinningCodes,
    winningCodes,

    SHOWING_RESULT_SECONDS,
    DEFAULT_SECONDS,
    BETTING_SECONDS,
    TEST_MODEL_PopupBettingClosed,
    LOG_SHOW,

    handleOptionSelect: (optionId: string) => {
      setBettingState((prev) => {
        const group1 = ['BIG', 'SMALL', 'ODD', 'EVEN'];
        const group2 = ['ODDS_04', 'ODDS_40', 'ODDS_13', 'ODDS_31', 'ODDS_22', 'ODDS_44'];

        const isOptionInGroup1 = group1.includes(optionId);
        const isOptionInGroup2 = group2.includes(optionId);

        let newSelectedChoices = [...prev.selectedChoices];

        if (newSelectedChoices.includes(optionId)) {
          newSelectedChoices = newSelectedChoices.filter(id => id !== optionId);
        } else {
          if (isOptionInGroup1) {
            newSelectedChoices = newSelectedChoices.filter(id => !group2.includes(id));
          } else if (isOptionInGroup2) {
            newSelectedChoices = newSelectedChoices.filter(id => !group1.includes(id));
          }
          newSelectedChoices.push(optionId);
        }

        const hasConflict = (bets: string[]) => {
          const hasTaiXiu = bets.includes('BIG') && bets.includes('SMALL');
          const hasChanLe = bets.includes('EVEN') && bets.includes('ODD');
          return hasTaiXiu || hasChanLe;
        };

        if (hasConflict(newSelectedChoices)) {
          if (optionId === 'BIG') {
            newSelectedChoices = newSelectedChoices.filter(code => code !== 'SMALL');
          } else if (optionId === 'SMALL') {
            newSelectedChoices = newSelectedChoices.filter(code => code !== 'BIG');
          } else if (optionId === 'EVEN') {
            newSelectedChoices = newSelectedChoices.filter(code => code !== 'ODD');
          } else if (optionId === 'ODD') {
            newSelectedChoices = newSelectedChoices.filter(code => code !== 'EVEN');
          }
        }

        return {
          ...prev,
          selectedChoices: newSelectedChoices
        };
      });
    },

    handleClickChip: (num: number) => {
      setBettingState((prev) => ({ ...prev, betChip: num }));
    },

    handleBetChipChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 0;
      setBettingState((prev) => ({ ...prev, betChip: value }));
    },

    handleCancel: () => {
      setBettingState((prev) => ({
        ...prev,
        selectedChoices: [],
        betChip: 0,
        totalChip: 0,
        totalPrize: 0,
      }));
    },

    handleSubmit: async (overrideBetChip?: number) => {
      const betStartTime = Date.now();
      const actualBetChip = overrideBetChip ?? bettingState.betChip;

      if (bettingState.selectedChoices.length === 0) {
        setBettingState((prev) => ({
          ...prev,
          message: "Vui lòng chọn ít nhất một tùy chọn cược!",
        }));
        setTimeout(
          () => setBettingState((prev) => ({ ...prev, message: "" })),
          3000
        );
        return;
      }

      const numericBetChipForValidation = Number(actualBetChip);

      if (numericBetChipForValidation <= 0 || isNaN(numericBetChipForValidation)) {
        setBettingState((prev) => ({
          ...prev,
          message: "Vui lòng nhập số tiền cược!",
        }));
        setTimeout(
          () => setBettingState((prev) => ({ ...prev, message: "" })),
          3000
        );
        return;
      }

      if (gamePhase !== GamePhase.DEFAULT) {
        setBettingState((prev) => ({
          ...prev,
          message: "Không thể đặt cược trong thời gian này!",
        }));
        setTimeout(
          () => setBettingState((prev) => ({ ...prev, message: "" })),
          3000
        );
        return;
      }
      if (countdownSeconds <= 5) {
        setBettingState((prev) => ({
          ...prev,
          message: "Không thể đặt cược trong thời gian này!",
        }));
        setTimeout(
          () => setBettingState((prev) => ({ ...prev, message: "" })),
          3000
        );
        return;
      }
      if (!currentDraw?.id) {
        setBettingState((prev) => ({
          ...prev,
          message: "Không tìm thấy thông tin kỳ quay hiện tại!",
        }));
        setTimeout(
          () => setBettingState((prev) => ({ ...prev, message: "" })),
          3000
        );
        return;
      }
      setBettingState((prev) => ({ ...prev, isSubmitting: true, message: "" }));
      try {
        const codesString = bettingState.selectedChoices.join("-");
        const betTypeId = getSicboBetTypeId(
          bettingState.selectedChoices[0],
          betTypesData
        );
        const numericBetChip = Number(actualBetChip);
        const params = {
          codes: codesString,
          amount: numericBetChip.toString(),
          drawId: currentDraw.id.toString(),
          betTypeId: betTypeId,
          betPoint: numericBetChip.toString(),
        };
        const result = await sellBet(params);
        if (
          result?.status !== undefined &&
          result.status !== 200 &&
          result.status !== 1
        ) {
          const errorMessage = result?.description || result?.message || `Đặt cược thất bại`;
          throw new Error(errorMessage);
        }
        await invalidateAllSicboQueries();
        const betData = {
          ...params,
          result,
          success: true,
          duration_ms: Date.now() - betStartTime,
          timestamp: Date.now(),
        };
        setSessionBets((prev) => [...prev, betData]);
        setBettingState((prev) => ({
          ...prev,
          message: "Đặt cược thành công!",
          selectedChoices: [],
          betChip: 0,
        }));

        setTimeout(
          () => setBettingState((prev) => ({ ...prev, message: "" })),
          3000
        );
      } catch (error: any) {
        let errorMessage = "Đặt cược thất bại. Vui lòng thử lại!";
        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.response?.data?.description) {
          errorMessage = error.response.data.description;
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!";
        } else if (error?.response?.status === 400) {
          errorMessage = "Thông tin cược không hợp lệ!";
        } else if (error?.response?.status === 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau!";
        }
        const betErrorData = {
          error: error?.message || errorMessage,
          error_details: {
            response_status: error?.response?.status,
            response_data: error?.response?.data,
            full_error: error,
          },
          selected_choices: bettingState.selectedChoices,
          bet_chip: bettingState.betChip,
          success: false,
          duration_ms: Date.now() - betStartTime,
          timestamp: Date.now(),
        };
        setSessionBets((prev) => [...prev, betErrorData]);
        setBettingState((prev) => ({ ...prev, message: errorMessage }));
        setTimeout(
          () => setBettingState((prev) => ({ ...prev, message: "" })),
          5000
        );
      } finally {
        setBettingState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
  };
};
