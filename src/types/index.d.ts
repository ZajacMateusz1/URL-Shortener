import type { JwtPayload } from "jsonwebtoken";

export type UserDataType = JwtPayload & { sub: number };

declare global {
  namespace Express {
    interface Request {
      userData?: UserDataType;
    }
  }
}
