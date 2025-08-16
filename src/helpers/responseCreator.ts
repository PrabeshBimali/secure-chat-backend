interface ErrorResponse {
  success: false
  message: string
  field?: string
}

interface SuccessResponse<T> {
  success: true
  message: string
  data?: T
}

export function createErrorResponse(message: string, field?: string): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    message: message,
    field : field
  }

  return response
}

export function createSuccessResponse<T>(message: string, data?: T): SuccessResponse<T> {
  const response: SuccessResponse<T> = {
    success: true,
    message: message,
    data: data
  }

  return response
}