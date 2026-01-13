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
  details: Record<string, any>
  constructor(message: string = "Not Found", details: Record<string, any> = {}) {
    super(message, 404)
    this.details = details
  }
}

class ForbiddenError extends HTTPError {
  details: Record<string, any>
  constructor(message: string = "Forbidden", details: Record<string, any> = {}) {
    super(message, 403);
    this.details = details
  }
}

class UnauthorizedError extends HTTPError {
  details: Record<string, any>
  constructor(messaage: string = "Unauthorized", details: Record<string, any> = {}) {
    super(messaage, 401)
    this.details = details
  }
}

class ServerError extends HTTPError {
  details: Record<string, any>
  constructor(message: string = "Server Error", details: Record<string, any> = {}) {
    super(message, 500)
    this.details = details
  }
}

export { HTTPError, BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError, ServerError };