import express from "express";
import userRoutes from "@/routes/userRoutes";
import taskRoutes from "@/routes/taskRoutes";
import authGuard from "@/middlewares/authGuard";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", authGuard, taskRoutes);

export default router;
