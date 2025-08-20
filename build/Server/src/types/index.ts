import { Socket } from 'socket.io';


export interface LevelPassRequest {
    level: number;
    coin: number;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface AuthenticatedSocket extends Socket {
    userId?: string;
    username?: string;
}

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    start_param?: string;
}

export interface TelegramAuthData {
    query_id: string;
    user: TelegramUser;
    auth_date: number;
    hash: string;
} 

export interface UserDB {
    userId: string;
    name: string;
    coin: number;
    level: number;
    createdAt: string;
    lastLogin: string;
    energy: number;
}

export interface FarmDB {
    userId: string;
    slots: SlotDB[];

}

export interface SlotDB {
    planId: number;
    seedAt: string;
    isWatered: boolean;
    isWormed: boolean;
    weedAt: string;
}