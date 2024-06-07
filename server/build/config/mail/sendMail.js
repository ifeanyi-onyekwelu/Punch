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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMassMail = exports.sendMail = void 0;
const brevo_1 = require("@getbrevo/brevo");
const sendinBlueConfig_1 = require("./sendinBlueConfig");
const sendMail = (receiverName, receiverEmail, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("API KEY HERE", process.env.BREVO_API_KEY);
        const sendSmtpEmail = new brevo_1.SendSmtpEmail();
        sendSmtpEmail.to = [
            {
                email: receiverEmail,
                name: receiverName,
            },
        ];
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = message;
        sendSmtpEmail.sender = {
            name: process.env.EMAIL_NAME || "",
            email: process.env.EMAIL_USER || "",
        };
        // send the email
        const emailData = yield (sendinBlueConfig_1.transactionEmailAPi === null || sendinBlueConfig_1.transactionEmailAPi === void 0 ? void 0 : sendinBlueConfig_1.transactionEmailAPi.sendTransacEmail(sendSmtpEmail));
        console.log("Email sent", emailData);
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.sendMail = sendMail;
const sendMassMail = (userList, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sendSmtpEmail = new brevo_1.SendSmtpEmail();
        sendSmtpEmail.sender = {
            email: process.env.EMAIL_USER || "",
            name: process.env.EMAIL_NAME || "",
        };
        sendSmtpEmail.htmlContent = message;
        sendSmtpEmail.subject = subject;
        for (let user of userList) {
            sendSmtpEmail.to = [
                {
                    email: user.email,
                    name: user.name,
                },
            ];
        }
        const emailData = sendinBlueConfig_1.transactionEmailAPi === null || sendinBlueConfig_1.transactionEmailAPi === void 0 ? void 0 : sendinBlueConfig_1.transactionEmailAPi.sendTransacEmail(sendSmtpEmail);
        console.log("Mass mail sent!", emailData);
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.sendMassMail = sendMassMail;
