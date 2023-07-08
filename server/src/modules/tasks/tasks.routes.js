import express from "express";
const router = express.Router();
import * as taskController from "./controller/tasks.controller.js";

router
  .route("/")
  .post(taskController.addTask)
  .get(taskController.getTask)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

  export default router
