export abstract class CustomError extends Error {
  //Writing abstract says that a subclass must implement what is defined here
  //Similar in nature to an interface
  abstract statusCode: number;

  constructor() {
    super();

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string, field?: string }[]
}