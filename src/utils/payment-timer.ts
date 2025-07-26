/**
 * Payment timer utility for handling timeouts
 */
export class PaymentTimer {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private activeTimer: NodeJS.Timeout | null = null;

  /**
   * Start a timer with callback
   */
  public startTimer(
    duration: number,
    callback: () => void,
    timerId?: string
  ): void {
    const timer = setTimeout(() => {
      if (timerId) {
        this.timers.delete(timerId);
      }
      this.activeTimer = null;
      callback();
    }, duration);

    if (timerId) {
      // Clear existing timer with same ID
      this.clearTimer(timerId);
      this.timers.set(timerId, timer);
    } else {
      // Clear active timer
      this.clearTimer();
      this.activeTimer = timer;
    }
  }

  /**
   * Clear a specific timer or the active timer
   */
  public clearTimer(timerId?: string): void {
    if (timerId) {
      const timer = this.timers.get(timerId);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(timerId);
      }
    } else {
      if (this.activeTimer) {
        clearTimeout(this.activeTimer);
        this.activeTimer = null;
      }
    }
  }

  /**
   * Clear all timers
   */
  public clearAllTimers(): void {
    // Clear active timer
    if (this.activeTimer) {
      clearTimeout(this.activeTimer);
      this.activeTimer = null;
    }

    // Clear all named timers
    this.timers.forEach((timer) => {
      clearTimeout(timer);
    });
    this.timers.clear();
  }

  /**
   * Check if a timer is active
   */
  public hasActiveTimer(timerId?: string): boolean {
    if (timerId) {
      return this.timers.has(timerId);
    }
    return this.activeTimer !== null;
  }

  /**
   * Get remaining time for a timer (approximate)
   */
  public getRemainingTime(_timerId?: string): number | null {
    // Note: JavaScript doesn't provide built-in way to get remaining time
    // This would need to be tracked separately if needed
    return null;
  }

  /**
   * Start a recurring timer
   */
  public startInterval(
    duration: number,
    callback: () => void,
    timerId?: string
  ): void {
    const timer = setInterval(callback, duration);

    if (timerId) {
      this.clearTimer(timerId);
      this.timers.set(timerId, timer);
    } else {
      this.clearTimer();
      this.activeTimer = timer;
    }
  }

  /**
   * Destroy the timer instance
   */
  public destroy(): void {
    this.clearAllTimers();
  }
}
