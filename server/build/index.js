"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
require("module-alias/register");
const path_1 = __importDefault(require("path"));
const dbConn_1 = __importDefault(require("@/config/dbConn"));
const sendinBlueConfig_1 = __importDefault(require("@/config/mail/sendinBlueConfig"));
const errorHandler_1 = __importDefault(require("@/middlewares/errorHandler"));
const corsOptions_1 = __importDefault(require("@/config/corsOptions"));
const apiRoutes_1 = __importDefault(require("@/routes/apiRoutes"));
(0, dotenv_1.config)();
(0, sendinBlueConfig_1.default)();
(0, dbConn_1.default)();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions_1.default));
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use("", express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("^/$", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "index.html"));
});
app.use("/api/v1", apiRoutes_1.default);
app.all("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "404.html"));
});
app.use(errorHandler_1.default);
mongoose_1.default.connection.on("open", () => {
    console.log("MongoDB Connected!");
    app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
});
mongoose_1.default.connection.on("error", (err) => console.log(err));
