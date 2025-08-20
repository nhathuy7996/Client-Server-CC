import { AuthenticatedSocket, UserDB } from '../types';

/*
* Handle when user connect and disconnect to server
*/
export var usersOnline: any[] = [];
export const handleSocketConnection = async(socket: AuthenticatedSocket) => {
     

    console.log(`User connected: ${socket.id}`);

    socket.broadcast.emit('user_connected', {
        user: socket.id
    });


    socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.id})`); 
    });
}; 