import app from './app';
import { createRedisClient } from '@dental/core/redis';
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        // Initialize Redis
        const redis = createRedisClient();
        await redis.connect();
        console.log('✅ Redis connected');
        // Start Express server
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
