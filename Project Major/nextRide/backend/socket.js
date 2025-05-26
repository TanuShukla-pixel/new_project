import socketIO from "socket.io";
import {User} from "./models/user.model.js";
import {Captain} from "./models/captain.model.js";

let io;

export const initializeSocket = function(server){
    io = socketIO(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket)=>{
        console.log('Client connected', socket.id);
        socket.on('join', async (data)=>{
            const {userId, userType} = data;
            if(userType === 'user'){
                await User.findOneAndUpdate({_id: userId}, {socketId: socket.id})
            }
            else if(userType === 'captain'){
                await Captain.findByIdAndUpdate(userId, {socketId: socket.id})
            }
        });
        socket.on('update-captain-location', async (data)=>{
            const {userId, location} = data;
            if(!userId || !location || !location.lat || !location.lng){
                return socket.emit('error', {message: `Invalid ${userId ? 'location' : 'userId'} data`})
            }
            await Captain.findByIdAndUpdate(userId, {
                location: {
                    lng: location.lng,
                    lat: location.lat,
                }
            })
        });
        socket.on('disconnect', async function(){
            console.log('Client disconnected')
        })
    })
}

export const sendMessageToSocketId = function(socketId, messageObject){
    if(io){
        io.to(socketId).emit(messageObject.event, messageObject.data)
    }
    else{
        console.log(`Socket is not initialized yet`);
    }
}