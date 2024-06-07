"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = __importDefault(require("@/controllers/taskController"));
const requiredValidators_1 = __importDefault(require("@/middlewares/validators/requiredValidators"));
const router = express_1.default.Router();
router
    .route("/")
    .post((0, requiredValidators_1.default)(["title", "body", "priority", "dueDate"]), taskController_1.default.createTask)
    .get(taskController_1.default.getAllTasks)
    .delete(taskController_1.default.deleteAllTask);
router
    .route("/:id")
    .get(taskController_1.default.getATask)
    .put((0, requiredValidators_1.default)(["title", "body", "priority", "dueDate"]), taskController_1.default.editTask)
    .delete(taskController_1.default.deleteTask);
router.patch("/:id/set-in-process", taskController_1.default.setInProcess);
router.patch("/:id/set-completed", taskController_1.default.setCompleted);
exports.default = router;
