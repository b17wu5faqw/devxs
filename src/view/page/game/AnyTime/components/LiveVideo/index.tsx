"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface LiveVideoProps {
  gType: number;
  winningCodes: string[];
  gamePhase: string;
}

declare global {
  interface Window {
    VigoPlayer?: {
      load: (cb: () => void) => void;
      new (): VigoPlayerInstance;
    };
  }
}

interface VigoPlayerInstance {
  setView: (id: string) => void;
  setScaleMode: (mode: number) => void;
  setBufferTime: (ms: number) => void;
  skipLoopFilter: (val: number) => void;
  setKeepScreenOn: () => void;
  setTimeout: (sec: number) => void;
  on(event: "start" | "stop", cb: () => void): void;
  on(event: "error", cb: (err: unknown) => void): void;
  on(
    event: "videoInfo",
    cb: (w: number, h: number, codec: string) => void
  ): void;
  on(
    event: "audioInfo",
    cb: (sr: number, ch: number, codec: string) => void
  ): void;
  on(event: string, cb: (...args: unknown[]) => void): void;
  start: (url: string) => void;
  stop: () => void;
  release: () => void;
}

const LiveVideo = ({ gType, winningCodes, gamePhase }: LiveVideoProps) => {
  const [hasVideoSrc, setHasVideoSrc] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [allWinningCodes, setAllWinningCodes] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [player, setPlayer] = useState<VigoPlayerInstance | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const urlVideo = `https://apiku999.apixoso.net/socket-url/${gType}`;
        const res = await axios.get(urlVideo, { timeout: 15000 });
        const url = res.data?.socketUrl || res.data;
        if (
          typeof url === "string" &&
          (url.startsWith("wss://") || url.startsWith("ws://"))
        ) {
          setWsUrl(url);
          setErr(null);
        } else {
          setErr("WS URL không hợp lệ từ token server");
        }
      } catch (e: any) {
        setErr("Không lấy được WS URL: " + (e || "unknown"));
      }
    })();
  }, [gType]);

  useEffect(() => {
    if (winningCodes && winningCodes.length > 0) {
      setAllWinningCodes([...winningCodes]);
    }
  }, [winningCodes]);

  useEffect(() => {
    setAllWinningCodes([]);
  }, [gType]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/VigoPlayer.min.js";
    script.async = true;

    script.onload = () => {
      if (!window.VigoPlayer) {
        console.error("❌ VigoPlayer not available");
        return;
      }

      // dùng VigoPlayer.load để đảm bảo NP đã init
      window.VigoPlayer.load(() => {
        console.log("✅ VigoPlayer ready");

        const Vigo = window.VigoPlayer;
        if (!Vigo) return;
        const playerInstance = new Vigo();

        // gắn view (canvas id)
        if (canvasRef.current) {
          playerInstance.setView(canvasRef.current.id);
        }

        // config thêm
        playerInstance.setScaleMode(0);
        playerInstance.setBufferTime(1000);
        playerInstance.skipLoopFilter(48);
        playerInstance.setKeepScreenOn();
        playerInstance.setTimeout(10);

        // events
        playerInstance.on("start", () => {
          setHasVideoSrc(false);
          console.log("Player started");
        });
        playerInstance.on("stop", () => {
          console.log("Player stopped");
        });
        playerInstance.on("error", (err: unknown) => {
          console.error("Player error:", err);
        });
        playerInstance.on(
          "videoInfo",
          (w: number, h: number, codec: string) => {
            console.log(`Video info: ${w}x${h}, codec=${codec}`);
          }
        );
        playerInstance.on(
          "audioInfo",
          (sr: number, ch: number, codec: string) => {
            console.log(
              `Audio info: samplerate=${sr}, channels=${ch}, codec=${codec}`
            );
          }
        );

        // Lưu player instance vào state
        setPlayer(playerInstance);
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (player && wsUrl) {
      console.log("Starting player with URL:", wsUrl);
      player.start(wsUrl);
      setErr(null);
    }
  }, [player, wsUrl]);

  // Cleanup player khi component unmount
  useEffect(() => {
    return () => {
      if (player) {
        player.stop();
        player.release();
      }
    };
  }, [player]);

  const zoom = Math.max(1, zoomPercent / 100);

  const getNumberImage = (code: string, position: number): string => {
    const digit = parseInt(code) % 10;
    const colorsByPosition = [
      "blue", // Position 0 (số đầu tiên)
      "green", // Position 1
      "blue", // Position 2
      "yellow", // Position 3
      "red", // Position 4 (số cuối cùng)
    ];
    const color = colorsByPosition[position] || "blue"; // Default blue nếu vượt quá

    // Format: blueL9.png cho vị trí đầu, color+digit.png cho các vị trí khác
    if (position === 0) {
      return `/images/lotto/${color}L${digit}.png`;
    } else {
      return `/images/lotto/${color}${digit}.png`;
    }
  };

  return (
    <div className="relative h-[220px] overflow-hidden">
      {hasVideoSrc && (
        <div
          id="divLiveLoading"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
        >
          <div className="text-center">
            <div className="w-[140px] h-[70px] mx-auto relative">
              <img
                className="absolute inset-0 m-auto w-[60%] h-[60%]"
                src="https://cuvnfa.gs6168.com/images/graph/common/logoLightLoading.png"
                alt="Loading"
              />
            </div>
            <div
              id="loadVideo_text"
              className="text-white text-shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_5px_#00ccff,0_0_5px_#00ccff,0_0_5px_#00ccff,0_0_10px_#00ccff] mt-[5px] text-[0.9em] text-center relative"
            >
              Đang tải video
            </div>
          </div>
        </div>
      )}

      {gamePhase === "waiting" && (
        <div className="absolute bottom-[0.85rem] right-[0.85rem] z-[200] flex gap-[1.6rem] flex-row-reverse">
          {allWinningCodes.map((code, index) => (
            <div
              key={`winning-${code}-${index}`}
              className="flex items-center justify-center"
            >
              <img
                src={getNumberImage(code, index)}
                alt={`Number ${code}`}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-white font-bold text-lg">${code}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}

      <canvas
        ref={canvasRef}
        id="video-canvas"
        width={640}
        height={360}
        style={{
          width: "100%",
          minHeight: "198px",
          background: "#000",
          imageRendering: "crisp-edges",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          transformOrigin: "center bottom",
          transform: `scale(${zoom})`,
          zIndex: 100,
          cursor: "pointer",
        }}
      />
      {err && (
        <div
          style={{
            marginTop: 8,
            padding: "8px 10px",
            background: "#111",
            color: "#fff",
            borderRadius: 6,
          }}
        >
          {err}
        </div>
      )}
    </div>
  );
};

export default LiveVideo;
