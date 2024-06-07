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
const logger_1 = __importDefault(require("@/utils/logger"));
const User_1 = __importDefault(require("@/models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        if (!Array.isArray(role) || !role.length)
            return (0, logger_1.default)(res, 400, { error: "All fields must be provided!" });
        const foundUser = yield User_1.default.findOne({ email }).select("-password");
        if (foundUser)
            return (0, logger_1.default)(res, 403, { error: "User with that email already exists" });
        const validRoles = [5501, 2219, 7689];
        const hasValidRoles = role.every((r) => validRoles.includes(r));
        const isAdmin = role.length === 3 &&
            role.includes(5501) &&
            role.includes(2219) &&
            role.includes(7689);
        const isStaff = role.length === 2 && role.includes(5501) && role.includes(2219);
        const isUser = role.length === 1 && role.includes(5501);
        if (hasValidRoles && (isAdmin || isStaff || isUser)) {
            return next();
        }
        else {
            return (0, logger_1.default)(res, 400, { error: "Invalid role" });
        }
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            message: err.message,
        });
    }
});
const loginValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return (0, logger_1.default)(res, 400, {
                error: "All fields must be provided",
            });
        const user = yield User_1.default.findOne({ email, deleted: false }).lean();
        if (!user)
            return (0, logger_1.default)(res, 400, {
                error: "Invalid credentials",
            });
        if (!(yield bcrypt_1.default.compare(password, user.password)))
            return (0, logger_1.default)(res, 400, { error: "Invalid credentials" });
        next();
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: err.message,
        });
    }
});
exports.default = {
    registerValidator,
    loginValidator,
};
