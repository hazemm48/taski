import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    status: {
      type: String,
      enums: ["pending", "in progress", "done"],
      default: "pending",
    },
    priority: String,
    description: String,
    time: {
      start: Date,
      end: Date,
      totalMin: Number,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
