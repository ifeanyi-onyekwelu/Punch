import express from "express";
import taskController from "@/controllers/taskController";
import requiredFields from "@/middlewares/validators/requiredValidators";

const router = express.Router();

router
  .route("/")
  .post(
    requiredFields(["title", "body", "priority", "dueDate"]),
    taskController.createTask
  )
  .get(taskController.getAllTasks)
  .delete(taskController.deleteAllTask);
router
  .route("/:id")
  .get(taskController.getATask)
  .put(
    requiredFields(["title", "body", "priority", "dueDate"]),
    taskController.editTask
  )
  .delete(taskController.deleteTask);

router.patch("/:id/set-in-process", taskController.setInProcess);
router.patch("/:id/set-completed", taskController.setCompleted);

export default router;
