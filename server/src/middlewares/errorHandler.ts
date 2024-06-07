import express from "express";
import logger from "@/utils/logger";

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

const errorHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof CustomError) {
    logger(res, 400, { error: "Something went wrong", details: err.message });
  } else if (err instanceof TypeError) {
    logger(res, 400, { error: "Type Error", details: err.message });
  }
  logger(res, 500, { error: "Internal Server Error", details: err.message });
};

export default errorHandler;
