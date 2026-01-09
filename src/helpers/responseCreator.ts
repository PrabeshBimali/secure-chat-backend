interface ErrorResponse {
  success: false
  message: string
  details?: Record<string, any>
}

interface SuccessResponse<T> {
  success: true
  message: string
  data?: T
}

export function createErrorResponse(message: string, details?: Record<string, any>): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    message: message,
    details : details
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