import HTTPError from "../errors/http-error.js";

const errorMapper = (error: unknown) => {
  if (error instanceof HTTPError) return error;
  return new HTTPError(500, "Internal server error");
};

export default errorMapper;
