import {
  useWebSocket,
  WS_EVENTS,
} from "@/components/providers/WebSocketProvider";
import { MODAL } from "@/constant/modal";
import {
  useBetTypes,
  useCurrentDraw,
  useInvalidateRpsQueries,
  useListLastDraw,
  useSellBet,
  useStatisticDoubleBet,
  useStatisticResult,
} from "@/hooks/useRps";
import useModalStore from "@/stores/modalStore";
import { reliableTimeout } from "@/utils/reliableTimeout";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
export const useOanTuTiGame = (config: GameConfig = {}) => {
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
  const { invalidateAllRpsQueries } = useInvalidateRpsQueries();
  const { data: currentDrawData, isLoading: isLoadingCurrentDraw } =
    useCurrentDraw();
  const {
    data: statisticResultData,
    isLoading: isStatisticLoading,
    error: statisticError,
  } = useStatisticResult();
  const {
    data: statisticDoubleBetData,
    isLoading: isStatisticDoubleBetLoading,
    error: statisticDoubleBetError,
  } = useStatisticDoubleBet();

  const [currentDraw, setCurrentDraw] = useState<DrawType>({
    id: 1,
    draw_no: "OTT250608385",
    end_time: "2024-12-31T23:59:59",
    name: "Oẳn tù tì KU",
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
      if (
        bettingState.selectedChoices.length === 0 ||
        bettingState.betChip <= 0
      ) {
        return { totalChip: 0, totalPrize: 0 };
      }

      const totalChip =
        bettingState.betChip * bettingState.selectedChoices.length;
      const prizeRate = 2.95; // Có thể lấy từ betTypesData nếu cần
      const totalPrize = bettingState.betChip * prizeRate;

      return { totalChip, totalPrize };
    };

    const { totalChip, totalPrize } = calculateTotals();

    if (
      bettingState.totalChip !== totalChip ||
      bettingState.totalPrize !== totalPrize
    ) {
      setBettingState((prev) => ({
        ...prev,
        totalChip,
        totalPrize,
      }));
    }
  }, [
    bettingState.selectedChoices,
    bettingState.betChip,
    bettingState.totalChip,
    bettingState.totalPrize,
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [gameResults, setGameResults] = useState<any[]>([]);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(30);
  const [isShowingResult, setIsShowingResult] = useState<boolean>(false);
  const [currentPhaseResult, setCurrentPhaseResult] = useState<any>(null);
  const [lastProcessedDrawNo, setLastProcessedDrawNo] = useState<string>("");
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.DEFAULT);
  const [hasShownBettingClosedDialog, setHasShownBettingClosedDialog] =
    useState<boolean>(false);
  const [isBlinkingResults, setIsBlinkingResults] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [sessionBets, setSessionBets] = useState<any[]>([]);
  const [hasLoggedSession, setHasLoggedSession] = useState<boolean>(false);
  const previousGamePhaseRef = useRef<GamePhase | null>(null);
  const calculateInitialCountdown = useCallback(() => {
    const now = new Date();
    const currentSeconds = now.getSeconds();
    const remainingInBlock = 30 - (currentSeconds % 30);
    return remainingInBlock === 30 ? 30 : remainingInBlock;
  }, []);

  useEffect(() => {
    if (previousGamePhaseRef.current !== gamePhase) {
      previousGamePhaseRef.current = gamePhase;
      if (gamePhase === GamePhase.SHOW_RESULT) {
        invalidateAllRpsQueries();
      }
    }
  }, [
    gamePhase,
    LOG_SHOW,
    countdownSeconds,
    isShowingResult,
    isBlinkingResults,
    currentDraw.draw_no,
    invalidateAllRpsQueries,
  ]);

  // Khởi tạo countdown
  useEffect(() => {
    const initialCountdown = calculateInitialCountdown();
    setCountdownSeconds(initialCountdown);
  }, [
    calculateInitialCountdown,
    isConnected,
    TEST_MODEL_PopupBettingClosed,
    LOG_SHOW,
    gamePhase,
    currentDraw.draw_no,
  ]);

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

      setCurrentDraw((prev) => {
        const shouldUpdate =
          !prev.draw_no ||
          prev.draw_no !== drawData.draw_no ||
          prev.id !== drawData.id;

        return shouldUpdate
          ? {
            id: drawData.id,
            draw_no: drawData.draw_no,
            end_time: drawData.end_time,
            name: "Oẳn tù tì KU",
          }
          : prev;
      });

      setIsLoading(false);
    }
  }, [currentDrawData, LOG_SHOW]);

  const handleStartResultPhase = useCallback(() => {
    if (!hasShownBettingClosedDialog && !TEST_MODEL_PopupBettingClosed) {
      if (USE_MODAL_STORE) {
        openModal(MODAL.BETTING_CLOSED);
      }
      setHasShownBettingClosedDialog(true);
    }

    setGamePhase(GamePhase.SHOWING_RESULT);
    setIsShowingResult(true);
    setIsBlinkingResults(false); // Không blink trong SHOWING_RESULT
  }, [
    hasShownBettingClosedDialog,
    TEST_MODEL_PopupBettingClosed,
    USE_MODAL_STORE,
    openModal,
    LOG_SHOW,
  ]);

  const handleShowingResultTimeoutRef =
    useRef<(blinkingFallbackTimeout: NodeJS.Timeout | null) => void>();

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

  handleShowingResultTimeoutRef.current = (
    blinkingFallbackTimeout: NodeJS.Timeout | null
  ) => {
    if (blinkingFallbackTimeout) {
      clearTimeout(blinkingFallbackTimeout);
    }

    setIsShowingResult(false);
    setGamePhase(GamePhase.SHOW_RESULT);
    setIsBlinkingResults(true);
    phaseTimeoutsRef.current.showResult = reliableTimeout.setTimeout(
      () => {
        setGamePhase(GamePhase.DEFAULT);
        setIsBlinkingResults(false);

        phaseTimeoutsRef.current.default = reliableTimeout.setTimeout(
          () => {
            setCountdownSeconds(BETTING_SECONDS);
            setHasLoggedSession(false);
            setHasShownBettingClosedDialog(false); // Reset flag for next round
          },
          DEFAULT_SECONDS * 1000,
          "default-timeout"
        );
      },
      SHOWING_RESULT_SECONDS * 1000,
      "show-result-timeout"
    );
  };

  const addToSessionLog = useCallback(
    (action: string, data: any) => {
    },
    [LOG_SHOW]
  );

  const handleStartBet = useCallback(
    (event: CustomEvent) => {
      const { draw_no, end_time } = event.detail;
      const validId = currentDrawData?.data?.id || currentDraw.id || 1;

      setCurrentDraw((prev) => {
        const newDraw = {
          id: validId,
          draw_no,
          end_time,
          name: "Oẳn tù tì KU",
        };

        if (prev.draw_no !== draw_no) {
          setBettingState((prevBetting) => ({
            ...prevBetting,
            betChip: 0,
            selectedChoices: [],
            totalChip: 0,
            totalPrize: 0,
            message: "",
          }));
        }

        return newDraw;
      });

      setIsLoading(false);
      setHasLoggedSession(false);
    },
    [LOG_SHOW, currentDrawData, currentDraw.id]
  );

  const handleEndBet = useCallback(
    (event: CustomEvent) => {
      const { draw_no, end_time, dealer, player, winner } = event.detail;

      if (draw_no !== lastProcessedDrawNo) {
        setCurrentPhaseResult({ draw_no, end_time, dealer, player, winner });
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
      isBlinkingResults,
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
    const startBetHandler = (event: Event) =>
      handleStartBetRef.current?.(event);
    const endBetHandler = (event: Event) => handleEndBetRef.current?.(event);
    const gameResultHandler = (event: Event) =>
      handleGameResultRef.current?.(event);

    window.addEventListener(WS_EVENTS.RPS_START_BET, startBetHandler);
    window.addEventListener(WS_EVENTS.RPS_END_BET, endBetHandler);
    window.addEventListener(WS_EVENTS.RPS_GAME_RESULT, gameResultHandler);

    return () => {
      window.removeEventListener(WS_EVENTS.RPS_START_BET, startBetHandler);
      window.removeEventListener(WS_EVENTS.RPS_END_BET, endBetHandler);
      window.removeEventListener(WS_EVENTS.RPS_GAME_RESULT, gameResultHandler);
    };
  }, []); // Empty dependency - chỉ setup một lần

  const setupPhaseTimeouts = useCallback(() => {
    if (hasTriggeredPhaseTimeouts.current) return;
    hasTriggeredPhaseTimeouts.current = true;
    phaseTimeoutsRef.current.blinkingFallback = setTimeout(() => {
      setIsBlinkingResults(false);
    }, 10000);

    phaseTimeoutsRef.current.showingResult = reliableTimeout.setTimeout(
      () => {
        if (phaseTimeoutsRef.current.blinkingFallback) {
          clearTimeout(phaseTimeoutsRef.current.blinkingFallback);
          phaseTimeoutsRef.current.blinkingFallback = null;
        }
        handleShowingResultTimeoutRef.current?.(null);
      },
      SHOWING_RESULT_SECONDS * 1000,
      "showing-result-timeout"
    );
  }, [SHOWING_RESULT_SECONDS]);

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

      invalidateAllRpsQueries();
    };
  }, []); // Empty dependency - only cleanup on unmount

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (gamePhase === GamePhase.DEFAULT && !isShowingResult) {
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
    BETTING_SECONDS,
    SHOWING_RESULT_SECONDS,
    DEFAULT_SECONDS,
  ]);

  const recentDraws = useMemo(() => {
    const base: any[] =
      gameResults.length > 0
        ? gameResults
        : Array.isArray(lastDrawData?.data)
          ? lastDrawData!.data
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

  useEffect(() => {
    if (!currentPhaseResult?.draw_no) return;
    const t1 = reliableTimeout.setTimeout(
      () => {
        invalidateAllRpsQueries();
      },
      1500,
      "refetch-after-result-1"
    );
    const t2 = reliableTimeout.setTimeout(
      () => {
        invalidateAllRpsQueries();
      },
      4000,
      "refetch-after-result-2"
    );
    return () => {
      if (t1) reliableTimeout.clearTimeout(t1);
      if (t2) reliableTimeout.clearTimeout(t2);
    };
  }, [currentPhaseResult?.draw_no, invalidateAllRpsQueries]);
  const determineRpsWinner = useCallback(
    (dealer: string, player: string): string => {
      if (dealer === player) return "HOA"; // Tie
      if (
        (dealer === "BUA" && player === "KEO") ||
        (dealer === "KEO" && player === "BAO") ||
        (dealer === "BAO" && player === "BUA")
      ) {
        return "CAI"; // Dealer wins
      }

      if (
        (player === "BUA" && dealer === "KEO") ||
        (player === "KEO" && dealer === "BAO") ||
        (player === "BAO" && dealer === "BUA")
      ) {
        return "CON"; // Player wins
      }

      return "HOA"; // Default to tie if no clear winner
    },
    []
  );

  const getWinningCodes = useCallback(() => {
    const result =
      currentPhaseResult || (recentDraws.length > 0 ? recentDraws[0] : null);
    if (!result) return [];

    const codes: string[] = [];

    // Validate and potentially correct the winner based on RPS rules
    let correctedWinner = result.winner;
    if (result.dealer && result.player && result.dealer !== result.player) {
      const actualWinner = determineRpsWinner(result.dealer, result.player);
      if (actualWinner !== result.winner) {
        correctedWinner = actualWinner;
      }
    }

    // Win group - use corrected winner
    if (correctedWinner === "CAI") codes.push("CAI_WIN");
    if (correctedWinner === "CON") codes.push("CON_WIN");
    if (correctedWinner === "HOA") codes.push("HOA");

    // Cái/Con move
    if (result.dealer === "BUA") codes.push("CAI_BUA");
    if (result.dealer === "KEO") codes.push("CAI_KEO");
    if (result.dealer === "BAO") codes.push("CAI_BAO");
    if (result.player === "BUA") codes.push("CON_BUA");
    if (result.player === "KEO") codes.push("CON_KEO");
    if (result.player === "BAO") codes.push("CON_BAO");

    // Combination codes
    if (result.dealer === "BUA" && result.player === "KEO")
      codes.push("CAI_BUA_CON_KEO");
    if (result.dealer === "BUA" && result.player === "BAO")
      codes.push("CAI_BUA_CON_BAO");
    if (result.dealer === "KEO" && result.player === "BAO")
      codes.push("CAI_KEO_CON_BAO");
    if (result.dealer === "BUA" && result.player === "BUA")
      codes.push("CAI_BUA_CON_BUA");
    if (result.dealer === "KEO" && result.player === "KEO")
      codes.push("CAI_KEO_CON_KEO");
    if (result.dealer === "BAO" && result.player === "BAO")
      codes.push("CAI_BAO_CON_BAO");

    return codes;
  }, [currentPhaseResult, recentDraws, LOG_SHOW, determineRpsWinner]);

  const winningCodes = useMemo(() => getWinningCodes(), [getWinningCodes]);

  return {
    // State
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

    // Logging state
    sessionStartTime,
    setSessionStartTime,
    sessionBets,
    setSessionBets,
    hasLoggedSession,
    setHasLoggedSession,

    // API data
    betTypesData,
    lastDrawData,
    isConnected,
    isLoadingCurrentDraw,
    currentDrawData,

    // Statistics data (with fallback)
    statisticResultData: statisticResultData,
    statisticDoubleBetData: statisticDoubleBetData,
    isStatisticLoading,
    isStatisticDoubleBetLoading,
    statisticError,
    statisticDoubleBetError,

    // Functions
    calculateInitialCountdown,
    sellBet,
    invalidateAllRpsQueries,
    openModal,

    // Logging functions
    setSessionResult: LOG_SHOW ? setSessionResult : () => { },
    printSessionResult: LOG_SHOW ? printSessionResult : () => { },
    resetSessionResult: LOG_SHOW ? resetSessionResult : () => { },
    addToSessionLog,

    // Shared utility functions
    recentDraws,
    getWinningCodes,
    winningCodes,

    // Constants
    SHOWING_RESULT_SECONDS,
    DEFAULT_SECONDS,
    BETTING_SECONDS,
    TEST_MODEL_PopupBettingClosed,
    LOG_SHOW,

    // User interaction handlers
    handleOptionSelect: (optionId: string) => {
      setBettingState((prev) => {
        if (prev.selectedChoices.includes(optionId)) {
          if (LOG_SHOW) {
            // addToSessionLog("option_deselected", {
            //   option_id: optionId,
            //   remaining_choices: prev.selectedChoices.filter(
            //     (id) => id !== optionId
            //   ),
            //   countdown_seconds: countdownSeconds,
            //   timestamp: Date.now(),
            // });
          }

          return {
            ...prev,
            selectedChoices: prev.selectedChoices.filter(
              (id) => id !== optionId
            ),
          };
        } else {
          const conflictGroups = [
            ["CAI_WIN", "HOA", "CON_WIN"],
            ["CAI_BUA", "CAI_KEO", "CAI_BAO"],
            ["CON_BUA", "CON_KEO", "CON_BAO"],
          ];

          const hasConflict = conflictGroups.some((group) => {
            const isInSameGroup = group.includes(optionId);
            const hasSelectedInSameGroup = group.some((bet) =>
              prev.selectedChoices.includes(bet)
            );
            return isInSameGroup && hasSelectedInSameGroup;
          });

          if (hasConflict) {
            if (LOG_SHOW) {
              // addToSessionLog("option_conflict", {
              //   attempted_option: optionId,
              //   current_choices: prev.selectedChoices,
              //   conflict_groups: conflictGroups,
              //   countdown_seconds: countdownSeconds,
              //   timestamp: Date.now(),
              // });
            }
            return prev;
          }

          const newChoices = [...prev.selectedChoices, optionId];

          if (LOG_SHOW) {
            // addToSessionLog("option_selected", {
            //   option_id: optionId,
            //   new_choices: newChoices,
            //   total_choices: newChoices.length,
            //   countdown_seconds: countdownSeconds,
            //   timestamp: Date.now(),
            // });
          }

          return {
            ...prev,
            selectedChoices: newChoices,
          };
        }
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
      const effectiveBetChip = overrideBetChip ?? bettingState.betChip;
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

      // Convert to number for validation
      const numericBetChipForValidation = Number(effectiveBetChip);

      if (
        numericBetChipForValidation <= 0 ||
        isNaN(numericBetChipForValidation)
      ) {
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

      const tempValidDrawId = currentDrawData?.data?.id || currentDraw.id;

      if (!tempValidDrawId || isNaN(tempValidDrawId)) {
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
        const numericBetChip = Number(effectiveBetChip);
        const codesString = bettingState.selectedChoices.join("-");
        let validDrawId = currentDrawData?.data?.id || currentDraw.id;
        if (!validDrawId || isNaN(validDrawId)) {
          validDrawId = currentDraw.id;
        }

        const params = {
          codes: codesString,
          amount: numericBetChip.toString(),
          drawId: validDrawId.toString(),
          betTypeId: getRpsBetTypeId(
            bettingState.selectedChoices[0],
            betTypesData
          ),
          betPoint: numericBetChip.toString(),
        };
        const result = await sellBet(params);

        if (
          result?.status !== undefined &&
          result.status !== 200 &&
          result.status !== 1
        ) {
          throw new Error(
            result?.description || result?.message || `Đặt cược thất bại`
          );
        }

        await invalidateAllRpsQueries();

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

const getRpsBetTypeId = (betCode: string, betTypesData: any): string => {
  if (!betTypesData?.data) return "1";
  for (const [groupId, group] of Object.entries(betTypesData.data)) {
    const groupData = group as any;
    if (groupData.options) {
      const found = groupData.options.find(
        (option: any) => option.code === betCode
      );
      if (found) return groupId;
    }

    if (groupData.dealer) {
      const found = groupData.dealer.find(
        (option: any) => option.code === betCode
      );
      if (found) return groupId;
    }

    if (groupData.player) {
      const found = groupData.player.find(
        (option: any) => option.code === betCode
      );
      if (found) return groupId;
    }
  }

  return "1"; 
};
