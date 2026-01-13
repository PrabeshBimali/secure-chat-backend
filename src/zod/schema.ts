import * as z from "zod"

const hexRegex = /^[0-9a-fA-F]+$/;

const DeviceSchema = z.object({
  name: z.string().min(5).max(255),
  os: z.string().min(2).max(255),
  browser: z.string().min(2).max(255),
  device_pbk: z.string().min(50).max(255)
})

export const RegistrationRequestSchema = z.strictObject({
  username: z.string().min(4).max(36).trim().toLowerCase(),
  email: z.email().trim().toLowerCase(),
  identity_pbk: z.string().length(64).regex(hexRegex, "Must be valid Hex string."),
  encryption_pbk: z.string().length(64).regex(hexRegex, "Must be valid Hex string."),
  device: DeviceSchema
})

export type RegistrationRequestPayload = z.infer<typeof RegistrationRequestSchema>

export const LoginRequestSchema = z.strictObject({
  username: z.string().min(4).max(36).trim().toLowerCase(),
  device_pbk: z.string().min(50).max(255)
})

export type LoginRequestPayload = z.infer<typeof LoginRequestSchema>