import logger from "@/utils/logger";

const requiredFields =
  (fields: string[]) => (req: any, res: any, next: any) => {
    if (!fields.every((field) => req.body[field])) {
      return logger(res, res.statusCode, {
        error: "All fields must be provided!",
      });
    }

    next();
  };

export default requiredFields;
