import { synchronize } from '../edge-functions/sync/service';
describe('Sync Service', () => {
    it('should synchronize calendar successfully', async () => {
        const data = {
            type: 'calendar',
            options: {
                syncDirection: 'two-way',
                syncInterval: 15,
            },
        };
        const options = {};
        const result = await synchronize(data, options);
        expect(result.success).toBe(true);
        expect(result.syncId).toBeDefined();
    });
    it('should synchronize contacts successfully', async () => {
        const data = {
            type: 'contacts',
            options: {
                syncDirection: 'one-way',
                syncInterval: 60,
            },
        };
        const options = {};
        const result = await synchronize(data, options);
        expect(result.success).toBe(true);
        expect(result.syncId).toBeDefined();
    });
    it('should handle an unsupported sync type', async () => {
        const data = {
            type: 'invalid',
            options: {
                syncDirection: 'two-way',
                syncInterval: 15,
            },
        };
        const options = {};
        const result = await synchronize(data, options);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error?.code).toBe('UNSUPPORTED_SYNC_TYPE');
    });
    it('should handle calendar sync errors', async () => {
        const data = {
            type: 'calendar',
            options: {
                syncDirection: 'two-way',
                syncInterval: 15,
                timeZone: 'invalid-timezone'
            },
        };
        const options = {};
        const result = await synchronize(data, options);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error?.code).toBe('CALENDAR_SYNC_FAILED');
    });
});
