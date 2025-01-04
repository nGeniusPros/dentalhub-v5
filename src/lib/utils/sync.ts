import { RealtimeChannel } from '@supabase/supabase-js';
import supabase from '../supabase/client';

interface SyncOperation {
  table: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  data: any;
  timestamp: number;
}

class SyncManager {
  private syncQueue: SyncOperation[] = [];
  private isOnline: boolean = navigator.onLine;
  private channels: Map<string, RealtimeChannel> = new Map();

  constructor() {
    // Initialize online/offline listeners
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Load pending operations from localStorage
    this.loadSyncQueue();
  }

  private handleOnline = async () => {
    this.isOnline = true;
    console.log('Connection restored. Processing sync queue...');
    await this.processSyncQueue();
  };

  private handleOffline = () => {
    this.isOnline = false;
    console.log('Connection lost. Operations will be queued.');
  };

  private loadSyncQueue() {
    const savedQueue = localStorage.getItem('syncQueue');
    if (savedQueue) {
      this.syncQueue = JSON.parse(savedQueue);
    }
  }

  private saveSyncQueue() {
    localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
  }

  async addOperation(operation: SyncOperation) {
    if (this.isOnline) {
      // If online, try to perform the operation immediately
      try {
        await this.performOperation(operation);
      } catch (error) {
        console.error('Error performing operation:', error);
        this.queueOperation(operation);
      }
    } else {
      // If offline, queue the operation
      this.queueOperation(operation);
    }
  }

  private queueOperation(operation: SyncOperation) {
    this.syncQueue.push(operation);
    this.saveSyncQueue();
  }

  private async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    const operations = [...this.syncQueue];
    this.syncQueue = [];
    this.saveSyncQueue();

    for (const operation of operations) {
      try {
        await this.performOperation(operation);
      } catch (error) {
        console.error('Error processing operation:', error);
        // Re-queue failed operations
        this.queueOperation(operation);
      }
    }
  }

  private async performOperation(operation: SyncOperation) {
    const { table, type, data } = operation;

    switch (type) {
      case 'INSERT':
        await supabase.from(table).insert(data);
        break;
      case 'UPDATE':
        await supabase
          .from(table)
          .update(data)
          .match({ id: data.id });
        break;
      case 'DELETE':
        await supabase
          .from(table)
          .delete()
          .match({ id: data.id });
        break;
    }
  }

  subscribeToTable(table: string, callback: (payload: any) => void) {
    if (this.channels.has(table)) {
      return;
    }

    const channel = supabase.channel(`sync_${table}`);
    
    channel.on('postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => {
        // Handle optimistic updates
        callback(payload);
      }
    ).subscribe();

    this.channels.set(table, channel);
  }

  unsubscribeFromTable(table: string) {
    const channel = this.channels.get(table);
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(table);
    }
  }

  // Clean up method
  destroy() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    // Unsubscribe from all channels
    this.channels.forEach(channel => channel.unsubscribe());
    this.channels.clear();
  }
}

// Export singleton instance
export const syncManager = new SyncManager();