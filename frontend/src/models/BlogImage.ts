import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlogImage extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const BlogImageSchema: Schema = new Schema(
  {
    filename: { type: String, required: true, unique: true, index: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

export const BlogImage: Model<IBlogImage> =
  mongoose.models.BlogImage || mongoose.model<IBlogImage>("BlogImage", BlogImageSchema);
