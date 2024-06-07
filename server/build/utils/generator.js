"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generateReferralLink = () => {
    const client_host = process.env.CLIENT_DOMAIN;
    return `${client_host}/user/register?ref=${crypto_1.default
        .randomBytes(16)
        .toString("hex")
        .slice(-30)}`;
};
const generateReferralCode = () => {
    const randomBytes = crypto_1.default.randomBytes(64).toString("hex");
    return `REF${randomBytes.slice(-6).toUpperCase()}`;
};
const generateToken = () => {
    return `${crypto_1.default.randomBytes(64).toString("hex").slice(-6)}`;
};
exports.default = {
    generateReferralCode,
    generateReferralLink,
    generateToken,
};
