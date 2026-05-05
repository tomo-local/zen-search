/**
 * A simple logging service for microservices, providing structured logging with context.
 */

type LogContext = Record<string, unknown>;

export class ServiceLogger {
  constructor(private readonly serviceName: string) {}

  info(message: string, context: LogContext = {}): void {
    if (import.meta.env.DEV) {
      console.info({
        service: this.serviceName,
        message,
        ...context,
      });
    }
  }

  warn(message: string, context: LogContext = {}): void {
    console.warn({
      service: this.serviceName,
      message,
      ...context,
    });
  }

  error(message: string, error?: unknown, context: LogContext = {}): void {
    console.error({
      service: this.serviceName,
      message,
      error,
      ...context,
    });
  }
}
