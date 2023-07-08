import { timer } from "../modules/tasks/controller/tasks.controller.js";

export const socketFun = (io) => {
  io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("disconnect", () => {
      let { _id, userId, time } = socket.request._query;
      console.log("disconnected");
      timer(_id, userId, time);
      socket.on("id", (data) => {
        console.log(data);
      });
    });
  });
};
