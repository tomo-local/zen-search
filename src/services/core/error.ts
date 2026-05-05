/**
 * A base class for all service-related errors.
 */

export abstract class ServiceError extends Error {
  abstract readonly code: string;

  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}
/**
 * @param err The error to convert to an Error object.
 * @returns  An Error object. If the input is already an Error, it is returned as-is. Otherwise, a new Error is created with the string representation of the input.
 */
export const toError = (err: unknown): Error => {
  return err instanceof Error ? err : new Error(String(err));
};
