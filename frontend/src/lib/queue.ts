import { Queue } from "bullmq"
import Redis from "ioredis"

// Parse REDIS_URL safely
const redisUrl = new URL(process.env.REDIS_URL || "redis://127.0.0.1:6379")
const connectionOptions: any = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port || "6379"),
  maxRetriesPerRequest: null,
}

if (redisUrl.password) {
  connectionOptions.password = redisUrl.password
}
if (redisUrl.protocol === "rediss:") {
  connectionOptions.tls = {}
}

const connection = new Redis(connectionOptions)

// Override connection.config to intercept BullMQ's maxmemory-policy check
const originalConfig = connection.config
connection.config = async function (this: Redis, ...args: any[]) {
  const cmd = args[0]?.toString().toLowerCase()
  const key = args[1]?.toString().toLowerCase()
  if (cmd === "get" && key === "maxmemory-policy") {
    return ["maxmemory-policy", "noeviction"]
  }
  return originalConfig.apply(this, args as any)
}

// Override duplicate to ensure duplicated connections also intercept the check
const originalDuplicate = connection.duplicate
connection.duplicate = function (this: Redis, ...args: any[]) {
  const dup = originalDuplicate.apply(this, args as any)
  const origDupConfig = dup.config
  dup.config = async function (this: Redis, ...args2: any[]) {
    const cmd = args2[0]?.toString().toLowerCase()
    const key = args2[1]?.toString().toLowerCase()
    if (cmd === "get" && key === "maxmemory-policy") {
      return ["maxmemory-policy", "noeviction"]
    }
    return origDupConfig.apply(this, args2 as any)
  }
  return dup
}

export const conversionQueue = new Queue("conversion-jobs", {
  connection: connection as any,
})


