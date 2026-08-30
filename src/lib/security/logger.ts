type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

interface LogContext {
  correlationId?: string;
  requestId?: string;
  orderId?: string;
  eventId?: string;
  clientIp?: string;
  path?: string;
  durationMs?: number;
  [key: string]: unknown;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'secret',
  'signature',
  'token',
  'authorization',
  'cardnumber',
  'cvv',
  'razorpay_signature',
]);

function redactSensitiveData(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      redacted[key] = '[REDACTED_SECRET]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveData(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

class Logger {
  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const timestamp = new Date().toISOString();
    const isProduction = process.env.NODE_ENV === 'production';

    const safeContext = context ? (redactSensitiveData(context) as LogContext) : undefined;

    const payload = {
      timestamp,
      level,
      message,
      ...(safeContext && { context: safeContext }),
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
      const colorMap: Record<LogLevel, string> = {
        INFO: '\x1b[36m',
        WARN: '\x1b[33m',
        ERROR: '\x1b[31m',
        AUDIT: '\x1b[35m',
      };
      const resetColor = '\x1b[0m';
      const color = colorMap[level] || resetColor;

      console.log(
        `[${timestamp}] ${color}${level}${resetColor}: ${message}`,
        safeContext ? '\nContext:' : '',
        safeContext ? JSON.stringify(safeContext, null, 2) : '',
        error ? `\nError: ${error.message}` : ''
      );
    }
  }

  public info(message: string, context?: LogContext) {
    this.formatLog('INFO', message, context);
  }

  public warn(message: string, context?: LogContext, error?: unknown) {
    const errObj = error instanceof Error ? error : error ? new Error(String(error)) : undefined;
    this.formatLog('WARN', message, context, errObj);
  }

  public error(message: string, error?: unknown, context?: LogContext) {
    const errObj = error instanceof Error ? error : error ? new Error(String(error)) : undefined;
    this.formatLog('ERROR', message, context, errObj);
  }

  public audit(message: string, context?: LogContext) {
    this.formatLog('AUDIT', message, context);
  }
}

export const logger = new Logger();
