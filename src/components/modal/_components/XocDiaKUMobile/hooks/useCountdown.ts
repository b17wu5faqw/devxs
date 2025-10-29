import { useEffect, useRef, useState, useCallback } from "react";
import { TimeLeft, GamePhase } from "../types";

export const useCountdown = (
  onComplete: () => void,
  resetTrigger: number,
  gamePhase: GamePhase
) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 25,
  });
  const [hasCompleted, setHasCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const restartCountdown = useCallback(() => {
    setTimeLeft({ hours: 0, minutes: 0, seconds: 25 });
    setHasCompleted(false);
  }, []);

  useEffect(() => {
    restartCountdown();
  }, [resetTrigger, restartCountdown]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (gamePhase === GamePhase.SHOWING_RESULT ||
      gamePhase === GamePhase.SHOW_RESULT) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.minutes * 60 + prev.seconds;

        if (totalSeconds > 1) {
          const newTotal = totalSeconds - 1;
          const minutes = Math.floor(newTotal / 60);
          const seconds = newTotal % 60;
          return { hours: 0, minutes, seconds };
        } else if (totalSeconds === 1) {
          return { hours: 0, minutes: 0, seconds: 0 };
        } else if (totalSeconds === 0 && !hasCompleted) {
          setHasCompleted(true);
          onComplete();
          return { hours: 0, minutes: 0, seconds: 0 };
        } else {
          return prev;
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onComplete, hasCompleted, gamePhase]);

  return timeLeft;
}; 