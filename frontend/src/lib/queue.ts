import { Queue } from "bullmq";
import IORedis from "ioredis";

// Use local Redis for development, or Redislabs/Upstash in production
const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

export const conversionQueue = new Queue("conversion-jobs", {
  connection,
});
