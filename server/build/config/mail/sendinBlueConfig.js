"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionEmailAPi = void 0;
const brevo_1 = require("@getbrevo/brevo");
exports.transactionEmailAPi = null;
const sendinBlueConfig = () => {
    const key = brevo_1.TransactionalEmailsApiApiKeys.apiKey;
    const value = process.env.BREVO_API_KEY || "";
    exports.transactionEmailAPi = new brevo_1.TransactionalEmailsApi();
    exports.transactionEmailAPi.setApiKey(key, value);
};
exports.default = sendinBlueConfig;
