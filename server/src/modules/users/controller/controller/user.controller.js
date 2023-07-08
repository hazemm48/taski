import userModel from "../../../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMAil } from "../../../../services/sendMail.js";
import catchAsyncError from "../../../middleware/catchAsyncError.js";
import AppError from "../../../../utils/AppError.js";
import moment from "moment";
import taskModel from "../../../../../database/models/task.model.js";

const signUp = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  let check = await userModel.findOne({ email: all.email });
  if (check) {
    next(new AppError("already registered", 404));
  } else {
    let hashedPass = bcrypt.hashSync(all.password, Number(process.env.ROUNDS));
    all.password = hashedPass;
    sendMAil({ email: all.email, operation: "verify" });
    let added = await userModel.insertMany(all);
    res.status(200).json({ message: "user added", added });
  }
});

const signIn = catchAsyncError(async (req, res, next) => {
  let { email, password, rememberMe } = req.body;
  let check = await userModel.findOne({ email });
  if (check) {
    let matched = bcrypt.compareSync(password, check.password);
    if (matched) {
      if (check.confirmedEmail == true) {
        let token = "";
        let expiry = "";
        let tokenConfig = {
          userId: check._id,
          name: check.name,
          email: email,
          isLoggedIn: true,
        };
        if (rememberMe == true) {
          token = jwt.sign(tokenConfig, process.env.SECRET_KEY, {
            expiresIn: "6d",
          });
          expiry = moment().add(6, "d").format("YYYY-MM-DD HH:mm");
        } else {
          token = jwt.sign(tokenConfig, process.env.SECRET_KEY, {
            expiresIn: "1d",
          });
          expiry = moment().add(1, "d").format("YYYY-MM-DD HH:mm");
        }
        check.isLoggedIn = true;
        await check.save();
        check.password = "";
        res.json({
          message: "welcome",
          token,
          expiry,
          user: check,
        });
      } else {
        next(new AppError("Confirm your email first", 404));
      }
    } else {
      next(new AppError("wrong pssword", 404));
    }
  } else {
    next(new AppError("register first", 404));
  }
});

const getUser = catchAsyncError(async (req, res, next) => {
  let user = await userModel.findById(req.userId);
  user
    ? res.json({ message: "found", user })
    : next(new AppError("register first", 404));
});

const deleteUser = catchAsyncError(async (req, res, next) => {
  let user = await userModel.findByIdAndDelete(req.userId);
  let tasks = await taskModel.deleteMany({ createdBy: req.userId });
  user
    ? res.json({ message: "deleted" })
    : next(new AppError("user not found", 404));
});

const verify = catchAsyncError(async (req, res, next) => {
  let updated = await userModel.findOneAndUpdate(
    { email: req.email },
    { confirmedEmail: true },
    { new: true }
  );
  res.json({ message: "verified" });
});

const forgetPassword = catchAsyncError(async (req, res, next) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (user) {
    let resetCode = Math.floor(100000 + Math.random() * 900000);
    user.resetCode = resetCode;
    await user.save();
    sendMAil({ email: email, operation: "reset", code: resetCode });
    res.json({ message: "email sent" });
  } else {
    next(new AppError("email not registered", 404));
  }
});

const verifyResetcode = catchAsyncError(async (req, res, next) => {
  let email = req.body.email;
  let user = await userModel.findOne({ email });
  if (req.body.resetCode == user.resetCode && user.resetCode != "") {
    let token = jwt.sign(
      {
        email: email,
        oper: "reset",
      },
      process.env.SECRET_KEY
    );
    user.resetCode = " ";
    await user.save();
    res.json({ message: "Code correct", token });
  } else {
    next(new AppError("Wrong code", 404));
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  let email = req.email;
  let user = await userModel.findOne({ email });
  if (user) {
    let password = req.body.newPassword;
    if (bcrypt.compareSync(password, user.password)) {
      next(new AppError("Same old password"), 404);
    } else {
      let hashedPassword = bcrypt.hashSync(
        password,
        Number(process.env.ROUNDS)
      );
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "user updated" });
    }
  } else {
    next(new AppError("user not found"));
  }
});

const changePass = catchAsyncError(async (req, res, next) => {
  let { oldPass, newPass } = req.body;
  console.log();
  let check = await userModel.findById(req.userId);
  if (check) {
    let matched = bcrypt.compareSync(oldPass, check.password);
    if (matched) {
      let newPassword = bcrypt.hashSync(newPass, Number(process.env.ROUNDS));
      check.password = newPassword;
      await check.save();
      res.json({ message: "password changed" });
    } else {
      next(new AppError("wrong old password", 404));
    }
  } else {
    next(new AppError("user not found", 404));
  }
});

export {
  signUp,
  signIn,
  getUser,
  deleteUser,
  verify,
  forgetPassword,
  verifyResetcode,
  resetPassword,
  changePass,
};
