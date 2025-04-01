import { z } from 'zod'

const envSchema = z.object({
  MODE: z.enum(['production', 'development', 'test']).optional(),
  VITE_SESSION_KEY: z.string().optional(),
  VITE_API_URL: z.string().optional(),
  VITE_ENABLE_API_DELAY: z.string().transform(value => value === 'true').optional(),
  VITE_SOFTWARE_VERSION: z.string().optional(),
})

export const env = envSchema.parse(import.meta.env)
