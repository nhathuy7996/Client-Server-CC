import { Request, Response, NextFunction } from 'express';
import { utils } from '../utils';
import { Socket } from 'socket.io';

export const authAPIToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        const decoded = utils.tokenDecode(token);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }
}; 

export const authSocketToken = (socket: Socket, next: (err?: Error) => void) => {
    console.log('🔐 Socket authentication middleware triggered for socket:', socket.id);
    
    try {
        const token = socket.handshake.auth.token;
        console.log(`🔑 Socket authentication token: ${token ? 'Present' : 'Missing'}`);
        
        // Temporarily allow connections without token for debugging
        if (!token) {
            console.log('⚠️ No token provided, but allowing connection for debugging');
            socket.data.user = { id: 'anonymous', username: 'anonymous' };
            next();
            return;
        }

        const decoded = utils.tokenDecode(token);
        socket.data.user = decoded;
        console.log('✅ Socket authenticated successfully for user:', decoded);
        next();
    } catch (error) {
        console.error('❌ Socket authentication error:', error);
        // Temporarily allow connection even with invalid token for debugging
        console.log('⚠️ Invalid token, but allowing connection for debugging');
        socket.data.user = { id: 'anonymous', username: 'anonymous' };
        next();
    }
};