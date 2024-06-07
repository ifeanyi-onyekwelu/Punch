import User from "@/models/User";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "@/utils/logger";
import generator from "@/utils/generator";
import Token from "@/models/Token";

/**
 * @desc Register a user
 * @route POST /auth/register
 * @access Public
 */
const register = async (req: any, res: any) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      referralCode: generator.generateReferralCode(),
      referralLink: generator.generateReferralLink(),
      role,
    });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user?.email,
          role: user?.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET || "",
      {
        expiresIn: "10m",
      }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          email: user?.email,
        },
      },
      process.env.REFRESH_TOKEN_SECRET || "",
      {
        expiresIn: "1h",
      }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return logger(res, 201, {
      message: `User ${user.firstName} ${user.lastName} created successfully`,
      accessToken,
    });
  } catch (err: any) {
    return logger(res, err.status, { error: err.message });
  }
};

/**
 * @desc Login a user
 * @route POST /auth/login
 * @access Public
 */
const login = async (req: any, res: any) => {
  try {
    const { email, rememberMe } = req.body;
    let expiresIn = null;

    if (rememberMe === "on") {
      expiresIn = "7d";
    } else {
      expiresIn = "1h";
    }

    const user = await User.findOne({ email });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user?.email,
          role: user?.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET || "",
      {
        expiresIn: "10m",
      }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          email: user?.email,
        },
      },
      process.env.REFRESH_TOKEN_SECRET || "",
      {
        expiresIn,
      }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    if (user) user.refreshToken = refreshToken;
    await user?.save();

    return logger(res, 200, {
      message: "User logged In",
      accessToken,
    });
  } catch (err: any) {
    return logger(res, res.statusCode, { error: err.message });
  }
};

/**x
 * @desc Logout a user
 * @route POST /auth/logout
 * @access Public
 */
const logout = async (req: any, res: any) => {
  try {
    const cookies = req.cookies;

    const user = await User.findOne({ refreshToken: cookies.jwt }).select(
      "-password"
    );

    if (!user) return logger(res, 401, { error: "Unauthorized" });

    user.refreshToken = "";
    await user?.save();
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: true,
      secure: true,
    });
    return logger(res, 200, {
      message: "Logged out successfully.",
    });
  } catch (err: any) {
    return logger(res, res.statusCode, { error: err.message });
  }
};

/**
 * @desc Request a new refresh token
 * @route POST /auth/refresh
 * @access Public
 */
const refresh = (req: any, res: any) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "",
      async (err: any, decoded: any) => {
        if (err) return logger(res, res.statusCode, { error: err.message });

        const foundUser = await User.findOne({ email: decoded.UserInfo.email });

        if (!foundUser) return logger(res, 401, { error: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: foundUser.email,
              role: foundUser.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET || "",
          { expiresIn: "10m" }
        );

        return logger(res, 200, { accessToken });
      }
    );
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal Server Error",
      details: err.message,
    });
  }
};

/**
 * @desc Request forgot password assistance
 * @route POST /auth/forgot-password
 * @access Public
 */
const forgotPassword = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    const foundUser = await User.findOne({ email }).select("-password");

    if (!foundUser || foundUser.deleted)
      return logger(res, 400, { error: "User not found" });

    const token = await Token.create({
      user: foundUser?._id,
      token: generator.generateToken(),
    });

    return logger(res, 200, {
      message: "Account was found!",
      token: token.token,
    });
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal Server Error",
      details: err.message,
    });
  }
};

/**
 * @desc Reset password
 * @route POST /auth/reset-password
 * @access Public
 */
const resetPassword = async (req: any, res: any) => {
  try {
    const { token, password } = req.body;

    const matchToken = await Token.findOne({ token });
    if (!matchToken?.isValid)
      return logger(res, 400, { error: "Token is invalid" });

    const foundUser = await User.findOne({ _id: matchToken.user }).select(
      "-password"
    );
    if (!foundUser || foundUser.deleted)
      return logger(res, 400, { error: "User not found" });

    foundUser.password = password;
    await foundUser.save();

    matchToken.isValid = false;
    await matchToken.save();

    return logger(res, 200, {
      message: "Password reset successful",
      user: foundUser,
    });
  } catch (err: any) {
    return logger(res, res.statusCode, {
      error: "Internal Server Error",
      details: err.message,
    });
  }
};

export default {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
};
