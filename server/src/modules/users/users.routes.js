import express from "express";
const router = express.Router();
import * as userController from "./controller/controller/user.controller.js";
import { auth, emailAuth, verifyCodeAuth } from "../middleware/auth.js";
import validation from '../middleware/validation.js'
import * as validSchema from "../middleware/user.validation.js"


router.post("/signUp",validation(validSchema.signUpSchema), userController.signUp);
router.post("/signIn",validation(validSchema.signInSchema), userController.signIn);
router.get("/getUser", auth, userController.getUser);
router.delete("/deleteUser", auth, userController.deleteUser);
router.get("/verify/:email", emailAuth, userController.verify);
router.post("/changePass/", auth, userController.changePass);
router.post("/forgetPass/", userController.forgetPassword);
router.post("/verifyResetCode/", userController.verifyResetcode);
router.post("/resetPass/", verifyCodeAuth, userController.resetPassword);

export default router;
