export class ErrorResponse {
    statusCode: number;
    success: boolean;
    message: string;
    errors?: any;
  
    constructor(message: string, statusCode = 400, errors?: any) {
      this.statusCode = statusCode;
      this.success = false;
      this.message = message;
      this.errors = errors;
    }
  }