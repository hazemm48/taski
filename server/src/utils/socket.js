import { timer } from "../modules/tasks/controller/tasks.controller.js";

export const socketFun = (io) => {
  let arr = [];
  io.on("connection", (socket) => {
    let { _id, userId, time } = socket.request._query;
    let interval = "";
    if (arr.find((e) => e == userId)) {
      socket.emit("tracking", "true");
      socket.disconnect();
    } else {
      arr.push(userId);
      socket.emit("tracking", "false");
      interval = setInterval(() => {
        socket.emit("wakeUp", "wakeUp");
      }, 1000);
    }
    socket.on("disconnect", () => {
      arr.splice(arr.indexOf(userId), 1);
      clearInterval(interval);
      timer(_id, userId, time);
    });
  });
};
