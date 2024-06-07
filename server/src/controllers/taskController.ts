import Task from "@/models/Task";
import User from "@/models/User";
import express from "express";
import logger from "@/utils/logger";

/**
 * @desc Create a new Task
 * @route POST /task
 * @access protected
 */
const createTask = async (req: any, res: any) => {
  try {
    const { title, body, priority, dueDate } = req.body;

    const user = await User.findOne({ email: req.user["email"] });
    if (!user) return logger(res, 401, { error: "Unauthorized" });

    const task = await Task.create({
      user: user._id,
      title,
      body,
      priority,
      dueDate,
    });

    return logger(res, 201, {
      message: "Task created successfully",
      task,
    });
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal server error",
      details: err.message,
    });
  }
};

/**
 * @desc Get a task
 * @route POST /task/:id
 * @access protected
 */
const getATask = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ email: req.user["email"] });

    const task = await Task.findOne({
      _id: id,
      user: user?._id,
      deleted: false,
    });
    if (!task) return logger(res, 404, { error: "Task not found" });

    return logger(res, 200, { message: "Task fetched successfully", task });
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal server error",
      details: err.message,
    });
  }
};

/**
 * @desc Get all tasks
 * @route GET /tasks
 * @access protected
 */
const getAllTasks = async (req: any, res: any) => {
  try {
    const user = await User.findOne({ email: req.user["email"] });
    const task = await Task.find({ user: user?.id, deleted: false }).lean();

    if (!task.length) return logger(res, 200, { meesage: "No tasks" });

    return logger(res, 200, task);
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal server error",
      details: err.message,
    });
  }
};

/**
 * @desc Edit a Task
 * @route PUT /task
 * @access protected
 */
const editTask = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, body, priority, dueDate } = req.body;

    const user = await User.findOne({ email: req.user["email"] });
    const task = await Task.findOne({
      _id: id,
      user: user?._id,
      deleted: false,
    });
    if (!task) return logger(res, 404, { error: "Task not found" });

    if (title) task.title = title;
    if (body) task.body = body;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    await task.save();

    return logger(res, 200, { message: "Task updated successfully", task });
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal Server error",
      details: err.message,
    });
  }
};

/**
 * @desc Delete a Task
 * @route Delete /task/:id
 * @access protected
 */
const deleteTask = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ email: req.user["email"] });
    const task = await Task.findOne({
      _id: id,
      user: user?._id,
      deleted: false,
    });
    if (!task) return logger(res, 404, { error: "Task not found" });
    task.deleted = true;
    await task.save();

    return logger(res, 200, { message: "Task deleted successfully", task });
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal Server error",
      details: err.message,
    });
  }
};

const deleteAllTask = async (req: any, res: any) => {
  try {
    const user = await User.findOne({ email: req.user["email"] });
    const tasks = await Task.updateMany(
      { user: user?.id },
      { $set: { deleted: true } }
    );

    return logger(res, 200, { message: "All tasks deleted successfully" });
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal Server error",
      details: err.message,
    });
  }
};

/**
 * @desc Set task to completed
 * @route PATCH /task/:id/set-completed
 * @access protected
 */
const setCompleted = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ email: req.user["email"] });
    const task = await Task.findOne({ _id: id, user: user?._id });
    if (!task) return logger(res, 404, { error: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    return logger(res, 200, {
      message: `Task COMPLETED set to ${task.completed}`,
      task,
    });
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal Server error",
      details: err.message,
    });
  }
};

/**
 * @desc Set task to in-process
 * @route POST /task/:id/set-in-process
 * @access protected
 */
const setInProcess = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ email: req.user["email"] });
    const task = await Task.findOne({ _id: id, user: user?._id });
    if (!task) return logger(res, 404, { error: "Task not found" });

    task.inProcess = !task.inProcess;
    await task.save();

    return logger(res, res.statusCode, {
      message: `Task IN-PROCESS set to ${task.inProcess}`,
      task,
    });
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal Server error",
      details: err.message,
    });
  }
};

export default {
  createTask,
  getATask,
  getAllTasks,
  deleteTask,
  deleteAllTask,
  setCompleted,
  setInProcess,
  editTask,
};
