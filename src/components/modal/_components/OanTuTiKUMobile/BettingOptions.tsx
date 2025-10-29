import React from 'react';
import { BettingOptionsProps, GamePhase } from './types';

// CSS cho hiệu ứng nhấp nháy winning options
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

// Cấu hình odds mặc định khi chưa có data từ API
const DEFAULT_ODDS: { [key: string]: string } = {
  'CAI_WIN': '2.95',
  'CON_WIN': '2.95',
  'HOA': '2.95',
  'CAI_BUA': '2.95',
  'CAI_KEO': '2.95',
  'CAI_BAO': '2.95',
  'CON_BUA': '2.95',
  'CON_KEO': '2.95',
  'CON_BAO': '2.95',
  'CAI_BUA_CON_KEO': '4.36',
  'CAI_BUA_CON_BAO': '4.36',
  'CAI_KEO_CON_BAO': '4.36',
  'CAI_BUA_CON_BUA': '8.71',
  'CAI_KEO_CON_KEO': '8.71',
  'CAI_BAO_CON_BAO': '8.71'
};

// Cấu hình các tùy chọn đặt cược
const BETTING_CONFIG = {
  win: [
    { code: 'CAI_WIN', label: 'Cái', color: 'bg-red-500' },
    { code: 'HOA', label: 'Hòa', color: 'bg-green-500' },
    { code: 'CON_WIN', label: 'Con', color: 'bg-blue-500' }
  ],
  cai: [
    { code: 'CAI_BUA', icon: 'icon_stone.svg', alt: 'Cái Búa' },
    { code: 'CAI_KEO', icon: 'icon_scissors.svg', alt: 'Cái Kéo' },
    { code: 'CAI_BAO', icon: 'icon_paper.svg', alt: 'Cái Bao' }
  ],
  con: [
    { code: 'CON_BUA', icon: 'icon_stone.svg', alt: 'Con Búa' },
    { code: 'CON_KEO', icon: 'icon_scissors.svg', alt: 'Con Kéo' },
    { code: 'CON_BAO', icon: 'icon_paper.svg', alt: 'Con Bao' }
  ],
  combination: {
    mixed: [
      { code: 'CAI_BUA_CON_KEO', icons: ['icon_stone.svg', 'icon_scissors.svg'], label: 'Búa & Kéo' },
      { code: 'CAI_BUA_CON_BAO', icons: ['icon_stone.svg', 'icon_paper.svg'], label: 'Búa & Bao' },
      { code: 'CAI_KEO_CON_BAO', icons: ['icon_scissors.svg', 'icon_paper.svg'], label: 'Kéo & Bao' }
    ],
    same: [
      { code: 'CAI_BUA_CON_BUA', icons: ['icon_stone.svg', 'icon_stone.svg'], label: 'Búa & Búa' },
      { code: 'CAI_KEO_CON_KEO', icons: ['icon_scissors.svg', 'icon_scissors.svg'], label: 'Kéo & Kéo' },
      { code: 'CAI_BAO_CON_BAO', icons: ['icon_paper.svg', 'icon_paper.svg'], label: 'Bao & Bao' }
    ]
  }
};

// Component cho header cột
const ColumnHeader: React.FC<{ title: string; height?: string }> = ({ title, height = '52px' }) => (
  <div
    className="flex items-center justify-center"
    style={{
      backgroundColor: 'rgb(59, 59, 59)',
      borderTopColor: 'rgb(17, 17, 17)',
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      color: 'rgb(255, 255, 255)',
      fontFamily: 'Arial, 微軟正黑體',
      height,
      justifyContent: 'center',
      lineHeight: '56px',
      textAlign: 'center',
      textSizeAdjust: '100%',
      unicodeBidi: 'isolate',
      width: '68.7969px',
      writingMode: 'vertical-lr',
      textOrientation: 'mixed'
    }}
  >
    <span className="text-sm font-medium">{title}</span>
  </div>
);

// Component cho tùy chọn đặt cược
const BettingOption: React.FC<{
  code: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (code: string) => void;
  children: React.ReactNode;
  odds: string;
  shouldBlink?: boolean;
}> = ({ code, isSelected, isDisabled, onSelect, children, odds, shouldBlink = false }) => (
  <div
    className={`h-[52px] flex items-center justify-center cursor-pointer hover:bg-gray-500 flex-1 ${shouldBlink ? 'winning-option-blink' : ''}`}
    style={{ backgroundColor: isSelected ? 'rgba(247, 80, 80, 0.7)' : 'rgba(255, 255, 255, 0.3)' }}
    onClick={() => !isDisabled && onSelect(code)}
  >
    <div className="flex justify-center w-full flex-1 flex-grow gap-6 items-center">
      {children}
      <span className="text-yellow-400 text-xs">{odds}</span>
    </div>
  </div>
);

// Component cho tùy chọn kết hợp
const CombinationOption: React.FC<{
  code: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (code: string) => void;
  children: React.ReactNode;
  odds: string;
  shouldBlink?: boolean;
}> = ({ code, isSelected, isDisabled, onSelect, children, odds, shouldBlink = false }) => (
  <div
    className={`h-[52px] flex items-center justify-between px-2 cursor-pointer hover:bg-gray-500 ${shouldBlink ? 'winning-option-blink' : ''}`}
    style={{ backgroundColor: isSelected ? 'rgba(247, 80, 80, 0.7)' : 'rgba(255, 255, 255, 0.3)' }}
    onClick={() => !isDisabled && onSelect(code)}
  >
    {children}
    <span className="text-yellow-400 text-xs">{odds}</span>
  </div>
);

const BettingOptions: React.FC<BettingOptionsProps> = ({
  betTypesData,
  selectedChoices,
  onOptionSelect,
  gamePhase,
  onConfirm,
  winningCodes = [],
  isBlinking = false,
  // Fixed bottom betting block props
  isSubmitting = false,
  minMaxRates = { min: 0, max: 0 },
  selectedChoiceNames = [],
  // Chip selection
  betChip = 0,
  onClickChip
}) => {
  const isSelected = (betType: string) => selectedChoices.includes(betType);
  // Sửa logic: cho phép betting khi gamePhase = DEFAULT, disable khi SHOWING_RESULT hoặc SHOW_RESULT
  const isDisabled = gamePhase === GamePhase.SHOWING_RESULT || gamePhase === GamePhase.SHOW_RESULT;
  const isWinning = (code: string) => winningCodes.includes(code);
  const shouldBlink = (code: string) => isBlinking && isWinning(code);

  // Helper function để lấy odds từ API data
  const getOdds = (betCode: string) => {
    if (!betTypesData?.data) {
      return DEFAULT_ODDS[betCode] || '2.95';
    }

    // Tìm bet type trong data - kiểm tra cả cấu trúc object và array
    const searchInData = (data: any): string | null => {
      if (Array.isArray(data)) {
        const option = data.find((opt: any) => opt.code === betCode);
        if (option) return option.rate || option.odds || '2.95';
      } else if (typeof data === 'object' && data !== null) {
        // Nếu là object, tìm trong các thuộc tính
        for (const key in data) {
          const result = searchInData(data[key]);
          if (result) return result;
        }
      }
      return null;
    };

    const foundOdds = searchInData(betTypesData.data);
    return foundOdds || DEFAULT_ODDS[betCode] || '2.95';
  };

  // Định dạng tên chọn lựa: "X & Y" -> "[X, Y]"
  const formatChoiceName = (name: string) => {
    if (!name) return name;
    const parts = name.split(' & ').map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return `[${parts.join(', ')}]`;
    }
    return name;
  };

  // Map code -> display name, with combinations formatted as [X, Y]
  const getChoiceDisplayName = (code: string) => {
    switch (code) {
      case 'CAI_WIN':
        return 'Cái';
      case 'CON_WIN':
        return 'Con';
      case 'HOA':
        return 'Hòa';
      case 'CAI_BUA':
        return 'Cái Búa';
      case 'CAI_KEO':
        return 'Cái Kéo';
      case 'CAI_BAO':
        return 'Cái Bao';
      case 'CON_BUA':
        return 'Con Búa';
      case 'CON_KEO':
        return 'Con Kéo';
      case 'CON_BAO':
        return 'Con Bao';
      case 'BUA_KEO':
        return '[Búa, Kéo]';
      case 'BUA_BAO':
        return '[Búa, Bao]';
      case 'KEO_BAO':
        return '[Kéo, Bao]';
      case 'BUA_BUA':
        return '[Búa, Búa]';
      case 'KEO_KEO':
        return '[Kéo, Kéo]';
      case 'BAO_BAO':
        return '[Bao, Bao]';
      default:
        return code;
    }
  };

  return (
    <>
      <style>{blinkingStyles}</style>
      <div className="my-1 relative">
        {/* Tùy chọn Win: Cái, Hòa, Con */}
        <div className="flex gap-px bg-black mb-1.5">
          <ColumnHeader title="Win" />
          {BETTING_CONFIG.win.map(({ code, label, color }) => (
            <BettingOption
              key={code}
              code={code}
              isSelected={isSelected(code)}
              isDisabled={isDisabled}
              onSelect={onOptionSelect}
              odds={getOdds(code)}
              shouldBlink={shouldBlink(code)}
            >
              <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center mb-1`}>
                <span className="text-white text-xs font-bold">{label}</span>
              </div>
            </BettingOption>
          ))}
        </div>

      {/* Tùy chọn Cái */}
      <div className="flex gap-px bg-black mb-1.5">
        <ColumnHeader title="Cái" />
        {BETTING_CONFIG.cai.map(({ code, icon, alt }) => (
          <BettingOption
            key={code}
            code={code}
            isSelected={isSelected(code)}
            isDisabled={isDisabled}
            onSelect={onOptionSelect}
            odds={getOdds(code)}
            shouldBlink={shouldBlink(code)}
          >
            <div className="w-8 h-8 rounded-full border-2 border-red-500 bg-white flex items-center justify-center mb-1">
              <img src={`/images/oantuti/${icon}`} alt={alt} className="w-5 h-5" />
            </div>
          </BettingOption>
        ))}
      </div>

      {/* Tùy chọn Con */}
      <div className="flex gap-px bg-black mb-1.5">
        <ColumnHeader title="Con" />
        {BETTING_CONFIG.con.map(({ code, icon, alt }) => (
          <BettingOption
            key={code}
            code={code}
            isSelected={isSelected(code)}
            isDisabled={isDisabled}
            onSelect={onOptionSelect}
            odds={getOdds(code)}
            shouldBlink={shouldBlink(code)}
          >
            <div className="w-8 h-8 rounded-full border-2 border-blue-900 bg-white flex items-center justify-center mb-1">
              <img src={`/images/oantuti/${icon}`} alt={alt} className="w-5 h-5" />
            </div>
          </BettingOption>
        ))}
      </div>

      {/* Tùy chọn Tổ hợp Cái Con */}
      <div className="flex gap-px bg-black mb-px">
        <ColumnHeader title="Tổ hợp Cái Con" height="159px" />

        {/* Cột trái - odds 4.36 */}
        <div className="grid grid-cols-1 gap-px flex-1">
          {BETTING_CONFIG.combination.mixed.map(({ code, icons }) => (
            <CombinationOption
              key={code}
              code={code}
              isSelected={isSelected(code)}
              isDisabled={isDisabled}
              onSelect={onOptionSelect}
              odds={getOdds(code)}
              shouldBlink={shouldBlink(code)}
            >
              <div className="flex items-center space-x-5">
                <img src={`/images/oantuti/${icons[0]}`} alt="Icon 1" className="w-6 h-6" />
                <img src={`/images/oantuti/${icons[1]}`} alt="Icon 2" className="w-6 h-6" />
              </div>
            </CombinationOption>
          ))}
        </div>

        {/* Cột phải - odds 8.71 */}
        <div className="grid grid-cols-1 gap-px flex-1">
          {BETTING_CONFIG.combination.same.map(({ code, icons }) => (
            <CombinationOption
              key={code}
              code={code}
              isSelected={isSelected(code)}
              isDisabled={isDisabled}
              onSelect={onOptionSelect}
              odds={getOdds(code)}
              shouldBlink={shouldBlink(code)}
            >
              <div className="flex items-center space-x-5">
                <img src={`/images/oantuti/${icons[0]}`} alt="Icon 1" className="w-6 h-6" />
                <img src={`/images/oantuti/${icons[1]}`} alt="Icon 2" className="w-6 h-6" />
              </div>
            </CombinationOption>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Betting Block */}
      {selectedChoices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black flex flex-col px-4 text-lg z-[1000]">
          {/* Selected info and rate */}
          {/* <div className="bg-gray-800 px-3 py-2 text-sm">
            <div className="text-white mb-1">
              Đã chọn: <span className="text-[#fff600]">{
                (selectedChoiceNames && selectedChoiceNames.length > 0
                  ? selectedChoiceNames.map(formatChoiceName)
                  : selectedChoices.map(getChoiceDisplayName)
                ).join(', ')
              }</span>
            </div>
            {minMaxRates && minMaxRates.min > 0 && minMaxRates.max > 0 && (
              <div className="text-gray-300 text-xs">
                Tỷ lệ: {minMaxRates.min === minMaxRates.max
                  ? `${minMaxRates.min}`
                  : `${minMaxRates.min} - ${minMaxRates.max}`}
              </div>
            )}
          </div> */}
          {/* Chip selection */}
          {onClickChip && (
            <div className="bg-gray-800 p-3 rounded-lg mb-3">
              <div className="text-white text-sm mb-2">Chọn số tiền cược:</div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 5, 10, 100, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    className={`p-2 rounded text-sm font-bold transition-all ${
                      betChip === amount
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-600 text-white hover:bg-gray-500'
                    } ${(isSubmitting || isDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (!(isSubmitting || isDisabled)) {
                        onClickChip(amount);
                      }
                    }}
                    disabled={isSubmitting || isDisabled}
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

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 py-3">
            <button
              className={`text-white rounded-xl bg-[#888] h-[61px] min-w-[120px] ${(isSubmitting || isDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !(isSubmitting || isDisabled) && onOptionSelect('')}
              disabled={isSubmitting || isDisabled}
            >
              Hủy
            </button>

            <button
              className={`text-white rounded-xl flex items-center justify-center px-4 gap-10 bg-gradient-to-br from-[#69ac8e] to-[#5a9b7a] h-[61px] min-w-[160px] ${(isSubmitting || isDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (!(isSubmitting || isDisabled)) {
                  onConfirm?.();
                }
              }}
              disabled={isSubmitting || isDisabled}
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