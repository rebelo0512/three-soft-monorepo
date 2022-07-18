export class ValidationError extends Error {
  readonly httpStatus: number;
  constructor(readonly message: string, readonly status?: number) {
    super(message);
    this.httpStatus = status || 500;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
