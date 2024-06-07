import logger from "@/utils/logger";
import User from "@/models/User";
import bcrypt from "bcrypt";

const registerValidator = async (req: any, res: any, next: any) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!Array.isArray(role) || !role.length)
      return logger(res, 400, { error: "All fields must be provided!" });

    const foundUser = await User.findOne({ email }).select("-password");
    if (foundUser)
      return logger(res, 403, { error: "User with that email already exists" });

    const validRoles = [5501, 2219, 7689];
    const hasValidRoles = role.every((r) => validRoles.includes(r));
    const isAdmin =
      role.length === 3 &&
      role.includes(5501) &&
      role.includes(2219) &&
      role.includes(7689);
    const isStaff =
      role.length === 2 && role.includes(5501) && role.includes(2219);
    const isUser = role.length === 1 && role.includes(5501);

    if (hasValidRoles && (isAdmin || isStaff || isUser)) {
      return next();
    } else {
      return logger(res, 400, { error: "Invalid role" });
    }
  } catch (err: any) {
    return logger(res, res.statusCode, {
      message: err.message,
    });
  }
};

const loginValidator = async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return logger(res, 400, {
        error: "All fields must be provided",
      });
    const user = await User.findOne({ email, deleted: false }).lean();
    if (!user)
      return logger(res, 400, {
        error: "Invalid credentials",
      });
    if (!(await bcrypt.compare(password, user.password)))
      return logger(res, 400, { error: "Invalid credentials" });
    next();
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: err.message,
    });
  }
};

export default {
  registerValidator,
  loginValidator,
};
