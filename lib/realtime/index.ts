// ============================================================
// RESQFOOD Real-Time Event System
// Supports multi-tab BroadcastChannel, EventTarget & Realtime Sync
// ============================================================

export type RealtimeEventType =
  | "DONATION_CREATED"
  | "MATCH_FOUND"
  | "DRIVER_ASSIGNED"
  | "DRIVER_ACCEPTED"
  | "DRIVER_LOCATION_UPDATED"
  | "ARRIVED_PICKUP"
  | "PICKUP_CONFIRMED"
  | "ROUTE_UPDATED"
  | "DELIVERY_STARTED"
  | "DELIVERY_COMPLETED"
  | "RESCUE_CANCELLED"
  | "REMATCH_STARTED"
  | "CAPACITY_UPDATED";

export interface RealtimeMessage<T = any> {
  type: RealtimeEventType;
  payload: T;
  timestamp: string;
  senderRole?: string;
}

class RealtimeBroker {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<(msg: RealtimeMessage) => void>> = new Map();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel("resqfood_realtime_network");
        this.channel.onmessage = (event) => {
          this.handleIncoming(event.data);
        };
      } catch (err) {
        console.warn("BroadcastChannel not supported, falling back to local bus.");
      }
    }
  }

  public publish<T = any>(type: RealtimeEventType, payload: T, senderRole?: string) {
    const msg: RealtimeMessage<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      senderRole,
    };

    // Dispatch locally
    this.handleIncoming(msg);

    // Broadcast to other tabs/windows
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (err) {
        console.warn("Failed to post message on channel", err);
      }
    }
  }

  public subscribe(
    type: RealtimeEventType | "*",
    callback: (msg: RealtimeMessage) => void
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unbind function
    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  private handleIncoming(msg: RealtimeMessage) {
    // Exact type listeners
    const specific = this.listeners.get(msg.type);
    if (specific) {
      specific.forEach((cb) => {
        try {
          cb(msg);
        } catch (e) {
          console.error("Realtime listener error:", e);
        }
      });
    }

    // Wildcard listeners
    const wildcard = this.listeners.get("*");
    if (wildcard) {
      wildcard.forEach((cb) => {
        try {
          cb(msg);
        } catch (e) {
          console.error("Realtime wildcard listener error:", e);
        }
      });
    }
  }
}

// Global Singleton instance for client runtime
export const realtime = new RealtimeBroker();
