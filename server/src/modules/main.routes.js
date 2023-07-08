import express from "express";
const router = express.Router();
import userRoutes from "./users/users.routes.js";
import taskRoutes from "./tasks/tasks.routes.js";
import { auth } from "./middleware/auth.js";

router.use("/user", userRoutes);
router.use("/task", auth, taskRoutes);

export default router;
