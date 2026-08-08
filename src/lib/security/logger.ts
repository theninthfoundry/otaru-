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
      console.log(JSON.stringify(payload));
    } else {
      const colorMap = {
        INFO: '\x1b[36m',
        WARN: '\x1b[33m',
        ERROR: '\x1b[31m',
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
