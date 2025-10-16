import { ErrorResponse } from "./errorResponse";

export class ErrorPresenter {
  message: string
  statusCode: number
  success: boolean
  errorsCode?: any

  constructor(err: ErrorResponse) {
    this.message = err.message
    this.statusCode = err.statusCode
    this.errorsCode = err.errorsCode
    this.success = false
  }
}