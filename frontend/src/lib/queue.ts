import { Queue } from "bullmq"

// Parse REDIS_URL safely
const redisUrl = new URL(process.env.REDIS_URL || "redis://127.0.0.1:6379")
const connection: any = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port || "6379"),
  maxRetriesPerRequest: null,
}

if (redisUrl.password) {
  connection.password = redisUrl.password
}
if (redisUrl.protocol === "rediss:") {
  connection.tls = {}
}

export const conversionQueue = new Queue("conversion-jobs", {
  connection,
})
