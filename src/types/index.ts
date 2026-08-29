/**
 * Shared Type Definitions for GenViet Application
 */

export type EntityId = string;

export interface ApplicationBaseResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    correlationId?: string;
  };
}
