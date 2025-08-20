import jwt from 'jsonwebtoken';

export const utils = {

     getMinutesPassed : function (startAt: string) {
        const startDate = new Date(startAt);
        const currentDate = new Date();
        const diffInMilliseconds = currentDate.getTime() - startDate.getTime();
        return Math.floor(diffInMilliseconds / (1000 * 60)); // Chuyển đổi từ milliseconds sang phút
    },

    tokenDecode(token: string): any{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return decoded;
    },

    tokenEncode(data: any): string{
        const token = jwt.sign(data, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        return token;
    }

}