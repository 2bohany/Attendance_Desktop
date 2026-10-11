import { Injectable, Logger, LogLevel } from '@nestjs/common';

export type LogCategory = 'application' | 'error' | 'audit';

@Injectable()
export class AppLoggerService {
  private readonly applicationLogger = new Logger('Application');
  private readonly errorLogger = new Logger('Error');
  private readonly auditLogger = new Logger('Audit');

  log(message: string, context?: string): void {
    this.applicationLogger.log(message, context);
  }

  warn(message: string, context?: string): void {
    this.applicationLogger.warn(message, context);
  }

  debug(message: string, context?: string): void {
    this.applicationLogger.debug(message, context);
  }

  logError(message: string, trace?: string, context?: string): void {
    this.errorLogger.error(message, trace, context);
  }

  logAudit(action: string, details: Record<string, unknown>): void {
    this.auditLogger.log(`${action}: ${JSON.stringify(details)}`);
  }

  static getLogLevels(environment: string): LogLevel[] {
    return environment === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug'];
  }
}
