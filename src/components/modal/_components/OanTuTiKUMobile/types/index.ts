export interface CurrentDraw {
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

export enum GamePhase {
  DEFAULT = 'DEFAULT',
  BETTING = 'BETTING',
  BETTING_ENDING = 'BETTING_ENDING',
  PLAYING_VIDEO = 'PLAYING_VIDEO',
  SHOWING_RESULT = 'SHOWING_RESULT',
  SHOW_RESULT = 'SHOW_RESULT'
}

export enum TabType {
  COMBINATION = 'COMBINATION',
  STATISTICS = 'STATISTICS'
}

export interface VideoAreaProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  gamePhase: GamePhase;
  showVideo: boolean;
  showDiceOverlay: boolean;
  showResultOverlay: boolean;
  currentDraw: CurrentDraw;
  currentPhaseResult: any;
  blinkingResults: string[];
  onVideoEnded: () => void;
  onVideoLoad: () => void;
  lastDrawResults: any[];
  countdown?: TimeLeft;
  addToSessionLog?: (action: string, data: any) => void;
}

export interface BettingOptionsProps {
  betTypesData: any;
  selectedChoices: string[];
  onOptionSelect: (optionId: string) => void;
  gamePhase: GamePhase;
  onConfirm: () => void;
  winningCodes: string[];
  isBlinking?: boolean;
  isSubmitting?: boolean;
  minMaxRates?: { min: number; max: number };
  selectedChoiceNames?: string[];
  betChip?: number;
  onClickChip?: (amount: number) => void;
}

export interface HeaderProps {
  onHomeClick: () => void;
  onResultsClick: () => void;
  onBetRecordClick: () => void;
  onMenuClick: () => void;
  onHistoryClick: () => void;
}

export interface UserHeaderProps {
  currentDraw: CurrentDraw;
  countdown: TimeLeft;
  gamePhase: GamePhase;
  onVideoToggle: () => void;
  onBalanceClick: () => void;
}

export interface TabSectionProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  lastDrawResults: any[];
  addToSessionLog?: (action: string, data: any) => void;
}

export type ChatSectionProps = object;