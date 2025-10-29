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