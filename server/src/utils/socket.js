import { timer } from "../modules/tasks/controller/tasks.controller.js";

export const socketFun = (io) => {
  io.on("connection", (socket) => {
    let interval = setInterval(() => {
      socket.emit("wakeUp", "wakeUp");
    }, 1000);
    socket.on("disconnect", () => {
      let { _id, userId, time } = socket.request._query;
      clearInterval(interval);
      timer(_id, userId, time);
    });
  });
};
