export interface SubType {
  id: number;
  name: string;
  rate: string;
  price_rate: string;
  prize_rate: string;
  title: string;
  help: string;
  description: string;
  example: string;
  max_bet: number;
  max_number: number;
}

export interface DrawType {
  id?: number;
  draw_no?: string;
  end_time?: string;
  name?: string;
}

export interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface BettingState {
  selectedChoices: string[];
  betChip: number;
  totalChip: number;
  totalPrize: number;
  isSubmitting: boolean;
  message: string;
}

export interface VideoState {
  videoLoaded: boolean;
  isVideoPlaying: boolean;
  isCountdownActive: boolean;
}

// Existing Sicbo types
export enum GamePhase {
  DEFAULT = 0,
  RED_WIN = 1,
  BLUE_WIN = 2
}

export interface SelectedChoice {
  id: string;
  rate: number;
}

export interface SelectionBet {
  choice: string;
  rate: number;
  betAmount: number;
}

// RPS specific types
export interface RpsCurrentDraw {
  id: string;
  draw_no: string;
  phase: GamePhase;
  time_left: number;
  status: string;
}

export interface RpsLastDraw {
  id: string;
  draw_no: string;
  end_time: string;
  winner: 'CAI' | 'CON' | 'TIE';
  dealer: 'BUA' | 'KEO' | 'BAO';
  player: 'BUA' | 'KEO' | 'BAO';
  result?: string;
  created_at?: string;
}

export interface RpsBetType {
  id: string;
  code: string;
  name: string;
  prize_rate: number;
  description?: string;
}

export interface RpsBetRequest {
  draw_no: string;
  bet_type_id: string;
  amount: number;
}

export interface RpsBetResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Statistics types
export interface RpsStats {
  cai: number;
  con: number;
  tie: number;
}

export interface RpsResultGrid {
  id: string;
  draw_no: string;
  winner: 'CAI' | 'CON' | 'TIE';
  result: string;
}

export interface RpsStatisticItem {
  result: number;
  count: {
    dealer: 'BUA' | 'KEO' | 'BAO';
    player: 'BUA' | 'KEO' | 'BAO';
    winner: 'CAI' | 'CON' | 'TIE' | 'HOA';
  };
}

// Component prop types
export interface BettingOptionsProps {
  betTypesData: RpsBetType[];
  selectedChoices: SelectedChoice[];
  onOptionSelect: (optionId: string, rate: number) => void;
}

export interface StatisticsSectionProps {
  activeTab: 'points' | 'keo-doi';
  onTabChange: (tab: 'points' | 'keo-doi') => void;
  statisticData: any;
  statisticLast30ResultData: any;
  statisticDoubleBetData: any;
  isStatisticLoading: boolean;
  isStatisticDoubleBetLoading: boolean;
  statisticDoubleBetError: any;
  leftActiveTab: 'nha-cai' | 'nha-con';
  onLeftTabChange: (tab: 'nha-cai' | 'nha-con') => void;
}

export interface DiceRendererProps {
  lastDraw: RpsLastDraw | null;
  showAnimation?: boolean;
}

export interface BettingSidebarProps {
  selectedChoices: SelectedChoice[];
  betAmount: number;
  setBetAmount: (amount: number) => void;
  totalPrizeAmount: number;
  gamePhase: GamePhase;
  onClearSelections: () => void;
  onPlaceBet: () => void;
  isBetting: boolean;
}

// Icon and display types
export type RpsIcon = 'BUA' | 'KEO' | 'BAO' | 'STONE' | 'ROCK' | 'SCISSORS' | 'PAPER';
export type RpsWinner = 'CAI' | 'CON' | 'TIE';
export type TabType = 'points' | 'keo-doi';
export type SideTabType = 'nha-cai' | 'nha-con'; 