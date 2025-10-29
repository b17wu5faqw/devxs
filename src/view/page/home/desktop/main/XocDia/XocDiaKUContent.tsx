import React, { useState, useMemo, useEffect } from "react";
import PopupInfoMobile from "@/components/modal/PopupInfoMobile";
import PopupSuccess from "@/components/modal/PopupSuccess";
import PopupSuccessQuota from "@/components/modal/PopupSuccessQuota";
import PopupError from "@/components/modal/PopupError";
import PopupBettingClosed from "@/components/modal/PopupBettingClosed";
import LoXien from "@/components/game-input/LoXien";
import LoTruot from "@/components/game-input/LoTruot";
import KyHienTaiHeader from "@/view/page/home/desktop/main/Common/KyHienTaiHeader";
import HuongDanSection from "../Common/HuongDanSection";
import {
  useStatisticLast30Result,
  useStatisticResult,
  useStatisticDoubleBet,
} from "@/hooks/useSicbo";

// Import XocDia components
import VideoSection, { GamePhase } from "./VideoSection";
import ResultsSection from "./ResultsSection";
import BettingOptions from "./BettingOptions";
import BettingSidebar from "./BettingSidebar";
import StatisticsSection from "./StatisticsSection";

// Import types and utils
import { TimeLeft, SubType } from "./types";
import { getPrizeRate } from "./utils";

// Import the new XocDia game hook
import { useXocDiaGame } from "@/hooks/useXocDiaGame";

// Move gameConfig outside component to prevent re-creation
const gameConfig = {
  SHOWING_RESULT_SECONDS: 3,
  DEFAULT_SECONDS: 3,
  TEST_MODEL_PopupBettingClosed: false,
  LOG_SHOW: true // Set to true to enable session result logging and popup debugging
};

function XocDiaKUContent() {
  // ===== SỬ DỤNG CUSTOM HOOK =====
  const {
    // State
    currentDraw,
    bettingState,
    isLoading,
    countdownSeconds,
    currentPhaseResult,
    gamePhase,
    isBlinkingResults,
    isShowingResult,

    // API data
    betTypesData,
    isConnected,
    isLoadingCurrentDraw,

    // Functions
    handleLogEvent,
    handleOptionSelect,
    handleClickChip,
    handleBetChipChange,
    handleCancel,
    handleSubmit,

    // Shared utility functions
    recentDraws,
    winningCodes,
  } = useXocDiaGame(gameConfig);

  // ===== API HOOKS CHO STATISTICS =====
  const {
    data: statisticLast30ResultData,
    isLoading: isStatisticLast30ResultLoading,
    error: statisticLast30ResultError
  } = useStatisticLast30Result();

  const {
    data: statisticData,
    isLoading: isStatisticLoading,
    error: statisticError
  } = useStatisticResult();

  const {
    data: statisticDoubleBetData,
    isLoading: isStatisticDoubleBetLoading,
    error: statisticDoubleBetError
  } = useStatisticDoubleBet();

  // ===== STATE PHỤ (UI specific) =====
  const [duplicates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'points' | 'keo-doi'>('points');
  const [videoLoaded, setVideoLoaded] = useState(false);

  // ===== CLEAR STATE ON MOUNT/UNMOUNT =====
  useEffect(() => {
    // Clear everything when component mounts
    const clearAllState = () => {
      // Clear betting state
      handleCancel();
      
      // Reset UI state
      setActiveTab('points');
      setVideoLoaded(false);
    };

    // Clear on mount
    clearAllState();

    // Cleanup function - clear everything when component unmounts
    return () => {
      clearAllState();
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // ===== UI SPECIFIC LOGIC =====
  // Chuyển đổi countdown sang TimeLeft
  const customTimeLeft: TimeLeft = useMemo(() => {
    const minutes = Math.floor(countdownSeconds / 60);
    const seconds = countdownSeconds % 60;
    return {
      hours: 0,
      minutes: minutes,
      seconds: seconds
    };
  }, [countdownSeconds]);

  // Tính toán tỷ lệ thắng min/max
  const calculateMinMaxRates = useMemo(() => {
    if (!bettingState.selectedChoices.length || !betTypesData?.data) {
      return { min: 0, max: 0 };
    }

    const rates = bettingState.selectedChoices.map(choice =>
      getPrizeRate(choice, betTypesData)
    );

    return {
      min: Math.min(...rates),
      max: Math.max(...rates)
    };
  }, [bettingState.selectedChoices, betTypesData]);

  // Cấu hình SubType
  const subType: SubType = useMemo(() => {
    const betTypesArray = Array.isArray(betTypesData?.data)
      ? betTypesData.data
      : null;

    if (betTypesArray && betTypesArray.length > 0) {
      const sicboBetType = betTypesArray[0];
      return {
        id: sicboBetType.id,
        name: sicboBetType.name || "Xóc Đĩa KU",
        rate: sicboBetType.odds?.toString() || "2.8",
        price_rate: sicboBetType.odds?.toString() || "2.8",
        prize_rate: sicboBetType.odds?.toString() || "2.8",
        title: sicboBetType.name || "Xóc Đĩa KU",
        help: sicboBetType.description || "Dự đoán kết quả xóc đĩa",
        description: sicboBetType.description || "Game xóc đĩa truyền thống",
        example: "Chọn Chẵn/Lẻ hoặc số lượng đồng xu ngửa",
        max_bet: 10000,
        max_number: 4
      };
    }

    return {
      id: 1,
      name: "Xóc Đĩa KU",
      rate: "2.8",
      price_rate: "2.8",
      prize_rate: "2.8",
      title: "Xóc Đĩa KU",
      help: "Dự đoán kết quả xóc đĩa",
      description: "Game xóc đĩa truyền thống",
      example: "Chọn Chẵn/Lẻ hoặc số lượng đồng xu ngửa",
      max_bet: 10000,
      max_number: 4
    };
  }, [betTypesData]);

  // Simple video handlers (video state is managed locally for UI only)
  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoEnded = () => {
    // Video handling is now managed by the hook
  };

  const handleVideoStart = () => {
    // Video handling is now managed by the hook
  };

  const handleClose = async () => {
    // Close popup functionality
  };

  // Loading and error states are now handled by the hook

  return (
    <div style={{ maxWidth: "1012px", minWidth: "1012px" }}>
      <div className="w-full h-full flex justify-start flex-row p-[5px_5px_0_5px] items-start bg-[#F3F3F3]" style={{ minWidth: "1012px" }}>
        {/* Main content */}
        <div className="flex flex-col flex-1 mr-[5px]" style={{ minWidth: "600px" }}>
          <div className="bg-[#F3F3F3] w-full flex flex-col items-start">
            <div className="flex items-start w-full bg-red-500 h-[302px]">
              <VideoSection
                currentDraw={currentDraw}
                customTimeLeft={customTimeLeft}
                videoState={{
                  videoLoaded: videoLoaded,
                  isVideoPlaying: false,
                  isCountdownActive: true
                }}
                gamePhase={gamePhase as any}
                lastDrawResults={recentDraws}
                blinkingResults={winningCodes}
                showResultOverlay={isShowingResult}
                onVideoLoad={handleVideoLoad}
                onVideoEnded={handleVideoEnded}
                onPlayVideo={handleVideoStart}
              />
              <ResultsSection recentDraws={recentDraws} />
            </div>

            <KyHienTaiHeader
              currentDrawNo={currentDraw.draw_no || "XD250608385"}
              timeLeft={customTimeLeft}
              todayOpened={recentDraws.length || 385}
              todayRemaining={177}
              showSeconds={true}
              width="100%"
            />

            {/* Message display */}
            {bettingState.message && (
              <div className={`w-full p-3 text-center text-white font-bold text-sm rounded-md ${bettingState.message.includes('thành công') || bettingState.message.includes('success')
                  ? 'bg-green-600'
                  : bettingState.message.includes('Đang gửi')
                    ? 'bg-blue-600'
                    : 'bg-red-600'
                }`}>
                {bettingState.message}
              </div>
            )}

            <div
              className="static mt-[5px] mr-[5px] ml-[5px] pt-0 pr-[5px] pb-[10px] pl-[5px] border-0 bg-white text-[#106eb6] text-[13px] font-normal text-left float-left"
              style={{
                width: "calc(100% - 10px)",
                minWidth: "600px",
                height: "270px"
              }}
            >
              <HuongDanSection
                guide={betTypesData?.data?.[0]?.description || "Dự đoán hột xúc xắc mở ra tài xỉu lẻ chẵn và đỏ trắng"}
                exampleDesc={betTypesData?.data?.[0]?.example || "Đặt cược con số 12</br>\nCon số mở thưởng: hậu nhị ***12 (trình tự vị trí con số \ngiống nhau)</br>\nNhư vậy bạn đã trúng tiền thưởng hàng số hậu nhị"}
                helpDesc={betTypesData?.data?.[0]?.help || "Nhập 2 con số bằng tay để tạo thành 1 tổ hợp, tất cả con số đã chọn phải trùng khớp với con số mở thưởng từ hàng chục, hàng đơn vị đồng thời trình tự con số phải như nhau, như vậy thì bạn đã trúng giải."}
              />

              <BettingOptions
                betTypesData={betTypesData}
                selectedChoices={bettingState.selectedChoices}
                onOptionSelect={handleOptionSelect}
                winningCodes={winningCodes}
                isBlinking={isBlinkingResults}
              />
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <BettingSidebar
          subType={subType}
          bettingState={bettingState}
          customTimeLeft={customTimeLeft}
          gamePhase={gamePhase as any}
          minMaxRates={calculateMinMaxRates}
          onBetChipChange={handleBetChipChange}
          onClickChip={handleClickChip}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />

        {/* Modals */}
        <PopupInfoMobile duplicates={duplicates} onConfirm={handleClose} />
        <PopupSuccess />
        <PopupSuccessQuota message={bettingState.message} />
        <PopupError message={bettingState.message} />
        <PopupBettingClosed drawNo={currentDraw.draw_no} />
        <LoXien currentDraw={currentDraw} />
        <LoTruot currentDraw={currentDraw} />
      </div>

      {/* Statistics section */}
      <StatisticsSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statisticData={statisticData}
        statisticLast30ResultData={statisticLast30ResultData}
        statisticDoubleBetData={statisticDoubleBetData}
        isStatisticLoading={isStatisticLoading}
        isStatisticDoubleBetLoading={isStatisticDoubleBetLoading}
        statisticDoubleBetError={statisticDoubleBetError}
      />
    </div>
  );
}

export default XocDiaKUContent; 