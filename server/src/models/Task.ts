import mongoose, { Schema } from "mongoose";

interface ITask {
  user: mongoose.Types.ObjectId;
  title: string;
  body: string;
  priority: string;
  dueDate: Date;
  completed: boolean;
  deleted: boolean;
  inProcess: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    user: mongoose.Types.ObjectId,
    title: String,
    body: String,
    priority: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    inProcess: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", taskSchema);
