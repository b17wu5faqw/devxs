import React, { useRef, useEffect, useCallback, useState } from "react";
import { VideoAreaProps, GamePhase, TimeLeft } from "./types";

const VideoArea: React.FC<VideoAreaProps> = ({
  gamePhase,
  showVideo,
  showDiceOverlay,
  showResultOverlay,
  currentDraw,
  currentPhaseResult,
  blinkingResults,
  onVideoEnded,
  onVideoLoad,
  lastDrawResults,
  countdown,
  addToSessionLog,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Tự động phát video khi component mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Xử lý lỗi autoplay một cách im lặng
      });
    }
  }, []);

  // Chuyển đổi RPS move thành số cho hình ảnh
  const getMoveNumber = useCallback((move: string): number => {
    const moveMap = {
      BUA: 0, // Búa - img_L_0.png
      BAO: 1, // Bao - img_L_1.png
      KEO: 2, // Kéo - img_L_2.png
    };
    return moveMap[move as keyof typeof moveMap] || 0;
  }, []);

  // Tách riêng kết quả phiên hiện tại và phiên trước
  const getCurrentResult = () => {
    if (
      currentPhaseResult &&
      currentPhaseResult.dealer &&
      currentPhaseResult.player &&
      currentPhaseResult.winner
    ) {
      return currentPhaseResult;
    }
    return null;
  };

  const getPreviousResult = () => {
    if (lastDrawResults && lastDrawResults.length > 0) {
      return lastDrawResults[0]; // Phiên trước gần nhất
    }
    return null;
  };

  const currentResult = getCurrentResult();
  const previousResult = getPreviousResult();

  // Log khi gamePhase thay đổi
  useEffect(() => {
    if (addToSessionLog) {
      addToSessionLog("video_area_gamephase_changed", {
        gamePhase,
        showResultOverlay,
        timestamp: Date.now(),
      });
    }
  }, [gamePhase, showResultOverlay, addToSessionLog]);

  // Lấy moves dựa trên phase hiện tại
  const getGameMoves = useCallback(
    (result: any) => {
      if (!result) return { leftMove: 0, rightMove: 0 };
      return {
        leftMove: getMoveNumber(result.dealer), // Cái
        rightMove: getMoveNumber(result.player), // Con
      };
    },
    [getMoveNumber]
  );

  // Lấy ảnh overlay theo trạng thái
  const getOverlayImage = useCallback(() => {
    if (
      (gamePhase === GamePhase.SHOWING_RESULT ||
        gamePhase === GamePhase.SHOW_RESULT) &&
      currentResult
    ) {
      return currentResult.winner === "CAI"
        ? "/images/oantuti/img_rpsBox_RedWin.png"
        : "/images/oantuti/img_rpsBox_BlueWin.png";
    }
    return "/images/oantuti/img_rpsBox.png";
  }, [gamePhase, currentResult?.winner]);

  // Đồng bộ số kỳ: Ưu tiên currentDraw từ props
  const displayDrawNo = currentDraw?.draw_no || "N/A";

  return (
    <div className="relative w-full bg-blue-900" style={{ height: "197px" }}>
      <div className="relative w-full h-full">
        {/* Video nền loop */}
        <video
          ref={videoRef}
          src="/images/oantuti/oantuti-loop.mp4"
          className="w-full h-full object-cover"
          controls={false}
          playsInline
          preload="auto"
          height={197}
          loop={true}
          muted={true}
          autoPlay={true}
          onEnded={onVideoEnded}
          onLoadedData={onVideoLoad}
        />

        {/* Overlay theo trạng thái game */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 5 }}
        >
          <div
            className="bg-contain bg-center bg-no-repeat relative"
            style={{
              backgroundImage: `url(${getOverlayImage()})`,
              width: "240px",
              height: "240px",
              backgroundPositionX: "4px",
            }}
          >
            {/* Hiển thị kết quả phiên trước chỉ khi ở phase DEFAULT */}
            {gamePhase === GamePhase.DEFAULT &&
              previousResult &&
              (() => {
                const { leftMove, rightMove } = getGameMoves(previousResult);
                return (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ zIndex: 10 }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {/* Move Cái */}
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                          <img
                            src={`/images/oantuti/img_L_${leftMove}.png`}
                            alt={`Dealer ${previousResult.dealer}`}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      </div>
                      <div className="w-8" />
                      {/* Move Con */}
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                          <img
                            src={`/images/oantuti/img_R_${rightMove}.png`}
                            alt={`Player ${previousResult.player}`}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hiển thị kết quả phiên trước */}
                    <div className="mb-2 text-center">
                      <div
                        className={`text-lg font-bold ${
                          previousResult.winner === "CAI"
                            ? "text-red-600"
                            : previousResult.winner === "CON"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {previousResult.winner === "CAI"
                          ? "CÁI THẮNG"
                          : previousResult.winner === "CON"
                          ? "CON THẮNG"
                          : "HÒA"}
                      </div>
                    </div>
                  </div>
                );
              })()}
            {/* Phase SHOWING_RESULT: Hiển thị GIF Oẳn tù tì */}
            {gamePhase === GamePhase.SHOWING_RESULT && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ zIndex: 20 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="/images/oantuti/img_L_rps.gif"
                      alt="Oan Tu Ti"
                      className="w-20"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="/images/oantuti/img_R_rps.gif"
                      alt="Oan Tu Ti"
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Phase SHOW_RESULT: Hiển thị moves thực tế */}
            {gamePhase === GamePhase.SHOW_RESULT &&
              currentResult &&
              (() => {
                const { leftMove, rightMove } = getGameMoves(currentResult);
                return (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ zIndex: 10 }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {/* Move Cái */}
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-red-600 font-bold">
                          Cái
                        </div>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                          <img
                            src={`/images/oantuti/img_L_${leftMove}.png`}
                            alt={`Dealer ${currentResult.dealer}`}
                            className={`w-12 h-12 object-contain ${
                              currentResult.winner === "CAI"
                                ? "animate-blink"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                      <div className="w-8" />
                      {/* Move Con */}
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-blue-600 font-bold">
                          Con
                        </div>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                          <img
                            src={`/images/oantuti/img_R_${rightMove}.png`}
                            alt={`Player ${currentResult.player}`}
                            className={`w-12 h-12 object-contain ${
                              currentResult.winner === "CON"
                                ? "animate-blink"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hiển thị kết quả phiên hiện tại với blinking */}
                    <div className="mt-2 text-center">
                      <div
                        className={`text-lg font-bold ${
                          currentResult.winner === "CAI"
                            ? "text-red-600"
                            : currentResult.winner === "CON"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {currentResult.winner === "CAI"
                          ? "CÁI THẮNG"
                          : currentResult.winner === "CON"
                          ? "CON THẮNG"
                          : "HÒA"}
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>

        {/* Draw number display */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-xs flex items-center gap-2 z-10">
          <span className="text-xs">Số kỳ</span>
          <span className="text-yellow-400 text-sm font-bold">
            {displayDrawNo}
          </span>
        </div>
      </div>

      {/* CSS cho animation */}
      <style jsx>{`
        .animate-blink {
          animation: blink 0.5s infinite;
        }
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoArea;
