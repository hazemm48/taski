import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
import { connection } from "./database/connection.js";
import mainRoutes from "./src/modules/main.routes.js";
import globalError from "./src/modules/middleware/globalErrorHandler.js";
import AppError from "./src/utils/AppError.js";
import { Server } from "socket.io";
import { socketFun } from "./src/utils/socket.js";

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connection();
app.use("/api/v1", mainRoutes);
app.use("*", (req, res, next) => {
  next(new AppError(`invalid URL ${req.originalUrl}`, 404));
});
app.use(globalError);
app.get("/", (req, res) => res.send("running"));

const server = app.listen(3000, () => console.log("listening"));

const io = new Server(server, {
  cors: "*",
});

socketFun(io);
