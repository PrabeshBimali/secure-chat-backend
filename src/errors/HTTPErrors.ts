class HTTPError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class BadRequestError extends HTTPError {
  field?: string;
  constructor(message: string = "Bad Request", field?: string) {
    super(message, 400);
    this.field = field
  }
}

class NotFoundError extends HTTPError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

class ForbiddenError extends HTTPError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

class ServerError extends HTTPError {
  constructor(message: string = "Server Error") {
    super(message, 500)
  }
}

export { HTTPError, BadRequestError, NotFoundError, ForbiddenError, ServerError };