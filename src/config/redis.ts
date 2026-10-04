import { createClient } from "redis";
import { env } from "./env.js";

const redis = createClient({
  url: env.REDIS_URL,
});

redis.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  await redis.connect();
  console.log("Connected to Redis");
};

export default redis;
