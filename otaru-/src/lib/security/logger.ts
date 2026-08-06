/**
 * OTARU — Edge-Optimized Structured JSON Logger
 *
 * Implements high-performance structured logging format for server actions,
 * edge middleware, and backend API routes. Formats output as readable text in
 * development and JSON string payloads in production.
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

interface LogContext {
  correlationId?: string;
  clientIp?: string;
  path?: string;
  durationMs?: number;
  [key: string]: unknown;
}

class Logger {
  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const timestamp = new Date().toISOString();
    const isProduction = process.env.NODE_ENV === 'production';

    const payload = {
      timestamp,
      level,
      message,
      ...(context && { context }),
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: isProduction ? undefined : error.stack,
        },
      }),
    };

    if (isProduction) {
      // Production uses structured JSON standard output
      console.log(JSON.stringify(payload));
    } else {
      // Development uses pretty console logging
      const colorMap = {
        INFO: '\x1b[36m', // Cyan
        WARN: '\x1b[33m', // Yellow
        ERROR: '\x1b[31m', // Red
      };
      const resetColor = '\x1b[0m';
      const color = colorMap[level] || resetColor;

      console.log(
        `[${timestamp}] ${color}${level}${resetColor}: ${message}`,
        context ? '\nContext:' : '',
        context ? JSON.stringify(context, null, 2) : '',
        error ? `\nError: ${error.message}` : ''
      );
    }
  }

  public info(message: string, context?: LogContext) {
    this.formatLog('INFO', message, context);
  }

  public warn(message: string, context?: LogContext, error?: Error) {
    this.formatLog('WARN', message, context, error);
  }

  public error(message: string, error?: Error, context?: LogContext) {
    this.formatLog('ERROR', message, context, error);
  }
}

export const logger = new Logger();
