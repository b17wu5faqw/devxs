import LoTruot from "@/components/game-input/LoTruot";
import LoXien from "@/components/game-input/LoXien";
import PopupBettingClosed from "@/components/modal/PopupBettingClosed";
import PopupError from "@/components/modal/PopupError";
import PopupInfoMobile from "@/components/modal/PopupInfoMobile";
import PopupSuccess from "@/components/modal/PopupSuccess";
import PopupSuccessQuota from "@/components/modal/PopupSuccessQuota";
import CustomText from "@/components/text/CustomText";
import { useOanTuTiGame } from "@/hooks/useOanTuTiGame";
import KyHienTaiHeader from "@/view/page/home/desktop/main/Common/KyHienTaiHeader";
import React, { useMemo, useState, useEffect } from "react";
import HuongDanSection from "../Common/HuongDanSection";
// Import RPS API hooks - Chỉ dùng statistic-result
import { useStatisticResult } from "@/hooks/useRps";
// Import XocDia components
import BettingOptions from "./BettingOptions";
import BettingSidebar from "./BettingSidebar";
import ResultsSection from "./ResultsSection";
import StatisticsSection from "./StatisticsSection";
import VideoSection from "./VideoSection";
// Import types and utils
import { SubType, TimeLeft } from "./types";
import { getRpsPrizeRate } from "./utils";

// Move gameConfig outside component to prevent re-creation
const gameConfig = {
  SHOWING_RESULT_SECONDS: 3,
  DEFAULT_SECONDS: 3,
  TEST_MODEL_PopupBettingClosed: false,
  LOG_SHOW: true, // Set to true to enable session result logging
};

function OanTuTiKUContent() {
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

    // Statistics data (không dùng nữa - sử dụng API riêng biệt)

    // Functions
    handleOptionSelect,
    handleClickChip,
    handleBetChipChange,
    handleCancel,
    handleSubmit,

    // Shared utility functions
    recentDraws,
    winningCodes,
  } = useOanTuTiGame(gameConfig);

  // ===== API HOOKS CHO STATISTICS - Chỉ dùng rps/statistic-result =====
  const {
    data: statisticDataFromApi,
    isLoading: isStatisticLoadingFromApi,
    error: statisticErrorFromApi,
  } = useStatisticResult();

  // ===== STATE PHỤ (UI specific) =====
  const [duplicates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"points" | "keo-doi">("points");
  const [leftActiveTab, setLeftActiveTab] = useState<"nha-cai" | "nha-con">(
    "nha-cai"
  );

  // ===== CLEAR STATE ON MOUNT/UNMOUNT =====
  useEffect(() => {
    // Clear everything when component mounts
    const clearAllState = () => {
      // Clear betting state
      handleCancel();

      // Reset UI state
      setActiveTab("points");
      setLeftActiveTab("nha-cai");
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
      seconds: seconds,
    };
  }, [countdownSeconds]);

  // Tính toán tỷ lệ thắng min/max
  const calculateMinMaxRates = useMemo(() => {
    if (!bettingState.selectedChoices.length || !betTypesData?.data) {
      return { min: 0, max: 0 };
    }

    const rates = bettingState.selectedChoices.map((choice) =>
      getRpsPrizeRate(choice, betTypesData)
    );

    return {
      min: Math.min(...rates),
      max: Math.max(...rates),
    };
  }, [bettingState.selectedChoices, betTypesData]);

  // ===== SỬ DỤNG SHARED UTILITIES TỪ HOOK =====
  // recentDraws, getWinningCodes, winningCodes đã được lấy từ hook

  // Cấu hình SubType
  const subType: SubType = useMemo(() => {
    const defaultSubType = {
      id: 1,
      name: "Oẳn tù tì KU",
      rate: "2.95",
      price_rate: "2.95",
      prize_rate: "2.95",
      title: "Oẳn tù tì KU",
      help: "Dự đoán kết quả Oẳn tù tì",
      description: "Game Oẳn tù tì truyền thống",
      example: "Chọn Cái/Con hoặc tổ hợp cụ thể",
      max_bet: 10000,
      max_number: 4,
    };

    if (betTypesData?.data) {
      const firstGroup = Object.values(betTypesData.data)[0] as any;
      if (firstGroup && firstGroup.options && firstGroup.options.length > 0) {
        const firstOption = firstGroup.options[0];
        return {
          ...defaultSubType,
          rate: firstOption.rate || "2.95",
          price_rate: firstOption.rate || "2.95",
          prize_rate: firstOption.rate || "2.95",
        };
      }
    }

    return defaultSubType;
  }, [betTypesData]);

  // ===== RENDER COMPONENT =====
  // Kiểm tra trạng thái kết nối
  if (!isConnected) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-gray-100 py-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <CustomText className="text-gray-600 font-medium">
            Đang kết nối máy chủ...
          </CustomText>
        </div>
      </div>
    );
  }

  // Kiểm tra trạng thái loading
  if (isLoading || isLoadingCurrentDraw) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-gray-100 py-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <CustomText className="text-gray-600 font-medium">
            Đang tải phiên...
          </CustomText>
        </div>
      </div>
    );
  }

  // Render giao diện chính
  return (
    <div style={{ maxWidth: "1012px", minWidth: "1012px" }}>
      <div
        className="w-full h-full flex justify-start flex-row p-[5px_5px_0_5px] items-start bg-[#F3F3F3]"
        style={{ minWidth: "1012px" }}
      >
        {/* Khu vực nội dung chính */}
        <div
          className="flex flex-col flex-1 mr-[5px]"
          style={{ minWidth: "600px" }}
        >
          <div className="bg-[#F3F3F3] w-full flex flex-col items-start">
            <div className="flex items-start w-full bg-red-500 h-[302px]">
              <VideoSection
                customTimeLeft={customTimeLeft}
                gamePhase={gamePhase}
                currentResult={currentPhaseResult}
                recentDraws={recentDraws}
              />
              <ResultsSection recentDraws={recentDraws} />
            </div>

            <KyHienTaiHeader
              currentDrawNo={currentDraw.draw_no || "OTT250608385"}
              timeLeft={customTimeLeft}
              todayOpened={recentDraws.length}
              todayRemaining={177}
              showSeconds={true}
              width="100%"
              gamePhase={gamePhase}
            />

            {/* Message display */}
            {bettingState.message && (
              <div
                className={`w-full p-3 text-center text-white font-bold text-sm rounded-md ${
                  bettingState.message.includes("thành công") ||
                  bettingState.message.includes("success")
                    ? "bg-green-600"
                    : bettingState.message.includes("Đang gửi")
                    ? "bg-blue-600"
                    : "bg-red-600"
                }`}
              >
                {bettingState.message}
              </div>
            )}
            <div
              className="static mt-[5px] mr-[5px] ml-[5px] pt-0 pr-[5px] pb-[10px] pl-[5px] border-0 bg-white text-[#106eb6] text-[13px] font-normal text-left float-left"
              style={{
                width: "calc(100% - 10px)",
                minWidth: "600px",
                height: "270px",
              }}
            >
              <HuongDanSection
                guide={
                  betTypesData?.data
                    ? "Dự đoán kết quả Oẳn tù tì với các lựa chọn Cái, Con và tổ hợp"
                    : "Dự đoán kết quả Oẳn tù tì"
                }
                exampleDesc="Đặt cược Cái thắng</br>\nKết quả: Cái búa thắng Con kéo</br>\nNhư vậy bạn đã trúng tiền thưởng"
                helpDesc="Chọn tổ hợp cụ thể hoặc đặt cược tổng quát Cái/Con để dự đoán kết quả trận đấu."
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

        {/* Sidebar bên phải */}
        <BettingSidebar
          subType={subType}
          bettingState={bettingState}
          customTimeLeft={customTimeLeft}
          gamePhase={gamePhase}
          minMaxRates={calculateMinMaxRates}
          onBetChipChange={handleBetChipChange}
          onClickChip={handleClickChip}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />

        {/* Modals */}
        <PopupInfoMobile duplicates={duplicates} onConfirm={() => {}} />
        <PopupSuccess />
        <PopupSuccessQuota message={bettingState.message} />
        <PopupError message={bettingState.message} />
        <PopupBettingClosed drawNo={currentDraw.draw_no} />
        <LoXien currentDraw={currentDraw} />
        <LoTruot currentDraw={currentDraw} />
      </div>

      {/* Phần thống kê - Chỉ dùng rps/statistic-result */}
      <StatisticsSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statisticData={statisticDataFromApi}
        statisticLast30ResultData={statisticDataFromApi}
        statisticDoubleBetData={statisticDataFromApi} // Dùng cùng API
        isStatisticLoading={isStatisticLoadingFromApi}
        isStatisticDoubleBetLoading={isStatisticLoadingFromApi}
        statisticDoubleBetError={statisticErrorFromApi}
        leftActiveTab={leftActiveTab}
        onLeftTabChange={setLeftActiveTab}
      />
    </div>
  );
}

export default OanTuTiKUContent;
