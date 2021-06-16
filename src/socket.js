import { io } from "socket.io-client";
let socket = null;

export const init = (empId = 0) => {
    socket = io(`/user-${empId}`, { transports: ['websocket', 'polling'] });
    return socket;
}

export const getSocket = () => {
    return !socket ? init() : socket;
}