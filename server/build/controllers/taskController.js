"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = __importDefault(require("@/models/Task"));
const User_1 = __importDefault(require("@/models/User"));
const logger_1 = __importDefault(require("@/utils/logger"));
/**
 * @desc Create a new Task
 * @route POST /task
 * @access protected
 */
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, body, priority, dueDate } = req.body;
        const user = yield User_1.default.findOne({ email: req.user["email"] });
        if (!user)
            return (0, logger_1.default)(res, 401, { error: "Unauthorized" });
        const task = yield Task_1.default.create({
            user: user._id,
            title,
            body,
            priority,
            dueDate,
        });
        return (0, logger_1.default)(res, 201, {
            message: "Task created successfully",
            task,
        });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal server error",
            details: err.message,
        });
    }
});
/**
 * @desc Get a task
 * @route POST /task/:id
 * @access protected
 */
const getATask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findOne({ email: req.user["email"] });
        const task = yield Task_1.default.findOne({
            _id: id,
            user: user === null || user === void 0 ? void 0 : user._id,
            deleted: false,
        });
        if (!task)
            return (0, logger_1.default)(res, 404, { error: "Task not found" });
        return (0, logger_1.default)(res, 200, { message: "Task fetched successfully", task });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal server error",
            details: err.message,
        });
    }
});
/**
 * @desc Get all tasks
 * @route GET /tasks
 * @access protected
 */
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email: req.user["email"] });
        const task = yield Task_1.default.find({ user: user === null || user === void 0 ? void 0 : user.id, deleted: false }).lean();
        if (!task.length)
            return (0, logger_1.default)(res, 200, { meesage: "No tasks" });
        return (0, logger_1.default)(res, 200, task);
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal server error",
            details: err.message,
        });
    }
});
/**
 * @desc Edit a Task
 * @route PUT /task
 * @access protected
 */
const editTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, body, priority, dueDate } = req.body;
        const user = yield User_1.default.findOne({ email: req.user["email"] });
        const task = yield Task_1.default.findOne({
            _id: id,
            user: user === null || user === void 0 ? void 0 : user._id,
            deleted: false,
        });
        if (!task)
            return (0, logger_1.default)(res, 404, { error: "Task not found" });
        if (title)
            task.title = title;
        if (body)
            task.body = body;
        if (priority)
            task.priority = priority;
        if (dueDate)
            task.dueDate = dueDate;
        yield task.save();
        return (0, logger_1.default)(res, 200, { message: "Task updated successfully", task });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal Server error",
            details: err.message,
        });
    }
});
/**
 * @desc Delete a Task
 * @route Delete /task/:id
 * @access protected
 */
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findOne({ email: req.user["email"] });
        const task = yield Task_1.default.findOne({
            _id: id,
            user: user === null || user === void 0 ? void 0 : user._id,
            deleted: false,
        });
        if (!task)
            return (0, logger_1.default)(res, 404, { error: "Task not found" });
        task.deleted = true;
        yield task.save();
        return (0, logger_1.default)(res, 200, { message: "Task deleted successfully", task });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal Server error",
            details: err.message,
        });
    }
});
const deleteAllTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email: req.user["email"] });
        const tasks = yield Task_1.default.updateMany({ user: user === null || user === void 0 ? void 0 : user.id }, { $set: { deleted: true } });
        return (0, logger_1.default)(res, 200, { message: "All tasks deleted successfully" });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal Server error",
            details: err.message,
        });
    }
});
/**
 * @desc Set task to completed
 * @route PATCH /task/:id/set-completed
 * @access protected
 */
const setCompleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findOne({ email: req.user["email"] });
        const task = yield Task_1.default.findOne({ _id: id, user: user === null || user === void 0 ? void 0 : user._id });
        if (!task)
            return (0, logger_1.default)(res, 404, { error: "Task not found" });
        task.completed = !task.completed;
        yield task.save();
        return (0, logger_1.default)(res, 200, {
            message: `Task COMPLETED set to ${task.completed}`,
            task,
        });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal Server error",
            details: err.message,
        });
    }
});
/**
 * @desc Set task to in-process
 * @route POST /task/:id/set-in-process
 * @access protected
 */
const setInProcess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findOne({ email: req.user["email"] });
        const task = yield Task_1.default.findOne({ _id: id, user: user === null || user === void 0 ? void 0 : user._id });
        if (!task)
            return (0, logger_1.default)(res, 404, { error: "Task not found" });
        task.inProcess = !task.inProcess;
        yield task.save();
        return (0, logger_1.default)(res, res.statusCode, {
            message: `Task IN-PROCESS set to ${task.inProcess}`,
            task,
        });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal Server error",
            details: err.message,
        });
    }
});
exports.default = {
    createTask,
    getATask,
    getAllTasks,
    deleteTask,
    deleteAllTask,
    setCompleted,
    setInProcess,
    editTask,
};
