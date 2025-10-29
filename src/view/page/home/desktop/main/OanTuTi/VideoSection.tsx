import React, { useRef, useEffect, useCallback } from "react";
import { TimeLeft } from "./types";

// Enum cho trạng thái game
export enum GamePhase {
  DEFAULT = 'default',
  SHOWING_RESULT = 'showing_result',
  SHOW_RESULT = 'show_result'
}

interface VideoSectionProps {
  customTimeLeft: TimeLeft;
  gamePhase?: GamePhase;
  currentResult?: any;
  recentDraws?: any[];
}

const VideoSection: React.FC<VideoSectionProps> = ({
  customTimeLeft,
  gamePhase = GamePhase.DEFAULT,
  currentResult = null,
  recentDraws = []
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
      'BUA': 0,   // Búa - img_L_0.png
      'BAO': 1,   // Bao - img_L_1.png  
      'KEO': 2    // Kéo - img_L_2.png
    };
    return moveMap[move as keyof typeof moveMap] || 0;
  }, []);

  // Lấy moves từ dữ liệu kết quả
  const getGameMoves = useCallback((result: any = currentResult) => {
    if (!result) return { leftMove: 0, rightMove: 0 };
    return {
      leftMove: getMoveNumber(result.dealer),  // Cái
      rightMove: getMoveNumber(result.player)  // Con
    };
  }, [currentResult, getMoveNumber]);

  const { leftMove, rightMove } = getGameMoves();

  // Lấy kết quả phiên trước
  const getPreviousResult = () => {
    if (recentDraws && recentDraws.length > 0) {
      return recentDraws[0]; // Phiên trước gần nhất
    }
    return null;
  };

  const previousResult = getPreviousResult();

  // Lấy ảnh overlay theo trạng thái
  const getOverlayImage = useCallback(() => {
    if ((gamePhase === GamePhase.SHOWING_RESULT || gamePhase === GamePhase.SHOW_RESULT) && currentResult) {
      return currentResult.winner === 'CAI'
        ? '/images/oantuti/img_rpsBox_RedWin.png'
        : '/images/oantuti/img_rpsBox_BlueWin.png';
    }
    return '/images/oantuti/img_rpsBox.png';
  }, [gamePhase, currentResult?.winner]);

  return (
    <div
      style={{
        flex: "1",
        maxWidth: "calc(100% - 202px)",
        minWidth: "400px",
        height: "302px",
        backgroundColor: "#fff",
        float: "left",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Video nền loop */}
      <video
        ref={videoRef}
        src="/images/oantuti/oantuti-loop.mp4"
        style={{
          width: "100%",
          height: "302px",
          objectFit: "cover",
          display: "block",
          zIndex: 1
        }}
        controls={false}
        playsInline
        preload="auto"
        loop={true}
        muted={true}
        autoPlay={true}
      />

      {/* Overlay theo trạng thái game */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 5 }}>
        <div
          className="bg-contain bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `url(${getOverlayImage()})`,
            width: "350px",
            height: "300px",
          }}
        >
          {/* Hiển thị kết quả phiên trước khi ở phase DEFAULT */}
          {gamePhase === GamePhase.DEFAULT && previousResult && (() => {
            const { leftMove: prevLeftMove, rightMove: prevRightMove } = getGameMoves(previousResult);
            return (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
                <div className="flex items-center justify-center gap-4">
                  {/* Move Cái */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-red-600 font-bold">Cái</div>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                      <img
                        src={`/images/oantuti/img_L_${prevLeftMove}.png`}
                        alt={`Dealer ${previousResult.dealer}`}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>

                  <div className="w-10" />

                  {/* Move Con */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-blue-600 font-bold">Con</div>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                      <img
                        src={`/images/oantuti/img_R_${prevRightMove}.png`}
                        alt={`Player ${previousResult.player}`}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Hiển thị countdown */}
          {!previousResult && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 6 }}>
              <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-xl font-bold">
                {gamePhase === GamePhase.DEFAULT ? (
                  <>
                    {customTimeLeft.minutes.toString().padStart(2, '0')}:
                    {customTimeLeft.seconds.toString().padStart(2, '0')}
                  </>
                ) : (
                  '00:00'
                )}
              </div>
            </div>
          )}

          {/* Hiển thị GIF Oẳn tù tì trong phase SHOWING_RESULT */}
          {gamePhase === GamePhase.SHOWING_RESULT && (
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
              <div className="flex items-center justify-center gap-20 w-full -ml-2">
                <div className="flex flex-col items-center justify-center">
                  <img src="/images/oantuti/img_L_rps.gif" alt="Oan Tu Ti" className="w-20" />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <img src="/images/oantuti/img_R_rps.gif" alt="Oan Tu Ti" className="w-20" />
                </div>
              </div>
            </div>
          )}

          {/* Hiển thị moves thực tế trong phase SHOW_RESULT */}
          {gamePhase === GamePhase.SHOW_RESULT && currentResult && (
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
              <div className="flex items-center justify-center gap-4">
                {/* Move Cái */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-red-600 font-bold">Cái</div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                    <img
                      src={`/images/oantuti/img_L_${leftMove}.png`}
                      alt={`Dealer ${currentResult.dealer}`}
                      className={`w-16 h-16 object-contain ${currentResult.winner === 'CAI' ? 'animate-blink' : ''}`}
                    />
                  </div>
                </div>

                <div className="w-10" />

                {/* Move Con */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-blue-600 font-bold">Con</div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                    <img
                      src={`/images/oantuti/img_R_${rightMove}.png`}
                      alt={`Player ${currentResult.player}`}
                      className={`w-16 h-16 object-contain ${currentResult.winner === 'CON' ? 'animate-blink' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS cho animation */}
      <style jsx>{`
        .animate-blink {
          animation: blink 0.5s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default VideoSection; 