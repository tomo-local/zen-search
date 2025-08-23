export class RuntimeServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = "RuntimeServiceError";
  }
}
