import React, { useEffect, useRef } from "react";
import { DrawType, TimeLeft, VideoState } from "./types";

// Game phases enum - should match the hook's enum
export enum GamePhase {
  DEFAULT = "default",
  SHOWING_RESULT = "showing_result",
  SHOW_RESULT = "show_result",
}

// Config vị trí dice - dễ dàng thay đổi
const DICE_POSITIONS = {
  dice1: { top: '40%', left: '41%' },    // Dice 1 - có thể điều chỉnh theo %
  dice2: { top: '25%', right: '35%' },   // Dice 2 
  dice3: { bottom: '10%', left: '55%' }, // Dice 3
  dice4: { bottom: '30%', right: '25%' } // Dice 4
};

interface VideoSectionProps {
  mobileMode?: boolean;
  currentDraw: DrawType;
  customTimeLeft: TimeLeft;
  videoState: VideoState;
  gamePhase?: GamePhase;
  lastDrawResults?: any[];
  blinkingResults?: string[];
  showResultOverlay?: boolean;
  onVideoLoad: () => void;
  onVideoEnded: () => void;
  onPlayVideo: () => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  mobileMode = false,
  currentDraw,
  customTimeLeft,
  videoState,
  gamePhase = GamePhase.DEFAULT,
  lastDrawResults = [],
  blinkingResults = [],
  showResultOverlay = false,
  onVideoLoad,
  onVideoEnded,
  onPlayVideo
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (gamePhase === GamePhase.SHOWING_RESULT) {
      videoRef.current.currentTime = 0; // Reset video to start
      videoRef.current
        .play()
        .then(() => {
          onPlayVideo();
        })
        .catch(() => {
          // noop
        });
    } else if (gamePhase === GamePhase.SHOW_RESULT) {
      videoRef.current.pause();
    } else {
      videoRef.current.pause();
    }
  }, [gamePhase, onPlayVideo]);

  // Hàm lấy kết quả dice từ phiên gần nhất
  const getLatestDiceResult = () => {
    if (!lastDrawResults || lastDrawResults.length === 0) {
      return ['W', 'W', 'W', 'W']; // Default fallback
    }

    const latestResult = lastDrawResults[0];
    if (latestResult?.result && typeof latestResult.result === 'string') {
      const dices = latestResult.result.split(',');
      // Đảm bảo luôn có đủ 4 dice
      while (dices.length < 4) {
        dices.push('W');
      }
      return dices.slice(0, 4);
    }

    return ['W', 'W', 'W', 'W']; // Default fallback
  };

  const renderDiceWithPosition = (diceValue: string, position: number) => {
    const isRed = diceValue === 'R';
    const imagePath = `/images/sicbo/pc/${position}${isRed ? '1' : '0'}.png`;
    const positionKey = `dice${position}` as keyof typeof DICE_POSITIONS;
    const positionStyle = DICE_POSITIONS[positionKey];

    return (
      <img
        key={position}
        src={imagePath}
        alt={`Dice ${position} ${isRed ? 'Red' : 'White'}`}
        className={`absolute ${mobileMode ? 'w-14 h-14' : 'w-18 h-18'} object-contain transform -translate-x-1/2 -translate-y-1/2`}
        style={positionStyle}
      />
    );
  };

  const latestDiceResults = getLatestDiceResult();

  const displayDrawNo = `${currentDraw.id}${currentDraw.draw_no}`;
  const shouldShowDiceOverlay = gamePhase === GamePhase.DEFAULT || gamePhase === GamePhase.SHOW_RESULT;
  const shouldShowBlinkingEffect = gamePhase === GamePhase.SHOW_RESULT;

  return (
    <div
      style={{
        flex: "1",
        maxWidth: mobileMode ? "100%" : "calc(100% - 202px)",
        minWidth: mobileMode ? "100%" : "400px",
        height: mobileMode ? "100%" : "302px",
        backgroundColor: mobileMode ? "transparent" : "#fff",
        float: "left",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <video
        ref={videoRef}
        src="https://cuvnae.gs5168.com/video/sicBoRWElec/sicBoRWElec.mp4"
        style={{
          width: "100%",
          height: mobileMode ? "100%" : "302px",
          objectFit: mobileMode ? "contain" : "cover",
          display: "block",
          zIndex: gamePhase === GamePhase.SHOWING_RESULT ? 10 : 1
        }}
        onEnded={() => {
          onVideoEnded();
        }}
        onLoadedData={() => {
          onVideoLoad();
        }}
        onPlay={() => {
        }}
        onPause={() => {
        }}
        controls={false}
        playsInline
        preload="auto"
        loop={false}
        muted={true}
        autoPlay={false}
      />

      {/* Dice result overlay - show during DEFAULT and SHOW_RESULT phases */}
      {shouldShowDiceOverlay && (
        <div
          className={`absolute inset-0 ${mobileMode ? 'bg-contain bg-center bg-no-repeat' : 'bg-cover bg-center bg-no-repeat'}`}
          style={{
            backgroundImage: 'url(/images/sicbo/bg_SicBoFastElec_m.jpg)',
            zIndex: 5
          }}
        >
          {/* Hiển thị 4 dice với absolute positioning */}
          {latestDiceResults.map((diceValue: string, index: number) =>
            renderDiceWithPosition(diceValue, index + 1)
          )}
        </div>
      )}

      {/* Game info overlay - hiển thị khi không play video, nhưng ẩn khi đang hiển thị kết quả */}
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center gap-[10px] h-[50px] text-[22px] text-white" style={{ zIndex: 6 }}>
        Số kỳ
        <a className="text-[#fec000]">{displayDrawNo}</a>
        &nbsp;
        <span></span>
      </div>

      {shouldShowBlinkingEffect && blinkingResults.length > 0 && (() => {
        const hasBig = blinkingResults.includes('BIG');
        const hasSmall = blinkingResults.includes('SMALL');
        const hasOdd = blinkingResults.includes('ODD');
        const hasEven = blinkingResults.includes('EVEN');
        const displayCodes: string[] = [];
        if (hasBig) displayCodes.push('BIG');
        else if (hasSmall) displayCodes.push('SMALL');
        if (hasOdd) displayCodes.push('ODD');
        else if (hasEven) displayCodes.push('EVEN');
        const finalCodes = displayCodes.length > 0
          ? displayCodes.slice(0, 2)
          : blinkingResults.slice(0, 2);

        const getLabel = (code: string) =>
          code === 'BIG' ? 'TÀI' : code === 'SMALL' ? 'XỈU' : code === 'ODD' ? 'LẺ' : 'CHẴN';

        return (
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-4 flex justify-center gap-3 px-3"
            style={{ zIndex: 15 }}
          >
            {finalCodes.map((code, index) => (
              <div
                key={index}
                className="px-3 py-1.5 rounded-sm font-semibold animate-pulse shadow-sm backdrop-blur-sm"
                style={{
                  color: '#FFFFFF',
                  background: '#4D4D4D50',
                }}
              >
                {getLabel(code)}
              </div>
            ))}
          </div>
        );
      })()}

      {/* CSS cho animation */}
      <style jsx>{`
        @keyframes blink-result {
          0%, 100% {
            background-color: rgba(77, 77, 77, 0.32); /* #4D4D4D50 approx */
            transform: scale(1);
          }
          50% {
            background-color: rgba(77, 77, 77, 0.64);
            transform: scale(1.02);
          }
        }
        .animate-pulse {
          animation: blink-result 0.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoSection; 