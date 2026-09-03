/**
 * OTARU CALM ERROR SHIELD
 * Strips raw internal database exceptions, stack traces, and database connection strings.
 * Presents a calm, branded message to collectors while logging detailed telemetry internally.
 */

import crypto from 'crypto';

export interface ShieldedErrorResponse {
  message: string;
  referenceCode: string;
  timestamp: string;
  statusCode: number;
}

export interface InternalErrorLog {
  referenceCode: string;
  rawMessage: string;
  stack?: string;
  route: string;
  requestId: string;
  timestamp: string;
}

export class ErrorShield {
  private static logs: InternalErrorLog[] = [];

  /**
   * Sanitizes any exception into a quiet, luxury collector-facing response.
   */
  static shield(
    error: unknown,
    route: string,
    requestId: string,
    statusCode: number = 500
  ): ShieldedErrorResponse {
    const rawError = error instanceof Error ? error : new Error(String(error));
    const randomHash = crypto.randomBytes(2).toString('hex').toUpperCase();
    const referenceCode = `OTR-ERR-${randomHash}`;
    const timestamp = new Date().toISOString();

    // Store internal debug trace
    this.logs.push({
      referenceCode,
      rawMessage: rawError.message,
      stack: rawError.stack,
      route,
      requestId,
      timestamp,
    });

    return {
      message: 'Something interrupted the archive.',
      referenceCode,
      timestamp,
      statusCode,
    };
  }

  static getInternalLog(referenceCode: string): InternalErrorLog | undefined {
    return this.logs.find((l) => l.referenceCode === referenceCode);
  }
}
