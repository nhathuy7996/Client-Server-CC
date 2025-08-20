import { AuthenticatedSocket } from '../types';
import { UserDB } from '../types';
import { Server } from 'socket.io';
import { sendDiscordNotification } from '../discordConnector';
import { sendMessage } from '../teleConnector';

export var Rooms: {roomID: string, userDatas: UserDB[],  coin: number}[] = [];
export const handleGamePlayEvents = (socket: AuthenticatedSocket, io: Server) => {

    socket.on('private_message', async (data: { friendSocketID: string, friendID: string, coin: number }) => {
        try {
           

            let roomID = `Battle_${socket.data.user.id}`;
            io.socketsLeave(roomID);
            socket.join(roomID);

            io.to(data.friendSocketID).emit('invite_dual', {
                success: true,
                data: {
                    friendID: socket.data.user.id,
                    roomID: roomID,
                    name: socket.data.user.name,
                    coin: data.coin
                }
            });
            sendMessage(data.friendID, `${socket.data.user.name} đã mời bạn vào phòng! ⚔ ☠️`);

        } catch (error) {
            console.error('Error invite friend:', error);
        }
    });

}; 