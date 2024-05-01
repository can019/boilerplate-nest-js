export abstract class CustomError extends Error {
  protected error?: string;
  protected code?: string;
  protected statusCode: number;
  constructor(...args: any) {
    super(...args);
  }
  getStatus() {
    return this.statusCode;
  }
  getResponse() {
    const response = {
      statusCode: this.statusCode,
      message: this.message,
      code: this.code,
      error: this.error,
    };
    return response;
  }
}
