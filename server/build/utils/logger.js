"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (res, status, data) => {
    return res.status(status).json(data);
};
exports.default = logger;
