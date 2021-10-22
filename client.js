import { io } from "socket.io";

const socket = io("ws://10.3.142.111:3000", {});
socket.on("message", (message) => {
  console.log(message);
});

socket.on("connect", () => {
  socket.emit("message", "mute:1");
});