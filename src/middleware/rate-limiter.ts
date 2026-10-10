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
