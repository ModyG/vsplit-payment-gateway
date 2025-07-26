/**
 * Generic event emitter for payment gateway events
 */
export class EventEmitter<T extends Record<string, any>> {
  private listeners: Map<keyof T, Array<T[keyof T]>> = new Map();

  /**
   * Subscribe to an event
   */
  public on<K extends keyof T>(event: K, callback: T[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Unsubscribe from an event
   */
  public off<K extends keyof T>(event: K, callback: T[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event
   */
  public emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${String(event)}:`, error);
        }
      });
    }
  }

  /**
   * Subscribe to an event once
   */
  public once<K extends keyof T>(event: K, callback: T[K]): void {
    const onceCallback = ((...args: Parameters<T[K]>) => {
      callback(...args);
      this.off(event, onceCallback as T[K]);
    }) as T[K];

    this.on(event, onceCallback);
  }

  /**
   * Remove all listeners for a specific event
   */
  public removeAllListeners<K extends keyof T>(event?: K): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get listener count for an event
   */
  public listenerCount<K extends keyof T>(event: K): number {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? eventListeners.length : 0;
  }

  /**
   * Get all event names
   */
  public eventNames(): Array<keyof T> {
    return Array.from(this.listeners.keys());
  }
}
