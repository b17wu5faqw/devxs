import React from 'react';
import { GamePhase } from '@/view/page/home/desktop/main/XocDia/VideoSection';
import { SicboBetType } from '@/hooks/useSicbo';

// CSS cho hiệu ứng nhấp nháy chỉ cho winning options (giống desktop)
const blinkingStyles = `
  @keyframes winning-option-blink {
    0%, 50% {
      background: linear-gradient(to bottom, #FFD700, #FFA500) !important;
      border-color: #FF6B35 !important;
      color: #8B4513 !important;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
      transform: scale(1.05);
    }
    51%, 100% {
      background: linear-gradient(to bottom, #FF4500, #DC143C) !important;
      border-color: #B22222 !important;
      color: white !important;
      box-shadow: 0 0 15px rgba(255, 69, 0, 0.9);
      transform: scale(1.05);
    }
  }
  .winning-option-blink {
    animation: winning-option-blink 0.6s infinite;
  }
`;

interface BettingOptionsProps {
  betTypesData: any;
  selectedChoices: string[];
  onOptionSelect: (optionId: string) => void;
  winningCodes?: string[];
  isBlinking?: boolean;
  // Mobile-specific props
  gamePhase?: GamePhase;
  onConfirm?: () => void;
  onCancel?: () => void; // Add cancel handler
  isSubmitting?: boolean;
  minMaxRates?: { min: number; max: number };
  selectedChoiceNames?: string[];
  // Chip selection props
  betChip?: number;
  onClickChip?: (amount: number) => void;
}

// Helper function to format prize rate by removing trailing zeros (giống desktop)
const formatPrizeRate = (prizeRate: string | number): string => {
  if (!prizeRate) return "0";
  const num = typeof prizeRate === "string" ? parseFloat(prizeRate) : prizeRate;
  return num.toString();
};

const BettingOptions: React.FC<BettingOptionsProps> = ({
  betTypesData,
  selectedChoices,
  onOptionSelect,
  winningCodes = [],
  isBlinking = false,
  // Mobile-specific props
  gamePhase,
  onConfirm,
  onCancel,
  isSubmitting = false,
  minMaxRates = { min: 0, max: 0 },
  selectedChoiceNames = [],
  // Chip selection props
  betChip = 0,
  onClickChip,
}) => {

  const isSelected = (betType: string) => selectedChoices.includes(betType);

  return (
    <>
      <style>{blinkingStyles}</style>
      <div className="bg-gray-900 my-1 relative">
        {/* Main betting options: Tài, Xỉu, Lẻ, Chẵn */}
        <div className="grid grid-cols-2 gap-px bg-black mb-px">
          {betTypesData?.data?.filter((item: SicboBetType) => ["BIG", "SMALL", "ODD", "EVEN"].includes(item.code)).map((option: SicboBetType) => {
            const isWinning = winningCodes.includes(option.code);
            const shouldBlink = isBlinking && isWinning;

            return (
              <div
                key={option.id}
                className={`relative h-[59px] flex items-center justify-between px-6 cursor-pointer hover:bg-gray-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${shouldBlink
                    ? 'winning-option-blink'
                    : ''
                  }`}
                style={{
                  backgroundColor: isSelected(option.code) ? 'rgba(247, 80, 80, 0.7)' : 'rgba(255, 255, 255, 0.3)'
                }}
                onClick={() => {
                  if (!isSubmitting) {
                    onOptionSelect(option.code);
                  }
                }}
              >
                <span className="text-white text-2xl">{option.name}</span>
                <span className="text-yellow-400 text-sm">{formatPrizeRate(option.prize_rate)}</span>
              </div>
            );
          })}
        </div>

        {/* Dice combination options */}
        <div className="grid grid-cols-2 gap-px bg-black">
          {betTypesData?.data?.filter((item: SicboBetType) => ["ODDS_04", "ODDS_40", "ODDS_13", "ODDS_31", "ODDS_22", "ODDS_44"].includes(item.code)).map((option: SicboBetType) => {
            const isWinning = winningCodes.includes(option.code);
            const shouldBlink = isBlinking && isWinning;

            return (
              <div
                key={option.id}
                className={`h-[73px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${shouldBlink
                    ? 'winning-option-blink'
                    : ''
                  }`}
                style={{
                  backgroundColor: isSelected(option.code) ? 'rgba(247, 80, 80, 0.7)' : 'rgba(255, 255, 255, 0.3)'
                }}
                onClick={() => {
                  if (!isSubmitting) {
                    onOptionSelect(option.code);
                  }
                }}
              >
                {/* Render dice images based on option code */}
                <div className="flex gap-2 mb-2">
                  {option.code === 'ODDS_04' && (
                    <>
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                    </>
                  )}
                  {option.code === 'ODDS_40' && (
                    <>
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                    </>
                  )}
                  {option.code === 'ODDS_13' && (
                    <>
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                    </>
                  )}
                  {option.code === 'ODDS_31' && (
                    <>
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                    </>
                  )}
                  {option.code === 'ODDS_22' && (
                    <>
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[30px] h-[30px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[30px] h-[30px]" alt="Red dice" />
                    </>
                  )}
                  {option.code === 'ODDS_44' && (
                    <>
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[18px] h-[18px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[18px] h-[18px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[18px] h-[18px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg" className="w-[18px] h-[18px]" alt="Red dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[18px] h-[18px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[18px] h-[18px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[18px] h-[18px]" alt="White dice" />
                      <img src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg" className="w-[18px] h-[18px]" alt="White dice" />
                    </>
                  )}
                </div>
                <span className="text-yellow-400 text-sm">{formatPrizeRate(option.prize_rate)}</span>
              </div>
            );
          })}
        </div>

        {/* Fixed Bottom Betting Block */}
        {selectedChoices.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-black flex flex-col px-4 text-lg z-[1000]">
            {/* Thông tin lựa chọn và tỷ lệ */}
            <div className="bg-gray-800 px-3 py-2 text-sm">
              <div className="text-white mb-1">
                Đã chọn: <span className="text-[#fff600]">{selectedChoiceNames.join(', ')}</span>
              </div>
              {minMaxRates && minMaxRates.min > 0 && minMaxRates.max > 0 && (
                <div className="text-gray-300 text-xs">
                  Tỷ lệ: {minMaxRates.min === minMaxRates.max
                    ? `${minMaxRates.min}`
                    : `${minMaxRates.min} - ${minMaxRates.max}`}
                </div>
              )}
            </div>

            {/* Chip selection */}
            {onClickChip && (
              <div className="bg-gray-800 p-3 rounded-lg mb-3">
                <div className="text-white text-sm mb-2">Chọn số tiền cược:</div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 5, 10, 100, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      className={`p-2 rounded text-sm font-bold transition-all ${betChip === amount
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-600 text-white hover:bg-gray-500'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (!isSubmitting) {
                          onClickChip(amount);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                <div className="text-yellow-400 text-xs mt-2">
                  Số tiền hiện tại: {betChip}
                </div>
              </div>
            )}

            {/* Nút hành động */}
            <div className="flex items-center justify-center gap-4 py-3">
              <button
                className={`text-white rounded-xl bg-[#888] h-[61px] min-w-[120px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isSubmitting && onCancel?.()}
                disabled={isSubmitting}
              >
                Hủy
              </button>

              <button
                className={`text-white rounded-xl flex items-center justify-center px-4 gap-10 bg-gradient-to-br from-[#69ac8e] to-[#5a9b7a] h-[61px] min-w-[160px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!isSubmitting) {
                    onConfirm?.();
                  }
                }}
                disabled={isSubmitting}
              >
                <span>Gồm <span className="text-[#fff600]">{selectedChoices.length}</span> đơn</span>
                <span className="text-[#fff600]">
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BettingOptions; 