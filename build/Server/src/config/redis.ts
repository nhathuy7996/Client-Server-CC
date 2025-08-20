import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

export const createRedisAdapter = async () => {
    const pubClient = createClient({ 
        url: REDIS_URL,
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    return createAdapter(pubClient, subClient);
}; 