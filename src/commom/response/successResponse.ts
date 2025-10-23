export class SuccessResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;

  constructor(message: string, data?: T, statusCode = 200) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
