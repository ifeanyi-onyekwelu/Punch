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
const User_1 = __importDefault(require("@/models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("@/utils/logger"));
const generator_1 = __importDefault(require("@/utils/generator"));
const Token_1 = __importDefault(require("@/models/Token"));
/**
 * @desc Register a user
 * @route POST /auth/register
 * @access Public
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const user = yield User_1.default.create({
            firstName,
            lastName,
            email,
            password,
            referralCode: generator_1.default.generateReferralCode(),
            referralLink: generator_1.default.generateReferralLink(),
            role,
        });
        const accessToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                email: user === null || user === void 0 ? void 0 : user.email,
                role: user === null || user === void 0 ? void 0 : user.role,
            },
        }, process.env.ACCESS_TOKEN_SECRET || "", {
            expiresIn: "10m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                email: user === null || user === void 0 ? void 0 : user.email,
            },
        }, process.env.REFRESH_TOKEN_SECRET || "", {
            expiresIn: "1h",
        });
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return (0, logger_1.default)(res, 201, {
            message: `User ${user.firstName} ${user.lastName} created successfully`,
            accessToken,
        });
    }
    catch (err) {
        return (0, logger_1.default)(res, err.status, { error: err.message });
    }
});
/**
 * @desc Login a user
 * @route POST /auth/login
 * @access Public
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, rememberMe } = req.body;
        let expiresIn = null;
        if (rememberMe === "on") {
            expiresIn = "7d";
        }
        else {
            expiresIn = "1h";
        }
        const user = yield User_1.default.findOne({ email });
        const accessToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                email: user === null || user === void 0 ? void 0 : user.email,
                role: user === null || user === void 0 ? void 0 : user.role,
            },
        }, process.env.ACCESS_TOKEN_SECRET || "", {
            expiresIn: "10m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                email: user === null || user === void 0 ? void 0 : user.email,
            },
        }, process.env.REFRESH_TOKEN_SECRET || "", {
            expiresIn,
        });
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        if (user)
            user.refreshToken = refreshToken;
        yield (user === null || user === void 0 ? void 0 : user.save());
        return (0, logger_1.default)(res, 200, {
            message: "User logged In",
            accessToken,
        });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, { error: err.message });
    }
});
/**x
 * @desc Logout a user
 * @route POST /auth/logout
 * @access Public
 */
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        const user = yield User_1.default.findOne({ refreshToken: cookies.jwt }).select("-password");
        if (!user)
            return (0, logger_1.default)(res, 401, { error: "Unauthorized" });
        user.refreshToken = "";
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: true,
            secure: true,
        });
        return (0, logger_1.default)(res, 200, {
            message: "Logged out successfully.",
        });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, { error: err.message });
    }
});
/**
 * @desc Request a new refresh token
 * @route POST /auth/refresh
 * @access Public
 */
const refresh = (req, res) => {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies.jwt;
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "", (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return (0, logger_1.default)(res, res.statusCode, { error: err.message });
            const foundUser = yield User_1.default.findOne({ email: decoded.UserInfo.email });
            if (!foundUser)
                return (0, logger_1.default)(res, 401, { error: "Unauthorized" });
            const accessToken = jsonwebtoken_1.default.sign({
                UserInfo: {
                    email: foundUser.email,
                    role: foundUser.role,
                },
            }, process.env.ACCESS_TOKEN_SECRET || "", { expiresIn: "10m" });
            return (0, logger_1.default)(res, 200, { accessToken });
        }));
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal Server Error",
            details: err.message,
        });
    }
};
/**
 * @desc Request forgot password assistance
 * @route POST /auth/forgot-password
 * @access Public
 */
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const foundUser = yield User_1.default.findOne({ email }).select("-password");
        if (!foundUser || foundUser.deleted)
            return (0, logger_1.default)(res, 400, { error: "User not found" });
        const token = yield Token_1.default.create({
            user: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id,
            token: generator_1.default.generateToken(),
        });
        return (0, logger_1.default)(res, 200, {
            message: "Account was found!",
            token: token.token,
        });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal Server Error",
            details: err.message,
        });
    }
});
/**
 * @desc Reset password
 * @route POST /auth/reset-password
 * @access Public
 */
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const matchToken = yield Token_1.default.findOne({ token });
        if (!(matchToken === null || matchToken === void 0 ? void 0 : matchToken.isValid))
            return (0, logger_1.default)(res, 400, { error: "Token is invalid" });
        const foundUser = yield User_1.default.findOne({ _id: matchToken.user }).select("-password");
        if (!foundUser || foundUser.deleted)
            return (0, logger_1.default)(res, 400, { error: "User not found" });
        foundUser.password = password;
        yield foundUser.save();
        matchToken.isValid = false;
        yield matchToken.save();
        return (0, logger_1.default)(res, 200, {
            message: "Password reset successful",
            user: foundUser,
        });
    }
    catch (err) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "Internal Server Error",
            details: err.message,
        });
    }
});
exports.default = {
    register,
    login,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
};
