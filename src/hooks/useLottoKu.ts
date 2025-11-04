import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const BASE_URL1 = "https://api-connect.apixoso.net";
// const WEBSOCKET_URL = "wss://ku-xs-socket.demogiaothong.com/";
const WEBSOCKET_URL = "wss://ku-xs-socket.demogiaothong.com";
const BASE_URL2 = "https://ku-xs-socket.demogiaothong.com";
const ACCESS_KEY = "1233254366768"; // Add your access key here
const API_ENDPOINTS = {
  BET_RULE_LISTS: `${BASE_URL1}/ku-live/bet-rule-lists`,
  BET_RULE: `${BASE_URL1}/ku-live/bet-rule`,

  SELL_LIVE_A: `${BASE_URL1}/ku-live/sell-a`,

  LOTTO_HISTORY: `${BASE_URL1}/lotto/history`,
  GAME_HISTORY: `${BASE_URL2}/api/game/kulotto-info`, 
  GAME_INFO: `${BASE_URL2}/api/game/kulotto-info`,
} as const;

const WEBSOCKET_CONSTANTS = {
  URL: WEBSOCKET_URL,
  METHODS: {
    ENTER_LOBBY: "EnterLobby",
    RESULT_HISTORY: "ResultHistory",
  },
  ACTIONS: {
    CARD: "broad",
  },
  GAME_TYPES: {
    LIVE_A: 162,
    LIVE_C: 164,
  },
} as const;

export interface LiveKuGameState {
  isConnected: boolean;
  gamePhase: "waiting" | "playing" | "finished";
  currentDraw: {
    id: number;
    draw_no: string;
    end_time: string;
    name: string;
  };
  winningCodes: string[];
  countdownSeconds: number;
  sessionStartTime: number | null;
  sessionDuration: number;
  error: string | null;
  gType: number;
  showResultOverlay: boolean;
  resultAnimation: {
    isAnimating: boolean;
    currentIndex: number;
    revealedCodes: string[];
  };
}

export interface LiveKuWebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: Record<string, unknown> | null;
}

export interface BetRule {
  id: number;
  name: string;
  help?: string | null;
  example?: string | null;
  description?: string | null;
  price_rate: number;
  prize_rate: number | null;
  input_type: number;
  max_bet: number;
  max_number: number;
}

export interface BetRuleGroup {
  groupTitle: string;
  buttons: BetRule[];
}

export interface BetRuleCategory {
  [categoryName: string]: BetRuleGroup[];
}

export interface BetRuleResponse {
  status: number;
  description: string;
  data: BetRuleCategory;
}

export interface GameHistory {
  id: number;
  draw_no: string;
  result: string;
  created_at: string;
  gType?: number;
}

export interface BetHistory {
  id: number;
  digits: string; // Đổi từ codes thành digits để phù hợp với API
  amount: string;
  drawId: string;
  betTypeId: string;
  betPoint: string;
  gType: string;
  status: string;
  created_at: string;
  result?: string;
  winAmount?: string;
}

export interface BettingFormData {
  digits: string; // Đổi từ codes thành digits để phù hợp với API
  amount: string;
  drawId: string;
  betTypeId: string;
  betPoint: number; // Đổi từ string thành number
  gType: string;
}

export interface BettingState {
  isPlacing: boolean;
  lastBetResult: any | null;
  error: string | null;
  success: boolean;
}

export interface BettingValidation {
  isValid: boolean;
  errors: string[];
}

export interface BetRuleState {
  rules: BetRuleCategory;
  selectedRule: BetRule | null;
  isLoading: boolean;
  error: string | null;
}

export interface HistoryState {
  gameHistory: GameHistory[];
  betHistory: BetHistory[];
  isLoadingGameHistory: boolean;
  isLoadingBetHistory: boolean;
  gameHistoryError: string | null;
  betHistoryError: string | null;
}

export interface GameInfoResponse {
  success: boolean;
  gType: string;
  gameType: string;
  sessionId: string;
  timestamp: string;
  data: {
    gType: number;
    game: {
      [key: string]: {
        gid: number;
        gameStatus: number;
        overMinute: number;
        endDate: number;
        isLive: boolean;
        batchLimit: number;
        isMaintain: boolean;
        isEnd: boolean;
      };
    };
  };
}

export interface GameInfo {
  gid: number;
  gameStatus: number;
  overMinute: number;
  endDate: number;
  isLive: boolean;
  batchLimit: number;
  isMaintain: boolean;
  isEnd: boolean;
}

export const useLottoKu = (gType: number = 162) => {
  const user = useAuthStore((s) => s.user);

  const getWebSocketURL = (gType: number): string => {
    if (gType === 166) {
      return "wss://api-connect.apixoso.net/ws/162";
    } else if (gType === 167) {
      return "wss://api-connect.apixoso.net/ws/164";
    }
    return "wss://api-connect.apixoso.net/ws/162";
  };

  // ==================== STATES ====================

  // WebSocket state
  const [wsState, setWsState] = useState<LiveKuWebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
  });

  // Game state
  const [gameState, setGameState] = useState<LiveKuGameState>({
    isConnected: false,
    gamePhase: "waiting",
    currentDraw: {
      id: 0,
      draw_no: "",
      end_time: "",
      name: "",
    },
    winningCodes: [],
    countdownSeconds: 43,
    sessionStartTime: null,
    sessionDuration: 43,
    error: null,
    gType: gType,
    showResultOverlay: false,
    resultAnimation: {
      isAnimating: false,
      currentIndex: 0,
      revealedCodes: [],
    },
  });

  // Betting state
  const [bettingState, setBettingState] = useState<BettingState>({
    isPlacing: false,
    lastBetResult: null,
    error: null,
    success: false,
  });

  // Rules state
  const [ruleState, setRuleState] = useState<BetRuleState>({
    rules: {},
    selectedRule: null,
    isLoading: false,
    error: null,
  });

  // History state
  const [historyState, setHistoryState] = useState<HistoryState>({
    gameHistory: [],
    betHistory: [],
    isLoadingGameHistory: false,
    isLoadingBetHistory: false,
    gameHistoryError: null,
    betHistoryError: null,
  });

  // Flag: initialized current draw from first of [loginBackBS, newGame]
  const [hasInitializedDraw, setHasInitializedDraw] = useState<boolean>(false);

  // ==================== REFS ====================
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ==================== GAME FUNCTIONS ====================

  const updateGameState = useCallback((updates: Partial<LiveKuGameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateCountdown = useCallback((seconds: number) => {
    setGameState(prev => ({ ...prev, countdownSeconds: seconds }));
  }, []);

  const resetGame = useCallback(() => {
    const startTime = Date.now();

    setGameState(prev => ({
      ...prev,
      gamePhase: "waiting",
      countdownSeconds: 43,
      sessionStartTime: startTime,
      sessionDuration: 43,
      winningCodes: [],
      showResultOverlay: false,
      resultAnimation: {
        isAnimating: false,
        currentIndex: 0,
        revealedCodes: [],
      },
    }));
  }, []);

  // Parse kết quả từ message
  const parseCardResult = useCallback((msg: string): string[] => {
    const parts = msg.split('|');
    if (parts.length < 2) return [];
    
    const resultPart = parts[1];
    const codes = resultPart.split(',');
    
    while (codes.length < 5) {
      codes.push('');
    }
    
    return codes;
  }, []);

  // Bắt đầu animation hiển thị kết quả - Logic mới
  const startResultAnimation = useCallback((codes: string[]) => {
    setGameState(prev => {
      const initialCodes = Array(5).fill('k');
      
      // Cập nhật các vị trí có số thực từ trái sang phải (A, B, C, D, E)
      codes.forEach((code, index) => {
        if (code && code !== '') {
          const position = index; // Từ trái sang phải: A(0), B(1), C(2), D(3), E(4)
          initialCodes[position] = code;
        }
      });

      return {
        ...prev,
        showResultOverlay: true,
        resultAnimation: {
          isAnimating: true,
          currentIndex: 0,
          revealedCodes: initialCodes,
        },
        winningCodes: codes,
      };
    });

    // Animation từ trái sang phải (index 0 -> 4)
    let currentStep = 0;
    const totalSteps = 5;

    const animateStep = () => {
      if (currentStep < totalSteps) {
        setGameState(prev => {
          const newRevealedCodes = [...prev.resultAnimation.revealedCodes];
          
          // Hiển thị từ trái sang phải (index 0 -> 4)
          // Mỗi bước sẽ reveal một vị trí từ trái sang phải
          if (currentStep < codes.length) {
            newRevealedCodes[currentStep] = codes[currentStep];
          }

          return {
            ...prev,
            resultAnimation: {
              ...prev.resultAnimation,
              currentIndex: currentStep,
              revealedCodes: newRevealedCodes,
            },
          };
        });
        
        currentStep++;
        setTimeout(animateStep, 1000); // Mỗi bước cách nhau 500ms
      } else {
        // Kết thúc animation
        setGameState(prev => ({
          ...prev,
          resultAnimation: {
            ...prev.resultAnimation,
            isAnimating: false,
          },
        }));
      }
    };

    animateStep();
  }, []);

  const validateBettingData = useCallback((data: BettingFormData): BettingValidation => {
    const errors: string[] = [];

    if (!data.digits || data.digits.trim() === '') {
      errors.push('Mã số không được để trống');
    }

    if (!data.amount || data.amount.trim() === '') {
      errors.push('Số tiền cược không được để trống');
    } else {
      const amount = parseFloat(data.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.push('Số tiền cược phải là số dương');
      }
    }

    if (!data.drawId || data.drawId.trim() === '') {
      errors.push('ID phiên không được để trống');
    }

    if (!data.betTypeId || data.betTypeId.trim() === '') {
      errors.push('Loại cược không được để trống');
    }

    if (data.betPoint === undefined || data.betPoint === null) {
      errors.push('Điểm cược không được để trống');
    } else {
      if (typeof data.betPoint !== 'number' || data.betPoint <= 0) {
        errors.push('Điểm cược phải là số dương');
      }
    }

    if (!data.gType || data.gType.trim() === '') {
      errors.push('Loại game không được để trống');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Place a bet
  const placeBet = useCallback(async (betData: BettingFormData): Promise<any> => {
    // Validate data first
    const validation = validateBettingData(betData);
    if (!validation.isValid) {
      setBettingState(prev => ({
        ...prev,
        error: validation.errors.join(', '),
        success: false
      }));
      return null;
    }

    setBettingState(prev => ({
      ...prev,
      isPlacing: true,
      error: null,
      success: false
    }));

    try {
      const jwtKey = localStorage.getItem('jwt_key') || '';
      const response = await axios.post(API_ENDPOINTS.SELL_LIVE_A, {
        ...betData,
        jwt_key: jwtKey
      });

      setBettingState(prev => ({
        ...prev,
        isPlacing: false,
        lastBetResult: response.data,
        success: true,
        error: null
      }));

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt cược';

      setBettingState(prev => ({
        ...prev,
        isPlacing: false,
        error: errorMessage,
        success: false
      }));

      return null;
    }
  }, [validateBettingData]);

  // Reset betting state
  const resetBettingState = useCallback(() => {
    setBettingState({
      isPlacing: false,
      lastBetResult: null,
      error: null,
      success: false,
    });
  }, []);

  // Clear betting error
  const clearBettingError = useCallback(() => {
    setBettingState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  // Clear betting success
  const clearBettingSuccess = useCallback(() => {
    setBettingState(prev => ({
      ...prev,
      success: false
    }));
  }, []);
  // Fetch all bet rules
  const fetchBetRules = useCallback(async (): Promise<BetRuleCategory | null> => {
    setRuleState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const jwtKey = localStorage.getItem('jwt_key') || '';
      const response = await axios.get(`${API_ENDPOINTS.BET_RULE_LISTS}?jwt_key=${jwtKey}`);

      const rulesData = response.data?.data || {};
      setRuleState(prev => ({
        ...prev,
        rules: rulesData,
        isLoading: false,
        error: null
      }));

      return rulesData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tải danh sách quy tắc cược';

      setRuleState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      return null;
    }
  }, []);

  // Fetch specific bet rule
  const fetchBetRule = useCallback(async (betTypeId: string): Promise<BetRule | null> => {
    setRuleState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const jwtKey = localStorage.getItem('jwt_key') || '';
      const response = await axios.get(`${API_ENDPOINTS.BET_RULE}?jwt_key=${jwtKey}&betTypeId=${betTypeId}`);

      const rule = response.data;
      setRuleState(prev => ({
        ...prev,
        selectedRule: rule,
        isLoading: false,
        error: null
      }));

      return rule;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tải quy tắc cược';

      setRuleState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      return null;
    }
  }, []);

  // Select a rule
  const selectRule = useCallback((rule: BetRule) => {
    setRuleState(prev => ({
      ...prev,
      selectedRule: rule
    }));
  }, []);

  // Clear selected rule
  const clearSelectedRule = useCallback(() => {
    setRuleState(prev => ({
      ...prev,
      selectedRule: null
    }));
  }, []);

  // Clear rules error
  const clearRulesError = useCallback(() => {
    setRuleState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  // Get rule by ID
  const getRuleById = useCallback((id: number): BetRule | undefined => {
    for (const categoryName in ruleState.rules) {
      const groups = ruleState.rules[categoryName];
      for (const group of groups) {
        const rule = group.buttons.find(rule => rule.id === id);
        if (rule) return rule;
      }
    }
    return undefined;
  }, [ruleState.rules]);

  // Get active rules only
  const getActiveRules = useCallback((): BetRule[] => {
    const activeRules: BetRule[] = [];
    for (const categoryName in ruleState.rules) {
      const groups = ruleState.rules[categoryName];
      for (const group of groups) {
        activeRules.push(...group.buttons);
      }
    }
    return activeRules;
  }, [ruleState.rules]);

  // Get rules by category
  const getRulesByCategory = useCallback((categoryName: string): BetRuleGroup[] => {
    return ruleState.rules[categoryName] || [];
  }, [ruleState.rules]);

  // Get all categories
  const getCategories = useCallback((): string[] => {
    return Object.keys(ruleState.rules);
  }, [ruleState.rules]);

  // Get rules by group title
  const getRulesByGroupTitle = useCallback((categoryName: string, groupTitle: string): BetRule[] => {
    const groups = ruleState.rules[categoryName] || [];
    const group = groups.find(g => g.groupTitle === groupTitle);
    return group?.buttons || [];
  }, [ruleState.rules]);

  const fetchGameHistory = useCallback(async (gameType: number = gType, limit: number = 100): Promise<GameHistory[] | null> => {
    setHistoryState(prev => ({
      ...prev,
      isLoadingGameHistory: true,
      gameHistoryError: null
    }));

    try {
      const response = await axios.get(`${API_ENDPOINTS.GAME_HISTORY}/${gameType}?limit=${limit}`);
      const history = response.data || [];

      setHistoryState(prev => ({
        ...prev,
        gameHistory: history,
        isLoadingGameHistory: false,
        gameHistoryError: null
      }));

      return history;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tải lịch sử kết quả';

      setHistoryState(prev => ({
        ...prev,
        isLoadingGameHistory: false,
        gameHistoryError: errorMessage
      }));

      return null;
    }
  }, [gType]);

  // Fetch bet history
  const fetchBetHistory = useCallback(async (): Promise<BetHistory[] | null> => {
    setHistoryState(prev => ({
      ...prev,
      isLoadingBetHistory: true,
      betHistoryError: null
    }));

    try {
      const jwtKey = localStorage.getItem('jwt_key') || '';
      const response = await axios.post(API_ENDPOINTS.LOTTO_HISTORY, {
        jwt_key: jwtKey
      });

      const history = response.data || [];

      setHistoryState(prev => ({
        ...prev,
        betHistory: history,
        isLoadingBetHistory: false,
        betHistoryError: null
      }));

      return history;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tải lịch sử cược';

      setHistoryState(prev => ({
        ...prev,
        isLoadingBetHistory: false,
        betHistoryError: errorMessage
      }));

      return null;
    }
  }, []);

  const fetchCurrentDraw = useCallback(async (): Promise<any> => {
  try {
    const gameInfo = await fetchGameInfo(gType);
    
    if (gameInfo) {
      const gIdString = gameInfo.gid.toString();
      const lastFourDigits = gIdString.slice(-3);
      
      setGameState(prev => ({
        ...prev,
        currentDraw: {
          id: gameInfo.gid,
          draw_no: gIdString,
          end_time: new Date().toISOString(),
          name: `Live KU ${gType === 162 ? 'A' : gType === 164 ? 'C' : ''}`
        },
        countdownSeconds: Math.floor(gameInfo.endDate + gameInfo.overMinute - 2),
      }));
      
      return gameInfo;
    }
    
    return null;
  } catch (error: any) {
    console.error('❌ Lỗi khi fetch thông tin kỳ hiện tại:', error);
    return null;
  }
}, [gType]);

  // Get latest game result
  const getLatestGameResult = useCallback((): GameHistory | null => {
    if (historyState.gameHistory.length === 0) return null;
    return historyState.gameHistory[0];
  }, [historyState.gameHistory]);

  // Get recent game results
  const getRecentGameResults = useCallback((count: number = 10): GameHistory[] => {
    return historyState.gameHistory.slice(0, count);
  }, [historyState.gameHistory]);

  // Get recent bet history
  const getRecentBetHistory = useCallback((count: number = 10): BetHistory[] => {
    return historyState.betHistory.slice(0, count);
  }, [historyState.betHistory]);

  // Get bet history by status
  const getBetHistoryByStatus = useCallback((status: string): BetHistory[] => {
    return historyState.betHistory.filter(bet => bet.status === status);
  }, [historyState.betHistory]);

  // Get winning bets
  const getWinningBets = useCallback((): BetHistory[] => {
    return historyState.betHistory.filter(bet => bet.status === 'win' || bet.winAmount);
  }, [historyState.betHistory]);

  // Get losing bets
  const getLosingBets = useCallback((): BetHistory[] => {
    return historyState.betHistory.filter(bet => bet.status === 'lose' || (!bet.winAmount && bet.status !== 'pending'));
  }, [historyState.betHistory]);

  // Get pending bets
  const getPendingBets = useCallback((): BetHistory[] => {
    return historyState.betHistory.filter(bet => bet.status === 'pending');
  }, [historyState.betHistory]);

  // Clear game history error
  const clearGameHistoryError = useCallback(() => {
    setHistoryState(prev => ({
      ...prev,
      gameHistoryError: null
    }));
  }, []);

  const clearBetHistoryError = useCallback(() => {
    setHistoryState(prev => ({
      ...prev,
      betHistoryError: null
    }));
  }, []);

  const refreshAllHistory = useCallback(async (gameType: number = gType) => {
    await Promise.all([
      fetchGameHistory(gameType),
      fetchBetHistory()
    ]);
  }, [fetchGameHistory, fetchBetHistory, gType]);

  // Fetch game info and update countdown
const fetchGameInfo = useCallback(async (gameType: number = gType): Promise<GameInfo | null> => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.GAME_INFO}/${gameType}`);
    const gameInfoResponse: GameInfoResponse = response.data;
    
    if (gameInfoResponse.success && gameInfoResponse.data?.game) {
      const gameData = gameInfoResponse.data.game[gameType.toString()];      
      if (gameData) {        
        setGameState(prev => ({
          ...prev,
          countdownSeconds: Math.floor(gameData.endDate + gameData.overMinute - 2),
          currentDraw: {
            ...prev.currentDraw,
            id: gameData.gid || prev.currentDraw.id,
            draw_no: gameData.gid ? gameData.gid.toString() : prev.currentDraw.draw_no,
          },
          gamePhase: gameData.isEnd ? "finished" : 
                    gameData.endDate <= 0 ? "finished" : "waiting"
        }));
        
        return gameData;
      }
    }
    
    return null;
  } catch (error: any) {
    console.error('❌ Lỗi khi fetch game info:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Không thể tải thông tin game';
    
    setGameState(prev => ({
      ...prev,
      error: errorMessage
    }));
    
    return null;
  }
}, [gType]);

  const connectWebSocket = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setWsState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const wsUrl = getWebSocketURL(gType);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null
        }));

        const timeSuffix = (Date.now() % 100000).toString().padStart(5, '0');
        const usernameWithTime = `${user?.username || 'Guest'}_${timeSuffix}`;

        // ws.send(JSON.stringify({
        //   action: "request",
        //   username: usernameWithTime,
        //   gamename: "Ku Lotto",
        //   gtype: gType
        // }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // console.log("Received WebSocket message:", data);
          try {
            const actionOrMethod = data.action || data.method || '(none)';
          } catch {}
          setWsState(prev => ({ ...prev, lastMessage: data }));
          if (data.method === WEBSOCKET_CONSTANTS.METHODS.RESULT_HISTORY) {
            if (data.history && data.history.length > 0) {
              const latestResult = data.history[0];
              setGameState(prev => ({
                ...prev,
                winningCodes: latestResult.result ? latestResult.result.split('') : prev.winningCodes
              }));
            
              setHistoryState(prev => ({
                ...prev,
                gameHistory: data.history || prev.gameHistory
              }));
            }
          }
          else if (data.action === WEBSOCKET_CONSTANTS.ACTIONS.CARD) {
            if (data.msg) {
              const codes = parseCardResult(data.msg);
              if(data.msg === 're'){
                setGameState(prev => ({
                  ...prev,
                  showResultOverlay: false,
                  winningCodes: [],
                  resultAnimation: {
                    isAnimating: false,
                    currentIndex: 0,
                    revealedCodes: [],
                  },
                }));
                return;
              }

              if (codes.length > 0) {
                setTimeout(() => {
                  setGameState(prev => {
                    const newRevealedCodes = prev.resultAnimation.revealedCodes.length > 0 
                      ? [...prev.resultAnimation.revealedCodes] 
                      : Array(5).fill('k');
                    codes.forEach((code, index) => {
                      if (code && code !== '') {
                        newRevealedCodes[index] = code;
                      }
                    });

                    return {
                      ...prev,
                      showResultOverlay: true,
                      resultAnimation: {
                        isAnimating: false,
                        currentIndex: 0,
                        revealedCodes: newRevealedCodes,
                      },
                      winningCodes: codes,
                      gamePhase: "finished"
                    };
                  });
                }, 5000);
              }
            } else if (data.result) {
              setTimeout(() => {
                setGameState(prev => ({
                  ...prev,
                  winningCodes: data.result.split(''),
                  gamePhase: "finished"
                }));
              }, 5000);
            }
          }
          else if (data.action === "newGame") {
            if (countdownRef.current) {
              clearTimeout(countdownRef.current);
              countdownRef.current = null;
            }
            
            const gIdString = data.gId?.toString() || '';
            const lastFourDigits = gIdString.slice(-4);
            
            setGameState(prev => ({
              ...prev,
              showResultOverlay: false,
              resultAnimation: {
                isAnimating: false,
                currentIndex: 0,
                revealedCodes: [],
              },
              currentDraw: {
                id: data.gId || prev.currentDraw.id, // Luôn cập nhật id từ gId
                draw_no: lastFourDigits || prev.currentDraw.draw_no, // Luôn cập nhật draw_no từ gId
                end_time: data.endBetTime || prev.currentDraw.end_time,
                name: `Lotto ${gType === 162 ? 'A' : 'C'}`
              },
              countdownSeconds: 43, // Bắt đầu từ 43 giây
              sessionStartTime: Date.now(),
              sessionDuration: 43, // Tổng thời gian là 43 giây
              gamePhase: "waiting"
            }));
          }
          // Thiết lập currentDraw từ sự kiện đầu tiên: loginBackBS (ưu tiên cùng nhóm với newGame)
          else if (data.action === "loginBackBS") {
            const gIdString = data.gId?.toString() || '';
            const lastFourDigits = gIdString.slice(-4);
            if (gIdString) {
              setGameState(prev => ({
                ...prev,
                currentDraw: {
                  id: data.gId || prev.currentDraw.id,
                  draw_no: lastFourDigits || prev.currentDraw.draw_no,
                  end_time: prev.currentDraw.end_time,
                  name: prev.currentDraw.name || `Live KU ${gType === 166 ? 'A' : 'B'}`
                }
              }));
            }
          }
          // Xử lý thông tin kỳ hiện tại
          else if (data.currentDraw || data.draw) {
            const drawInfo = data.currentDraw || data.draw;
            if (drawInfo) {
              setGameState(prev => ({
                ...prev,
                currentDraw: {
                  id: drawInfo.id || prev.currentDraw.id,
                  draw_no: drawInfo.draw_no || drawInfo.drawNo || prev.currentDraw.draw_no,
                  end_time: drawInfo.end_time || drawInfo.endTime || prev.currentDraw.end_time,
                  name: drawInfo.name || prev.currentDraw.name
                }
              }));
            }
          }
          // Xử lý thông tin countdown
          else if (data.countdown !== undefined || data.remainingTime !== undefined) {
            const countdown = data.countdown || data.remainingTime;
            if (typeof countdown === 'number' && countdown >= 0) {
              setGameState(prev => ({
                ...prev,
                countdownSeconds: countdown
              }));
            }
          }
          // Xử lý trạng thái game
          else if (data.gamePhase || data.phase) {
            const phase = data.gamePhase || data.phase;
            if (['waiting', 'playing', 'finished'].includes(phase)) {
              setGameState(prev => ({
                ...prev,
                gamePhase: phase
              }));
            }
          }
        } catch (error) {
          console.error("❌ WebSocket message parsing error:", error);
        }
      };

      ws.onclose = () => {
        setWsState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false
        }));

        // Tự động kết nối lại sau 3 giây
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = (error) => {
        setWsState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: 'WebSocket connection error'
        }));
      };

    } catch (error) {
      setWsState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: 'Failed to create WebSocket connection'
      }));
    }
  }, [gType]);

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setWsState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false
    }));
  }, []);

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    fetchBetRules();
    fetchGameHistory();
    fetchCurrentDraw();
  }, [fetchBetRules, fetchGameHistory, fetchCurrentDraw]);

  useEffect(() => {
    fetchGameInfo();
    
    const gameInfoInterval = setInterval(() => {
      fetchGameInfo();
    }, 30000);
    
    return () => {
      clearInterval(gameInfoInterval);
    };
  }, [fetchGameInfo]);

  useEffect(() => {
  if (gameState.countdownSeconds === 0) {
    console.log('⏰ Countdown về 0, fetch game info để cập nhật...');
    const timeoutId = setTimeout(() => {
      fetchGameInfo();
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }
}, [gameState.countdownSeconds, fetchGameInfo]);

  // One-shot initializer from first-arrived action: loginBackBS or newGame
  useEffect(() => {
    if (hasInitializedDraw) return;

    const data: any = wsState.lastMessage;
    if (!data) return;

    const isCandidate = data?.action === 'loginBackBS' || data?.action === 'newGame';
    if (!isCandidate) return;

    const gIdString = data?.gId?.toString() || '';
    if (!gIdString) return;

    const lastFourDigits = gIdString.slice(-4);
    setGameState(prev => ({
      ...prev,
      currentDraw: {
        id: data.gId || prev.currentDraw.id, // Luôn cập nhật id từ gId
        draw_no: lastFourDigits || prev.currentDraw.draw_no, // Luôn cập nhật draw_no từ gId
        end_time: prev.currentDraw.end_time,
        name: prev.currentDraw.name || `Live KU ${gType === 166 ? 'A' : 'B'}`
      }
    }));
    setHasInitializedDraw(true);

  }, [wsState.lastMessage, hasInitializedDraw, gType, setGameState]);

  useEffect(() => {
    // Chỉ chạy countdown khi gamePhase là "waiting" và countdownSeconds > 0
    if (gameState.gamePhase === "waiting" && gameState.countdownSeconds > 0) {
      countdownRef.current = setTimeout(() => {
        setGameState(prev => {
          const newCountdown = prev.countdownSeconds - 1;
          
          if (newCountdown > 0) {
            return { ...prev, countdownSeconds: newCountdown };
          } else {
            return { ...prev, countdownSeconds: 0, gamePhase: "finished" };
          }
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [gameState.countdownSeconds, gameState.gamePhase]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    wsState,
    gameState,
    bettingState,
    ruleState,
    historyState,

    updateGameState,
    updateCountdown,
    resetGame,
    parseCardResult,
    startResultAnimation,
    connectWebSocket,
    disconnectWebSocket,

    validateBettingData,
    placeBet,
    resetBettingState,
    clearBettingError,
    clearBettingSuccess,

    fetchBetRules,
    fetchBetRule,
    selectRule,
    clearSelectedRule,
    clearRulesError,
    getRuleById,
    getActiveRules,
    getRulesByCategory,
    getCategories,
    getRulesByGroupTitle,

    fetchGameInfo,
    fetchGameHistory,
    fetchBetHistory,
    fetchCurrentDraw,
    getLatestGameResult,
    getRecentGameResults,
    getRecentBetHistory,
    getBetHistoryByStatus,
    getWinningBets,
    getLosingBets,
    getPendingBets,
    clearGameHistoryError,
    clearBetHistoryError,
    refreshAllHistory,
  };
};
