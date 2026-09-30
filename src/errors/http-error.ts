type ValidationErrors = {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
};

class HTTPError extends Error {
  statusCode: number;
  details: ValidationErrors | null;
  constructor(
    message: string,
    statusCode: number,
    details: ValidationErrors | null = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export default HTTPError;
