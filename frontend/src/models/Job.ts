import mongoose, { Document, Model, Schema } from "mongoose";

export interface IJob extends Document {
  userId?: string;
  originalFileName: string;
  sourceFormat: string;
  targetFormat: string;
  options?: any;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  fileSize: number;
  outputUrl?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    userId: { type: String, required: false },
    originalFileName: { type: String, required: true },
    sourceFormat: { type: String, required: true },
    targetFormat: { type: String, required: true },
    options: { type: Schema.Types.Mixed, required: false },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    progress: { type: Number, default: 0 },
    fileSize: { type: Number, required: true },
    outputUrl: { type: String },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
