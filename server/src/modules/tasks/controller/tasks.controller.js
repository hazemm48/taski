import mongoose from "mongoose";
import taskModel from "../../../../database/models/task.model.js";
import userModel from "../../../../database/models/user.model.js";
import AppError from "../../../utils/AppError.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import moment from "moment";

const addTask = catchAsyncError(async (req, res, next) => {
  let body = req.body;
  let user = await userModel.findById(req.userId);
  if (user) {
    body.createdBy = req.userId;
    await taskModel.insertMany(body);
    res.json({ message: "task added" });
  } else {
    next(new AppError("user not found", 404));
  }
});

const getTask = catchAsyncError(async (req, res, next) => {
  let { sort, pageNo, limit, filter, month, year } = req.query;
  !filter && (filter = {});
  if (sort) {
    let obj = {};
    let arr = sort.split(":");
    obj[arr[0]] = arr[1] * 1;
    sort = obj;
  } else {
    sort = { createdAt: 1 };
  }
  pageNo = pageNo * 1;
  limit = limit * 1;

  (pageNo <= 0 || !pageNo) && (pageNo = 1);
  (limit <= 0 || !limit) && (limit = 0);

  let skipItems = (pageNo - 1) * limit;
  let aggr = [{ $skip: skipItems }];
  limit != 0 && aggr.push({ $limit: limit });

  filter.createdBy = mongoose.Types.ObjectId(req.userId);
  filter._id && (filter._id = mongoose.Types.ObjectId(filter._id));
  filter.title && (filter.title = { $regex: filter.title, $options: "i" });
  filter.month && (filter.month *= 1);
  filter.year && (filter.year *= 1);

  let arr = [
    {
      $match: {
        ...filter,
      },
    },
  ];
  if (filter.month) {
    arr.unshift({
      $addFields: {
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
      },
    });
  }
  let tasks = await taskModel.aggregate([
    ...arr,
    {
      $sort: sort,
    },
    {
      $facet: {
        totalTasks: [
          {
            $count: "total",
          },
        ],
        data: aggr,
      },
    },
  ]);

  tasks.length > 0
    ? res.json({
        message: "found",
        tasks: tasks[0].data,
        count: tasks[0].totalTasks[0]?.total,
      })
    : next(new AppError("task not found", 404));
});

const updateTask = catchAsyncError(async (req, res, next) => {
  let body = req.body;
  let updated = await taskModel.findOneAndUpdate(
    { _id: body.id, createdBy: req.userId },
    { ...body.data },
    { new: true }
  );
  if (updated) {
    res.json({ message: "updated", updated });
  } else {
    next(new AppError("task not found", 404));
  }
});

const deleteTask = catchAsyncError(async (req, res, next) => {
  let body = req.body;
  body.createdBy = req.userId;
  let task = await taskModel.findOne(body);
  if (task) {
    await task.remove();
    res.json({ message: "deleted" });
  } else {
    next(new AppError("task not found", 404));
  }
});

const timer = async (taskId, userId, time) => {
  try {
    let task = await taskModel.findOne({ _id: taskId, createdBy: userId });
    if (task) {
      let date = moment();
      let totalTime = moment(date, "YYYY/MM/DD HH:mm:ss").diff(
        moment(time, "YYYY/MM/DD HH:mm:ss")
      );
      !task.time?.totalMin && (task.time.totalMin = 0);
      task.time.totalMin += totalTime - (totalTime % 1000) - 1000;
      await task.save();
    }
  } catch (error) {
    console.log(error);
  }
};

export { addTask, getTask, deleteTask, updateTask, timer };
