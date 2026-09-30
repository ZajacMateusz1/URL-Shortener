import { Resend } from "resend";
import { env } from "@/config/env.js";
import { welcomeEmailTemplate } from "./email-templates.js";

const resend = new Resend(env.RESEND_API_KEY);

export const sendWelcomeEmail = async (recipient: string) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: recipient,
      subject: "Welcome to Our Service!",
      html: welcomeEmailTemplate,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
