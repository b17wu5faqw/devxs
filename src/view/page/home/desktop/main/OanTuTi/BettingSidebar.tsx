import React from "react";
import { SubType, BettingState, TimeLeft } from "./types";
import { getRpsOptionName } from "./utils";

// Import GamePhase enum
import { GamePhase } from "./VideoSection";

interface BettingSidebarProps {
  subType: SubType;
  bettingState: BettingState;
  customTimeLeft: TimeLeft;
  gamePhase?: GamePhase;
  minMaxRates?: { min: number; max: number };
  onBetChipChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickChip: (num: number) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const BettingSidebar: React.FC<BettingSidebarProps> = ({
  subType,
  bettingState,
  customTimeLeft,
  gamePhase = GamePhase.DEFAULT,
  minMaxRates = { min: 0, max: 0 },
  onBetChipChange,
  onClickChip,
  onCancel,
  onSubmit
}) => {
  const { selectedChoices, betChip, totalChip, totalPrize, isSubmitting } = bettingState;

  // Determine if betting is allowed based on game phase
  const isBettingAllowed = gamePhase === GamePhase.DEFAULT;

  // Get phase status text
  const getPhaseStatusText = () => {
    switch (gamePhase) {
      case GamePhase.DEFAULT:
        return "Đang nhận cược";
      case GamePhase.SHOWING_RESULT:
        return "Đang hiển thị kết quả";
      default:
        return "Đang nhận cược";
    }
  };

  // Format min-max rates for display
  const formatMinMaxRates = () => {
    if (minMaxRates.min === 0 && minMaxRates.max === 0) {
      return "0";
    }
    if (minMaxRates.min === minMaxRates.max) {
      return minMaxRates.min.toString();
    }
    return `${minMaxRates.min} - ${minMaxRates.max}`;
  };

  return (
    <div className="w-[200px] min-w-[200px] bg-white">
      <div className="bg-[#4984bf] h-[35px] leading-[35px] text-white text-sm px-[10px] flex justify-between items-center">
        <span className="text-sm text-white">
          Danh sách đơn cược
        </span>
      </div>
      <div>
        <div className="bg-[#f3f3f3] py-[8px] px-0 text-[#0073de] text-center border-b border-[#cccccc] w-full">
          <span className="text-base text-[#0073de]">
            {subType?.title || "Xóc Đĩa KU"}
          </span>
        </div>

        {/* Game phase status */}
        <div className={`py-[4px] px-[8px] text-center text-sm font-bold ${
          gamePhase === GamePhase.DEFAULT 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {getPhaseStatusText()}
        </div>

        <div className="h-[312px] p-[8px]">
          <span>Lựa chọn</span>
          <div className="text-[#f00] text-base font-normal">
            {selectedChoices.map(choice => getRpsOptionName(choice)).join(", ")}
          </div>
        </div>
      </div>
      <div className="bg-[#b3d2f2] border-b border-[#7b9fc5] p-[5px_10px]">
        <div className="text-sm">
          Đơn cược：<span className="color_blue">{selectedChoices.length}</span>
        </div>
        <div className="relative flex items-center gap-2">
          <label className="text-sm">
            Tiền cược：
            <input
              value={betChip}
              onChange={onBetChipChange}
              disabled={!isBettingAllowed}
              className={`w-[58px] h-[30px] rounded-[3px] px-[7px] border border-white ${isBettingAllowed ? 'bg-white' : 'bg-gray-100'
                }`}
            />
          </label>
        </div>
        <div className="bg-white border border-[#ccc] my-2">
          <div className="relative">
            <div className="chipWraps">
              <span className="chip_close"></span>
              <div id="divAllChip" className="allChipBox">
                <div className="chipBoxItem">
                  <div
                    onClick={() => isBettingAllowed && onClickChip(1)}
                    className={`chip_Text icon_chip_1 ${!isBettingAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>1</span>
                  </div>
                  <div
                    onClick={() => isBettingAllowed && onClickChip(5)}
                    className={`chip_Text icon_chip_5 ${!isBettingAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>5</span>
                  </div>
                  <div
                    onClick={() => isBettingAllowed && onClickChip(10)}
                    className={`chip_Text icon_chip_10 ${!isBettingAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>10</span>
                  </div>
                </div>
                <div className="chipBoxItem">
                  <div
                    onClick={() => isBettingAllowed && onClickChip(100)}
                    className={`chip_Text icon_chip_100 ${!isBettingAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>100</span>
                  </div>
                  <div
                    onClick={() => isBettingAllowed && onClickChip(500)}
                    className={`chip_Text icon_chip_500 ${!isBettingAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>500</span>
                  </div>
                  <div
                    onClick={() => isBettingAllowed && onClickChip(1000)}
                    className={`chip_Text icon_chip_1000 ${!isBettingAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>1000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-black h-[30px] leading-[30px] text-sm">
          T.tiền cược：
          <span>{totalChip}</span>
        </div>
      </div>
      <div className="bg-[#b3d2f2] border-t border-white h-[110px] p-[8px_10px]">
        <div>
          <span>Tỉ lệ :</span>
          <span className="color_red">{formatMinMaxRates()}</span>
        </div>
        <div>
          Tiền thắng：<span className="color_blue">{totalPrize}</span>
        </div>
        <div className="text-sm flex gap-2">
          <button
            onClick={() => onCancel()}
            className="bg-[#898989] text-white text-center w-[60px] h-[35px] m-[5px_0px_2px] rounded-[3px]"
          >
            Hủy
          </button>
          <button
            disabled={
              isSubmitting ||
              selectedChoices.length === 0 ||
              betChip === 0 ||
              !isBettingAllowed
            }
            onClick={() => onSubmit()}
            className="disabled:bg-[#898989] bg-[#336aab] text-white text-center w-[110px] h-[35px] m-[5px_0px_2px] rounded-[3px]"
            title={!isBettingAllowed ? "Không thể đặt cược trong thời gian này" : ""}
          >
            {isSubmitting ? "Đang gửi..." : "Xác nhận gửi đi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BettingSidebar; 