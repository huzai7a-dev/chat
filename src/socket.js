import { io } from "socket.io-client";
let socket = null;

export const init = (empId = 0) => {
    socket = io(`ws://localhost:3000/user-${empId}`);
    return socket;
}

export const getSocket = () => {
    return !socket ? init() : socket;
}