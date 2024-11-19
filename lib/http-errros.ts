export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    // this exits inthe error name
    this.name = "Request Error";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatFieldError(fieldErrors);
    super(400, message, fieldErrors);
    this.name = "Validation Error";
  }

  static formatFieldError(errors: Record<string, string[]>): string {
    const formattedMessage = Object.entries(errors).map(([field, message]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

      if (message.includes("Required")) return `${fieldName} is required`;
      else return message.join("and  ");
    });
    console.log("format message: ", formattedMessage);
    return formattedMessage.join(", ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = "Not Found Error";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(403, message);
    this.name = "Forbidden Error";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "Unauthorized Error";
  }
}
