import { synchronize } from '../edge-functions/sync/service';
import { SyncData, SyncOptions } from '../edge-functions/sync/types';

describe('Sync Service', () => {
  it('should synchronize calendar successfully', async () => {
    const data: SyncData = {
      type: 'calendar',
      options: {
        syncDirection: 'two-way',
        syncInterval: 15,
      },
    };
    const options: SyncOptions = {};
    const result = await synchronize(data, options);
    expect(result.success).toBe(true);
    expect(result.syncId).toBeDefined();
  });

  it('should synchronize contacts successfully', async () => {
    const data: SyncData = {
      type: 'contacts',
      options: {
        syncDirection: 'one-way',
        syncInterval: 60,
      },
    };
    const options: SyncOptions = {};
    const result = await synchronize(data, options);
    expect(result.success).toBe(true);
    expect(result.syncId).toBeDefined();
  });

  it('should handle an unsupported sync type', async () => {
    const data: SyncData = {
      type: 'invalid' as any,
      options: {
        syncDirection: 'two-way',
        syncInterval: 15,
      },
    };
    const options: SyncOptions = {};
    const result = await synchronize(data, options);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('UNSUPPORTED_SYNC_TYPE');
  });

  it('should handle calendar sync errors', async () => {
    const data: SyncData = {
      type: 'calendar',
      options: {
        syncDirection: 'two-way',
        syncInterval: 15,
        timeZone: 'invalid-timezone'
      },
    };
    const options: SyncOptions = {};
    const result = await synchronize(data, options);
     expect(result.success).toBe(false);
     expect(result.error).toBeDefined();
     expect(result.error?.code).toBe('CALENDAR_SYNC_FAILED');
  });
});