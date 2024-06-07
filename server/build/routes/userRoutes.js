"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("@/controllers/userController"));
const userValidators_1 = __importDefault(require("@/middlewares/validators/userValidators"));
const requiredValidators_1 = __importDefault(require("@/middlewares/validators/requiredValidators"));
const router = express_1.default.Router();
router.post("/register", [
    (0, requiredValidators_1.default)(["firstName", "lastName", "email", "password", "role"]),
    userValidators_1.default.registerValidator,
], userController_1.default.register);
router.post("/login", [(0, requiredValidators_1.default)(["email", "password"]), userValidators_1.default.loginValidator], userController_1.default.login);
router.post("/logout", userController_1.default.logout);
router.get("/refresh", userController_1.default.refresh);
router.post("/forgot-password", [(0, requiredValidators_1.default)(["email"])], userController_1.default.forgotPassword);
router.patch("/reset-password", [(0, requiredValidators_1.default)(["token", "password"])], userController_1.default.resetPassword);
exports.default = router;
