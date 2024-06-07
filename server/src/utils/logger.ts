import express from "express";

const logger = (res: express.Response, status: number, data: any) => {
  return res.status(status).json(data);
};

export default logger;
