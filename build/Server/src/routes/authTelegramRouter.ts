import express from 'express';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { URLSearchParams } from 'url';
import { utils } from '../utils';

const router = express.Router();

// Verify Telegram Web App Data
function verifyTelegramWebAppData(initData: string): boolean {
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');

        // Sort parameters alphabetically
        const sortedParams = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        // Create secret key
        const secret = crypto.createHmac('sha256', 'WebAppData')
            .update(process.env.TELEGRAM_BOT_TOKEN || '')
            .digest();

        // Calculate hash
        const calculatedHash = crypto.createHmac('sha256', secret)
            .update(sortedParams)
            .digest('hex');

        return calculatedHash === hash;

    } catch (error) {
        console.error('Error verifying Telegram data:', error);
        return false;
    }
}

// Telegram authentication endpoint then create token
router.post('/telegram', async (req: Request, res: Response) => {
    try {
        const { initData } = req.body;

        if (!initData) {
            return res.status(400).json({
                success: false,
                message: 'Init data is required'
            });
        }
       
        // Verify the init data
        if (!verifyTelegramWebAppData(initData)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid init data'
            });
        }

        //Get user data from DB to generate token
        const userData = {
            userId: "123",
            name: "John Doe",
            first_name: "John",
            last_name: "Doe"
        }
        
        // Generate JWT token
        const token = utils.tokenEncode( userData);

        // Return success with token and user data
        res.json({
            success: true,
            message: 'Authentication successful',
            data: {
                token,
                user: userData
            }
        });

    } catch (error) {
        console.error('Error in Telegram authentication:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
});


export default router; 