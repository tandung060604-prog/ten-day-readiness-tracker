import type { GameEventMap } from './types'

type EventKey = keyof GameEventMap
type EventHandler<K extends EventKey> = (payload: GameEventMap[K]) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandler = (payload: any) => void

export class GameEventBus {
  private listeners = new Map<EventKey, Set<AnyHandler>>()

  /**
   * Subscribe to an event
   */
  public on<K extends EventKey>(event: K, handler: EventHandler<K>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    const set = this.listeners.get(event)!
    set.add(handler as AnyHandler)

    return () => this.off(event, handler)
  }

  /**
   * Subscribe to an event for one occurrence only
   */
  public once<K extends EventKey>(event: K, handler: EventHandler<K>): () => void {
    const unsubscribe = this.on(event, ((payload: GameEventMap[K]) => {
      unsubscribe()
      handler(payload)
    }) as EventHandler<K>)
    return unsubscribe
  }

  /**
   * Unsubscribe a handler from an event
   */
  public off<K extends EventKey>(event: K, handler: EventHandler<K>): void {
    const set = this.listeners.get(event)
    if (set) {
      set.delete(handler as AnyHandler)
      if (set.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * Dispatch an event to all registered listeners
   */
  public emit<K extends EventKey>(event: K, payload: GameEventMap[K]): void {
    const set = this.listeners.get(event)
    if (set) {
      set.forEach((handler) => {
        try {
          handler(payload)
        } catch (error) {
          console.error(`[GameEventBus] Error in handler for event "${event}":`, error)
        }
      })
    }
  }

  /**
   * Clear all registered listeners (primarily for testing and clean teardown)
   */
  public clearAll(): void {
    this.listeners.clear()
  }
}

// Global Singleton Instance
export const gameEvents = new GameEventBus()
