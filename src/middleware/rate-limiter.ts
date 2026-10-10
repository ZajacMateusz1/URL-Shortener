import type { Request, Response, NextFunction } from "express";
import redisClient from "@/config/redis";
import HTTPError from "@/errors/http-error";

export const fixedWindow =
  (limit: number, expireTime: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip;
      if (!ip) throw new HTTPError("Unable to determine client IP", 400);
      const key = `rate-limit:${ip}`;
      const curr = await redisClient.incr(key);
      if (curr === 1) redisClient.expire(key, expireTime);
      if (curr > limit) throw new HTTPError("Too many requests", 429);
      next();
    } catch (error) {
      next(error);
    }
  };

export const tokenBucket =
  (bucketCapacity: number, refillRate: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip;
      if (!ip) throw new HTTPError("Unable to determine client IP", 400);
      const key = `rate-limit:${ip}`;
      const now = Date.now();
      let curr = await redisClient.hGetAll(key);
      if (Object.keys(curr).length === 0) {
        await redisClient.hSet(key, {
          lastRefill: now,
          tokens: bucketCapacity - 1,
        });
      } else {
        const { lastRefill, tokens } = curr;
        const elapsedSeconds = (now - Number(lastRefill)) / 1000;
        const newTokens = Math.min(
          bucketCapacity,
          Number(tokens) + elapsedSeconds * refillRate,
        );
        if (newTokens < 1) throw new HTTPError("Too many requests", 429);
        await redisClient.hSet(key, {
          lastRefill: now,
          tokens: newTokens - 1,
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
