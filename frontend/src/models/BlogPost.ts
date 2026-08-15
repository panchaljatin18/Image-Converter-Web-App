import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  description: string;
  focusKeyword?: string;
  relatedToolSlug?: string;
  image?: string;
  imageAlt?: string;
  imageTitle?: string;
  author: string;
  status: "Draft" | "Published";
  date: string;
  content: string;
  htmlContent?: string;
  editorHtml?: string;
  content_blocks?: any;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    focusKeyword: { type: String },
    relatedToolSlug: { type: String },
    image: { type: String },
    imageAlt: { type: String },
    imageTitle: { type: String },
    author: { type: String, default: "Convert Galaxy Team" },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    date: { type: String, required: true },
    content: { type: String, required: true },
    htmlContent: { type: String },
    editorHtml: { type: String },
    content_blocks: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

const SeededLockSchema: Schema = new Schema({
  seeded: { type: Boolean, default: true },
});

export const SeededLock =
  mongoose.models.SeededLock || mongoose.model("SeededLock", SeededLockSchema);
