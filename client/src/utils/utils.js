import { io } from "socket.io-client";
export const socket = io("http://localhost:5000");

export const sendMessageFn = (message) => {
  try {
    socket.emit("send_message", {
      senderId: "9487908498020",
      recipientId: "68531aafde77e688d6669953",
      content: message,
    });
  } catch (error) {
    console.log(error)
  }
};
