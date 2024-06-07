import jwt from "jsonwebtoken";
import express from "express";
import logger from "@/utils/logger";

const authGuard = (
  req: express.Request | any,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["authorization"]
    ? req.headers["authorization"]
    : req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return logger(res, 401, { error: "Unauthorized" });

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "",
    (err: any, decoded: any) => {
      if (err) return logger(res, res.statusCode, { error: err.message });
      req.user = decoded.UserInfo;
      next();
    }
  );
};

export default authGuard;
