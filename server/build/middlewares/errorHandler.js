"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/utils/logger"));
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomError";
    }
}
const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        (0, logger_1.default)(res, 400, { error: "Something went wrong", details: err.message });
    }
    else if (err instanceof TypeError) {
        (0, logger_1.default)(res, 400, { error: "Type Error", details: err.message });
    }
    (0, logger_1.default)(res, 500, { error: "Internal Server Error", details: err.message });
};
exports.default = errorHandler;
