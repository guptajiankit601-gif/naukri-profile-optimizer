/**
 * ERROR HANDLING WITHOUT LEAKS (SECURITY.md Section 13)
 * Never returns internal stack traces, DB constraints, or SQL messages in production.
 */

export class AppError extends Error {
  code: string;
  publicMessage: string;
  status: number;

  constructor(code: string, publicMessage: string, status: number = 400) {
    super(publicMessage);
    this.name = 'AppError';
    this.code = code;
    this.publicMessage = publicMessage;
    this.status = status;
  }
}

export function toPublicError(err: unknown): { code: string; message: string; status: number } {
  if (err instanceof AppError) {
    return {
      code: err.code,
      message: err.publicMessage,
      status: err.status
    };
  }

  // Generic sanitization for unexpected exceptions
  return {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again.',
    status: 500
  };
}
