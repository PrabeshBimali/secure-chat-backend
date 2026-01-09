class HTTPError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class BadRequestError extends HTTPError {
  details: Record<string, any>
  constructor(message: string = "Bad Request", details: Record<string, any> = {}) {
    super(message, 400);
    this.details = details
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

class UnauthorizedError extends HTTPError {
  constructor(messaage: string = "Unauthorized") {
    super(messaage, 401)
  }
}

class ServerError extends HTTPError {
  constructor(message: string = "Server Error") {
    super(message, 500)
  }
}

export { HTTPError, BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError, ServerError };