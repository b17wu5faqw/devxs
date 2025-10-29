import React, { useEffect, useState, useCallback } from 'react';
import CustomText from "@/components/text/CustomText";
import { baseColors } from "@/utils/colors";
import { GamePhase as XocDiaGamePhase } from '../XocDia/VideoSection';
import { GamePhase as OanTuTiGamePhase } from '../OanTuTi/VideoSection';
import { useLastDraw } from "@/hooks/useSicbo";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

// Union type for both game phases
type GamePhase = XocDiaGamePhase | OanTuTiGamePhase;

interface KyHienTaiHeaderProps {
  currentDrawNo: string;
  timeLeft: TimeLeft;
  todayOpened: number;
  todayRemaining: number;
  showSeconds?: boolean;
  width?: string;
  gamePhase?: GamePhase;
  onGamePhaseChange?: (phase: GamePhase) => void;
  onVideoStart?: () => void;
  currentDrawEndTime?: string;
}

export default function KyHienTaiHeader({
  currentDrawNo,
  timeLeft,
  todayOpened,
  todayRemaining,
  showSeconds = false,
  width = "100%",
  gamePhase = XocDiaGamePhase.DEFAULT,
  onGamePhaseChange,
  onVideoStart,
  currentDrawEndTime
}: KyHienTaiHeaderProps) {
  // Use the hook to get last draw data
  const { data: lastDrawData } = useLastDraw();
  // Hiển thị thời gian dựa trên gamePhase
  const displayTimeLeft = (String(gamePhase) === 'default')
    ? timeLeft
    : { hours: 0, minutes: 0, seconds: 0 };

  // Use lastDrawData for draw number if available, otherwise fallback to currentDrawNo
  const displayDrawNo = lastDrawData?.data ? 
    `${lastDrawData.data.id}${lastDrawData.data.draw_no}` : 
    currentDrawNo;

  // Xác định trạng thái hiển thị
  const getPhaseStatus = () => {
    const phaseString = String(gamePhase);
    switch (phaseString) {
      case 'default':
        return { text: "Đang nhận cược", color: "#28a745" };
      case 'showing_result':
        return { text: "Đang quay", color: "#ffc107" };
      case 'show_result':
        return { text: "Hiển thị kết quả", color: "#17a2b8" };
      default:
        return { text: "Đang nhận cược", color: "#28a745" };
    }
  };

  const phaseStatus = getPhaseStatus();

  return (
    <div className="relative w-full">
      <div 
        className="bg-[#4984bf] px-3 text-sm text-white h-[35px] max-h-[35px] flex items-center justify-between"
        style={{ width }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            Kỳ hiện tại
            <CustomText sx={{ paddingX: "4px", color: baseColors.white }}>
              :
            </CustomText>
            <span className="text-[#ece42f]">{displayDrawNo}</span>
          </div>

          <div className="flex items-center gap-1">
            Đếm ngược：
            {showSeconds ? (
              <>
                <CustomText
                  sx={{
                    background: "url(/images/common/bg_time.svg) no-repeat center",
                    display: "block",
                    backgroundSize: "100%",
                    width: "40px",
                    height: "28px",
                    lineHeight: "28px",
                    color: baseColors.black,
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    animation: displayTimeLeft.seconds <= 10 ? "countdown-pulse 1s ease-in-out infinite" : "none",
                  }}
                >
                  {displayTimeLeft.minutes.toString().padStart(2, "0")}
                </CustomText>
                <CustomText
                  sx={{
                    color: "#fff",
                    textAlign: "center",
                    width: "18px",
                    height: "38px",
                    fontWeight: "bold",
                    fontSize: "24px",
                  }}
                >
                  :
                </CustomText>
                <CustomText
                  sx={{
                    background: "url(/images/common/bg_time.svg) no-repeat center",
                    display: "block",
                    backgroundSize: "100%",
                    width: "40px",
                    height: "28px",
                    lineHeight: "28px",
                    color: baseColors.black,
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    animation: displayTimeLeft.seconds <= 10 ? "countdown-pulse 1s ease-in-out infinite" : "none",
                  }}
                >
                  {displayTimeLeft.seconds.toString().padStart(2, "0")}
                </CustomText>
              </>
            ) : (
              <span className="text-white text-sm">
                {String(displayTimeLeft.hours).padStart(2, '0')} : {String(displayTimeLeft.minutes).padStart(2, '0')}
              </span>
            )}
          </div>

          {/* Hiển thị trạng thái phase */}
          <div className="flex items-center gap-1">
            <span
              className="text-[#ece42f] font-bold"
              style={{ color: phaseStatus.color }}
            >
              {phaseStatus.text}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-[10px]">
          <div className="bg-[#4984bf] text-sm text-white w-fit flex items-center">
            Hôm nay đã mở
            <span className="text-[#ece42f] mx-1">{todayOpened}</span>kỳ,
            còn lại
            <span className="text-[#ece42f] mx-1">{todayRemaining}</span>kỳ
          </div>
        </div>
      </div>

      {/* CSS cho animation */}
      <style jsx>{`
                @keyframes countdown-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                @keyframes fade-in-overlay {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
    </div>
  );
}