"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("@/routes/userRoutes"));
const taskRoutes_1 = __importDefault(require("@/routes/taskRoutes"));
const authGuard_1 = __importDefault(require("@/middlewares/authGuard"));
const router = express_1.default.Router();
router.use("/user", userRoutes_1.default);
router.use("/task", authGuard_1.default, taskRoutes_1.default);
exports.default = router;
