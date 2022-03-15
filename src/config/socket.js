import { io } from "socket.io-client";
let socket = null;

export const init = (empId = 0) => {
    socket = io(`/user-${empId}`, { transports: ['websocket', 'polling'] });
    return socket;
}

export const getSocket = (empId = 0) => {
    return !socket ? init(empId) : socket;
}

export const removeSocket = () => {
    if(socket) {
        socket.disconnect();
    }
    socket = null;
}