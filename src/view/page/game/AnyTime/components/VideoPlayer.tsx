"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

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

export default function VideoPlayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [player, setPlayer] = useState<VigoPlayerInstance | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const urlVideo = `https://ku-xs-socket.demogiaothong.com/api/game/socket-url/162`;
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
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e) || "unknown";
        setErr("Không lấy được WS URL: " + message);
      }
    })();
  }, []);
  console.log("wsUrl", wsUrl);

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
          console.log("Player started");
        });
        playerInstance.on("stop", () => {
          console.log("Player stopped");
        });
        playerInstance.on("error", (err: unknown) => {
          console.error("Player error:", err);
        });
        playerInstance.on("videoInfo", (w: number, h: number, codec: string) => {
          console.log(`Video info: ${w}x${h}, codec=${codec}`);
        });
        playerInstance.on("audioInfo", (sr: number, ch: number, codec: string) => {
          console.log(
            `Audio info: samplerate=${sr}, channels=${ch}, codec=${codec}`
          );
        });

        // Lưu player instance vào state
        setPlayer(playerInstance);
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // useEffect riêng để start player khi cả wsUrl và player đều sẵn sàng
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

  return (
    <div style={{ textAlign: "center" }}>
      {err && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          Error: {err}
        </div>
      )}
      <canvas
        ref={canvasRef}
        id="video-canvas"
        width={640}
        height={360}
        style={{ background: "#000" }}
      />
    </div>
  );
}
