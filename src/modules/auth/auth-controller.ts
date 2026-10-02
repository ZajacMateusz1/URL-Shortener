import type { Request, Response, NextFunction } from "express";

import {
  resendVerificationEmailService,
  singUpService,
  verifyEmailService,
  loginService,
  resetPasswordService,
  changePasswordService,
} from "./auth-service.js";
import HttpError from "@/errors/http-error.js";

import type {
  SignUpSchemaType,
  EmailSchemaType,
  LoginSchemaType,
  PasswordSchemaType,
} from "./auth-schema.js";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: SignUpSchemaType = req.body;
    const { response, token } = await singUpService(data);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.params;
    if (typeof token !== "string") {
      throw new HttpError("Invalid token", 400);
    }
    await verifyEmailService(token);
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email }: EmailSchemaType = req.body;
    await resendVerificationEmailService(email);
    res.json({
      message:
        "If the email exists in our system, a verification link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loginData: LoginSchemaType = req.body;
    const { response, token } = await loginService(loginData);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email }: EmailSchemaType = req.body;
    await resetPasswordService(email);
    res.json({
      message:
        "If the email exists in our system, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.params;
    const { password }: PasswordSchemaType = req.body;
    if (typeof token !== "string") {
      throw new HttpError("Invalid token", 400);
    }
    await changePasswordService(token, password);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
