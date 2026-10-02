import crypto from "crypto";

export const createVerificationToken = async () => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  return {
    verificationToken,
    hashedToken: crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex"),
  };
};
