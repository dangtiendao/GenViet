import { z } from "zod";

export const LogLevelSchema = z.enum(["debug", "info", "warn", "error", "fatal"]);
export type LogLevel = z.infer<typeof LogLevelSchema>;

export const RuntimeEnvironmentSchema = z.enum(["development", "preview", "production", "test"]);
export type RuntimeEnvironment = z.infer<typeof RuntimeEnvironmentSchema>;

export const LogEventSchema = z.object({
  timestamp: z.string().datetime(),
  level: LogLevelSchema,
  event: z.string().min(1),
  message: z.string().min(1),
  requestId: z.string().min(1),
  environment: RuntimeEnvironmentSchema,
  release: z.string().default("v0.1.0"),
  runtime: z.enum(["nodejs", "edge", "browser"]).default("nodejs"),
  route: z.string().optional(),
  method: z.string().optional(),
  statusCode: z.number().int().optional(),
  durationMs: z.number().nonnegative().optional(),
  errorCode: z.string().optional(),
  retryable: z.boolean().optional(),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type LogEvent = z.infer<typeof LogEventSchema>;
