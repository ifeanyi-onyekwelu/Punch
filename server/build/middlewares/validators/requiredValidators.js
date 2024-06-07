"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/utils/logger"));
const requiredFields = (fields) => (req, res, next) => {
    if (!fields.every((field) => req.body[field])) {
        return (0, logger_1.default)(res, res.statusCode, {
            error: "All fields must be provided!",
        });
    }
    next();
};
exports.default = requiredFields;
