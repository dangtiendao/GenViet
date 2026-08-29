import { z } from "zod";

/**
 * Public client-side environment schema (safe to expose to browser)
 */
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

/**
 * Server-only environment schema (CRITICAL: Never expose to browser)
 */
export const serverEnvSchema = publicEnvSchema.extend({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validate environment variables safely
 */
export function validateEnv(rawEnv: Record<string, string | undefined> = process.env): {
  success: boolean;
  data?: ServerEnv;
  errors?: Record<string, string[]>;
} {
  const result = serverEnvSchema.safeParse(rawEnv);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  return {
    success: true,
    data: result.data,
  };
}

export const env = serverEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
});
