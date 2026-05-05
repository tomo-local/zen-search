/**
 * A simple logging service for microservices, providing structured logging with context.
 */

type LogContext = Record<string, unknown>;

export class ServiceLogger {
  constructor(private readonly serviceName: string) {}

  /** Logs informational messages. Output is suppressed in production builds. */
  info(message: string, context: LogContext = {}): void {
    if (import.meta.env.DEV) {
      console.info({
        service: this.serviceName,
        message,
        ...context,
      });
    }
  }

  /** Logs warning messages. Always emitted, including in production builds. */
  warn(message: string, context: LogContext = {}): void {
    console.warn({
      service: this.serviceName,
      message,
      ...context,
    });
  }

  /** Logs error messages. Always emitted, including in production builds. */
  error(message: string, error?: unknown, context: LogContext = {}): void {
    console.error({
      service: this.serviceName,
      message,
      error,
      ...context,
    });
  }
}
