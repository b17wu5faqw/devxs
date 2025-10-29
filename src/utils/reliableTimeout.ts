// Reliable timeout utility that works even when page is throttled
export class ReliableTimeout {
  private static instance: ReliableTimeout;
  private timeouts: Map<string, {
    callback: () => void;
    startTime: number;
    delay: number;
    fired: boolean;
    intervalId?: NodeJS.Timeout;
    timeoutId?: NodeJS.Timeout;
  }> = new Map();

  static getInstance(): ReliableTimeout {
    if (!ReliableTimeout.instance) {
      ReliableTimeout.instance = new ReliableTimeout();
    }
    return ReliableTimeout.instance;
  }

  // Set a reliable timeout that uses multiple fallback mechanisms
  setTimeout(callback: () => void, delay: number, id?: string): string {
    const timeoutId = id || `timeout_${Date.now()}_${Math.random()}`;
    const startTime = Date.now();

    // Clear existing timeout with same ID
    if (this.timeouts.has(timeoutId)) {
      this.clearTimeout(timeoutId);
    }

    const timeoutData = {
      callback,
      startTime,
      delay,
      fired: false,
      intervalId: undefined as NodeJS.Timeout | undefined,
      timeoutId: undefined as NodeJS.Timeout | undefined,
    };

    // Method 1: Standard setTimeout
    timeoutData.timeoutId = setTimeout(() => {
      this.fireTimeout(timeoutId);
    }, delay);

    // Method 2: setInterval fallback (checks every 100ms)
    timeoutData.intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= delay && !timeoutData.fired) {
        this.fireTimeout(timeoutId);
      }
    }, 100);

    this.timeouts.set(timeoutId, timeoutData);

    // Method 3: requestAnimationFrame fallback
    const rafCheck = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= delay && !timeoutData.fired) {
        this.fireTimeout(timeoutId);
      } else if (!timeoutData.fired) {
        requestAnimationFrame(rafCheck);
      }
    };
    requestAnimationFrame(rafCheck);

    return timeoutId;
  }

  // Fire the timeout callback
  private fireTimeout(id: string): void {
    const timeoutData = this.timeouts.get(id);
    if (!timeoutData || timeoutData.fired) {
      return;
    }

    timeoutData.fired = true;
    const actualDelay = Date.now() - timeoutData.startTime;

    // Clear all associated timers
    if (timeoutData.timeoutId) {
      clearTimeout(timeoutData.timeoutId);
    }
    if (timeoutData.intervalId) {
      clearInterval(timeoutData.intervalId);
    }

    // Remove from map
    this.timeouts.delete(id);

    // Execute callback
    try {
      timeoutData.callback();
    } catch (error) {
      console.error(`🕐 [RELIABLE-TIMEOUT] Error in timeout callback ${id}:`, error);
    }
  }

  // Clear a timeout
  clearTimeout(id: string): void {
    const timeoutData = this.timeouts.get(id);
    if (!timeoutData) {
      return;
    }
    if (timeoutData.timeoutId) {
      clearTimeout(timeoutData.timeoutId);
    }
    if (timeoutData.intervalId) {
      clearInterval(timeoutData.intervalId);
    }

    this.timeouts.delete(id);
  }

  // Clear all timeouts
  clearAll(): void {
    this.timeouts.forEach((_, id) => {
      this.clearTimeout(id);
    });
  }

  // Get status of all timeouts
  getStatus(): Array<{
    id: string;
    elapsed: number;
    delay: number;
    fired: boolean;
    remaining: number;
  }> {
    const now = Date.now();
    return Array.from(this.timeouts.entries()).map(([id, data]) => ({
      id,
      elapsed: now - data.startTime,
      delay: data.delay,
      fired: data.fired,
      remaining: Math.max(0, data.delay - (now - data.startTime)),
    }));
  }
}

// Global instance
export const reliableTimeout = ReliableTimeout.getInstance();

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).reliableTimeout = reliableTimeout;
}
