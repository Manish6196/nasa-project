import { z } from 'zod'

export const launchPayloadSchema = z.object({
  launchDate: z.string().datetime(),
  mission: z.string(),
  rocket: z.string(),
  target: z.string(),
})
