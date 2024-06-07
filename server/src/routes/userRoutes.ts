import express from "express";
import userController from "@/controllers/userController";
import userValidators from "@/middlewares/validators/userValidators";
import requiredFields from "@/middlewares/validators/requiredValidators";

const router = express.Router();

router.post(
  "/register",
  [
    requiredFields(["firstName", "lastName", "email", "password", "role"]),
    userValidators.registerValidator,
  ],
  userController.register
);
router.post(
  "/login",
  [requiredFields(["email", "password"]), userValidators.loginValidator],
  userController.login
);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.post(
  "/forgot-password",
  [requiredFields(["email"])],
  userController.forgotPassword
);
router.patch(
  "/reset-password",
  [requiredFields(["token", "password"])],
  userController.resetPassword
);
export default router;
