import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

interface SyncOperation {
  table: string;
  type: "INSERT" | "UPDATE" | "DELETE";
  data: any;
  timestamp: number;
}

class SyncManager {
  private syncQueue: SyncOperation[] = [];
  private isOnline: boolean = navigator.onLine;
  private channels: Map<string, RealtimeChannel> = new Map();

  constructor() {
    // Initialize online/offline listeners
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);

    // Load pending operations from localStorage
    this.loadPendingOperations();
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.processPendingOperations();
  };

  private handleOffline = () => {
    this.isOnline = false;
  };

  private loadPendingOperations() {
    const pendingOps = localStorage.getItem("syncQueue");
    if (pendingOps) {
      this.syncQueue = JSON.parse(pendingOps);
    }
  }

  private savePendingOperations() {
    localStorage.setItem("syncQueue", JSON.stringify(this.syncQueue));
  }

  private async processPendingOperations() {
    while (this.isOnline && this.syncQueue.length > 0) {
      const operation = this.syncQueue[0];
      try {
        await this.executeOperation(operation);
        this.syncQueue.shift();
        this.savePendingOperations();
      } catch (error) {
        console.error("Failed to process operation:", error);
        break;
      }
    }
  }

  private async executeOperation(operation: SyncOperation) {
    const { table, type, data } = operation;

    switch (type) {
      case "INSERT":
        await supabase.from(table).insert(data);
        break;
      case "UPDATE":
        await supabase.from(table).update(data).eq("id", data.id);
        break;
      case "DELETE":
        await supabase.from(table).delete().eq("id", data.id);
        break;
    }
  }

  public subscribeToTable(tableName: string, callback: (payload: any) => void) {
    if (this.channels.has(tableName)) {
      return;
    }

    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        callback,
      )
      .subscribe();

    this.channels.set(tableName, channel);
  }

  public unsubscribeFromTable(tableName: string) {
    const channel = this.channels.get(tableName);
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(tableName);
    }
  }

  public async queueOperation(operation: SyncOperation) {
    this.syncQueue.push(operation);
    this.savePendingOperations();

    if (this.isOnline) {
      await this.processPendingOperations();
    }
  }

  public cleanup() {
    window.removeEventListener("online", this.handleOnline);
    window.removeEventListener("offline", this.handleOffline);
    this.channels.forEach((channel) => channel.unsubscribe());
    this.channels.clear();
  }
}

// Export singleton instance
export const syncManager = new SyncManager();
