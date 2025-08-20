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
    try {
       
        const token = socket.handshake.auth.token;
        console.log(`Socket authentication token: ${token}`);
        
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        const decoded = utils.tokenDecode(token);
        socket.data.user = decoded;
        next();
    } catch (error) {
        next(new Error('Authentication error: Invalid token'));
    }
};