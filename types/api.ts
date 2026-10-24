export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ParseInput =
  | { kind: 'file'; filename: string; mime: string; base64: string }
  | { kind: 'url'; url: string }
  | { kind: 'text'; text: string };
