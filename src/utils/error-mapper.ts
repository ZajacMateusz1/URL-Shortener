import { z } from "zod";
import HTTPError from "../errors/http-error.js";

const errorMapper = (error: unknown) => {
  if (error instanceof HTTPError) return error;
  if (error instanceof z.ZodError) {
    const flattenedErrors = z.flattenError(error);
    return new HTTPError("Validation error", 422, flattenedErrors);
  }
  return new HTTPError("Internal server error", 500);
};

export default errorMapper;
