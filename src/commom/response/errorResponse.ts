interface IConstructorErrorResponse {
  message: string,
  statusCode: number,
  errorsCode?: any
  details?: any
}

export class ErrorResponse extends Error {
  public readonly statusCode: number
  public readonly success: boolean
  public readonly errorsCode?: any
  public readonly details?: any


  constructor(data: IConstructorErrorResponse) {
    super(data.message)
    this.name = this.constructor.name
    this.statusCode = data.statusCode ? data.statusCode : 400
    this.errorsCode = data.errorsCode
    this.details = data.details
    this.success = false;


    Error.captureStackTrace(this, this.constructor)
  }
}