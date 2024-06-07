import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { config } from "dotenv";
import "module-alias/register";
import path from "path";

import dbConn from "@/config/dbConn";
import authGuard from "@/middlewares/authGuard";
import sendinBlueConfig from "@/config/mail/sendinBlueConfig";
import errorHandler from "@/middlewares/errorHandler";
import corsOptions from "@/config/corsOptions";
import apiRoutes from "@/routes/apiRoutes";

config();
sendinBlueConfig();
dbConn();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("", express.static(path.join(__dirname, "public")));

app.use("^/$", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/api/v1", apiRoutes);

app.all("*", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

mongoose.connection.on("open", () => {
  console.log("MongoDB Connected!");
  app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
});

mongoose.connection.on("error", (err) => console.log(err));
