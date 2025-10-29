"use client";

import React, { useMemo, useState, useEffect } from "react";
import useBalanceStore from "@/stores/balanceStore";
import useModalStore from "@/stores/modalStore";
import { useXocDiaGame } from "@/hooks/useXocDiaGame";
import {
  useStatisticLast30Result,
  useStatisticResult,
  useStatisticDoubleBet,
} from "@/hooks/useSicbo";
import { MODAL } from "@/constant/modal";
import { useRouter } from "next/navigation";
import {
  BettingOptions,
  ChatSection,
  Header,
  TabSection,
  TabType,
  UserHeader,
} from "@/components/modal/_components/XocDiaKUMobile";
import VideoSection, {
  GamePhase,
} from "@/view/page/home/desktop/main/XocDia/VideoSection";
import { SubType, TimeLeft } from "@/view/page/home/desktop/main/XocDia/types";
import {
  getPrizeRate,
  getOptionName,
} from "@/view/page/home/desktop/main/XocDia/utils";
import PopupConfirmMobile from "@/components/modal/PopupConfirmMobile";
import PopupInfoMobile from "@/components/modal/PopupInfoMobile";
import PopupSuccess from "@/components/modal/PopupSuccess";
import PopupSuccessQuota from "@/components/modal/PopupSuccessQuota";
import PopupError from "@/components/modal/PopupError";
import PopupBettingClosed from "@/components/modal/PopupBettingClosed";
import PopupXocDiaResultsMobile from "@/components/modal/PopupXocDiaResultsMobile";
import LoXien from "@/components/game-input/LoXien";
import LoTruot from "@/components/game-input/LoTruot";
const blinkingStyle = `
  @keyframes blink-result {
    0%, 50% { background-color: #FFD700; }
    51%, 100% { background-color: #FF4500; }
  }
  .blink-result {
    animation: blink-result 0.5s infinite;
  }

  @keyframes result-notification-flicker {
    0%, 49% { background-color: transparent; }
    50%, 100% { background-color: rgba(179, 160, 94, 0.5); }
  }
  .result-notification-flicker-bg {
    animation: result-notification-flicker 0.5s infinite;
  }

  @keyframes dice-shake {
    0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
    25% { transform: translate(-50%, -50%) rotate(-5deg) scale(1.1); }
    75% { transform: translate(-50%, -50%) rotate(5deg) scale(1.1); }
  }
  .dice-shake {
    animation: dice-shake 0.5s ease-in-out infinite;
  }

  @keyframes countdown-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  .countdown-pulse {
    animation: countdown-pulse 1s ease-in-out infinite;
  }

  @keyframes fade-in-overlay {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  .fade-in-overlay {
    animation: fade-in-overlay 0.3s ease-out;
  }
`;
const gameConfig = {
  SHOWING_RESULT_SECONDS: 3,
  DEFAULT_SECONDS: 3,
  TEST_MODEL_PopupBettingClosed: false,
  LOG_SHOW: true, // Enable logging for debugging
};
const XocDiaKuMobileContent = React.memo(function XocDiaKuMobileContent() {
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const balance = useBalanceStore((state) => state.balance);
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);
  const {
    // State
    currentDraw,
    bettingState,
    setBettingState,
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

    recentDraws,
    winningCodes,
  } = useXocDiaGame(gameConfig);

  const {
    data: statisticLast30ResultData,
    isLoading: isStatisticLast30ResultLoading,
    error: statisticLast30ResultError,
  } = useStatisticLast30Result();

  const {
    data: statisticData,
    isLoading: isStatisticLoading,
    error: statisticError,
  } = useStatisticResult();

  const {
    data: statisticDoubleBetData,
    isLoading: isStatisticDoubleBetLoading,
    error: statisticDoubleBetError,
  } = useStatisticDoubleBet();

  const [duplicates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.COMBINATION);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (bettingState.message) {
      setMessage(bettingState.message);
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bettingState.message]);

  const customTimeLeft: TimeLeft = useMemo(() => {
    const minutes = Math.floor(countdownSeconds / 60);
    const seconds = countdownSeconds % 60;
    return {
      hours: 0,
      minutes: minutes,
      seconds: seconds,
    };
  }, [countdownSeconds]);

  const mobileTimeLeft = customTimeLeft;
  const parsedCurrentDraw = currentDraw;
  const lastDrawResults = recentDraws;
  const blinkingResults = winningCodes;
  const showResultOverlay = isShowingResult;

  const calculateMinMaxRates = useMemo(() => {
    if (!bettingState.selectedChoices.length || !betTypesData?.data) {
      return { min: 0, max: 0 };
    }

    const rates = bettingState.selectedChoices.map((choice) =>
      getPrizeRate(choice, betTypesData)
    );

    return {
      min: Math.min(...rates),
      max: Math.max(...rates),
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
        max_number: 4,
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
      max_number: 4,
    };
  }, [betTypesData]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoEnded = () => {
  };

  const handleVideoStart = () => {
  };

  const handleClose = async () => {
  };

  const handleBetRecordClick = () => {
    router.push("/history");
  };

  const handleVideoToggle = () => {
  };

  const handleBalanceClick = () => {
    fetchBalance();
  };

  const handleBetSelection = (optionId: string) => {
    handleOptionSelect(optionId);
  };

  const handleBetConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleResultsClick = () => {
    openModal(MODAL.XOCDIA_RESULTS_MOBILE);
  };

  const handleConfirmSubmit = async (
    totalChip: number,
    betChip: number
  ) => {
    setShowConfirmModal(false);
    setBettingState((prev) => ({
      ...prev,
      betChip: betChip,
      totalChip: totalChip,
    }));
    await handleSubmit(betChip);
  };

  return (
    <>
      <style>{blinkingStyle}</style>
      <div className="fixed inset-0 bg-black z-50">
        {/* Header */}
        <Header
          onHomeClick={() => router.back()}
          onResultsClick={handleResultsClick}
          onBetRecordClick={handleBetRecordClick}
          onMenuClick={() => openModal(MODAL.MENU_MOBILE)}
        />

        {/* Header người dùng với thông tin kỳ quay */}
        <UserHeader
          currentDraw={parsedCurrentDraw}
          countdown={mobileTimeLeft}
          gamePhase={gamePhase as any} // Type conversion for mobile compatibility
          onVideoToggle={handleVideoToggle}
          onBalanceClick={handleBalanceClick}
        />

        {/* Thông báo thành công/lỗi */}
        {message && (
          <div
            className={`p-2 text-center text-white ${
              message.includes("thành công") ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Khu vực video - Sử dụng desktop VideoSection với mobile wrapper */}
        <div className="relative w-full bg-black overflow-hidden flex items-center justify-center">
          <style jsx>{`
            .mobile-video-override > div {
              max-width: 100% !important;
              min-width: auto !important;
              height: 197px !important;
              float: none !important;
              flex: 1 !important;
              width: 100% !important;
              margin: 0 auto !important;
              position: relative !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
            .mobile-video-override video {
              object-fit: contain !important;
              height: auto !important;
              max-height: 197px !important;
              width: auto !important;
              max-width: 100% !important;
            }
          `}</style>
          <div className="mobile-video-override w-full h-[220px] flex">
            <VideoSection
              mobileMode={true}
              currentDraw={parsedCurrentDraw}
              customTimeLeft={mobileTimeLeft}
              videoState={{
                videoLoaded: videoLoaded,
                isVideoPlaying: gamePhase === GamePhase.SHOWING_RESULT,
                isCountdownActive: gamePhase === GamePhase.DEFAULT,
              }}
              gamePhase={gamePhase as any}
              lastDrawResults={lastDrawResults}
              blinkingResults={blinkingResults}
              showResultOverlay={showResultOverlay}
              onVideoLoad={handleVideoLoad}
              onVideoEnded={handleVideoEnded}
              onPlayVideo={handleVideoStart}
            />
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto mb-[60px]"
          style={{ height: "calc(100vh - 55px - 39px - 197px - 60px)" }}
        >
          <BettingOptions
            betTypesData={betTypesData}
            selectedChoices={bettingState.selectedChoices}
            onOptionSelect={handleBetSelection}
            winningCodes={winningCodes}
            isBlinking={isBlinkingResults}
            gamePhase={gamePhase as any} // Type conversion for mobile compatibility
            onConfirm={handleBetConfirm}
            onCancel={handleCancel}
            isSubmitting={bettingState.isSubmitting}
            minMaxRates={calculateMinMaxRates}
            selectedChoiceNames={bettingState.selectedChoices.map(
              getOptionName
            )}
          />

          <TabSection
            activeTab={activeTab}
            onTabChange={handleTabChange}
            lastDrawResults={lastDrawResults}
            statisticData={statisticData}
            statisticLast30ResultData={statisticLast30ResultData}
            statisticDoubleBetData={statisticDoubleBetData}
            isStatisticLoading={isStatisticLoading}
            isStatisticDoubleBetLoading={isStatisticDoubleBetLoading}
            statisticDoubleBetError={statisticDoubleBetError}
          />
        </div>

        <ChatSection />
      </div>

      <PopupConfirmMobile
        drawName={subType.name}
        drawId={parsedCurrentDraw?.id || 0}
        drawNo={parsedCurrentDraw?.draw_no || ""}
        subtypeId={subType.id}
        inputType={0}
        title={subType.title}
        numbers={bettingState.selectedChoices.map(getOptionName)}
        betChip={bettingState.betChip}
        totalChip={bettingState.totalChip}
        rate={calculateMinMaxRates.max || 1}
        prizeRate={calculateMinMaxRates.min || 1.985}
        totalPrize={bettingState.totalPrize}
        maxBet={subType.max_bet}
        disabled={bettingState.isSubmitting || gamePhase !== GamePhase.DEFAULT}
        externalOpen={showConfirmModal}
        externalOnClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
      />

      <PopupInfoMobile duplicates={duplicates} onConfirm={handleClose} />
      <PopupSuccess />
      <PopupSuccessQuota message={bettingState.message} />
      <PopupError message={bettingState.message} />
      <PopupBettingClosed drawNo={currentDraw.draw_no} />
      <PopupXocDiaResultsMobile recentDraws={recentDraws} />
      <LoXien currentDraw={currentDraw} />
      <LoTruot currentDraw={currentDraw} />
    </>
  );
});

export default XocDiaKuMobileContent;
