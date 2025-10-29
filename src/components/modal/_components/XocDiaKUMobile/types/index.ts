// Import desktop types and enums for consistency
import { TimeLeft, DrawType, SubType, BettingState, VideoState } from '@/view/page/home/desktop/main/XocDia/types';
import { GamePhase } from '@/view/page/home/desktop/main/XocDia/VideoSection';

// Re-export desktop types
export type { TimeLeft, DrawType, SubType, BettingState, VideoState };
export { GamePhase };

export enum TabType {
  COMBINATION = 'combination', // Kèo đôi
  POINTS = 'points', // Điểm số
  STATISTICS = 'statistics' // Thống kê
}

// Use DrawType from desktop instead of CurrentDraw
export type CurrentDraw = DrawType;

export interface LastDrawResult {
  id: number;
  draw_no: string;
  end_time: string;
  result: string; // Format: "R,R,R,W" 
}

export interface BettingOptionsProps {
  gamePhase: GamePhase;
  selectedBet: string | string[];
  onBetSelection: (betCode: string) => void;
  blinkingResults: string[];
  onConfirm?: () => void;
  isSubmitting?: boolean;
  // Enhanced with desktop logic
  minMaxRates?: { min: number; max: number };
  selectedChoiceNames?: string[];
}

export interface TabSectionProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  lastDrawResults?: LastDrawResult[];
  // Statistics data từ desktop - following StatisticsSection pattern
  statisticData?: any;
  statisticLast30ResultData?: any;
  statisticDoubleBetData?: any;
  isStatisticLoading?: boolean;
  isStatisticDoubleBetLoading?: boolean;
  statisticDoubleBetError?: any;
}

// VideoAreaProps removed - using desktop VideoSection instead

export interface UserHeaderProps {
  currentDraw: CurrentDraw;
  countdown: TimeLeft;
  gamePhase: GamePhase;
  onVideoToggle: () => void;
  onBalanceClick: () => void;
}

export interface HeaderProps {
  onHomeClick: () => void;
  onResultsClick: () => void;
  onBetRecordClick: () => void;
  onMenuClick: () => void;
}

export type ChatSectionProps = object; // Replace empty interface with object type