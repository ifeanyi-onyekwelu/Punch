"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("@/utils/logger"));
const authGuard = (req, res, next) => {
    const authHeader = req.headers["authorization"]
        ? req.headers["authorization"]
        : req.headers["Authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return (0, logger_1.default)(res, 401, { error: "Unauthorized" });
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || "", (err, decoded) => {
        if (err)
            return (0, logger_1.default)(res, res.statusCode, { error: err.message });
        req.user = decoded.UserInfo;
        next();
    });
};
exports.default = authGuard;
