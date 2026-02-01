import * as z from "zod"

const hexRegex = /^[0-9a-fA-F]+$/;

const DeviceSchema = z.object({
  name: z.string().min(5).max(255),
  os: z.string().min(2).max(255),
  browser: z.string().min(2).max(255),
  device_pbk: z.string().min(50).max(255).regex(hexRegex, "Must be valid Hex string.")
})

export const RegistrationRequestSchema = z.strictObject({
  username: z.string().min(4).max(36).trim().toLowerCase(),
  email: z.email().trim().toLowerCase(),
  identity_pbk: z.string().length(64).regex(hexRegex, "Must be valid Hex string."),
  encryption_pbk: z.string().length(64).regex(hexRegex, "Must be valid Hex string."),
  device: DeviceSchema
})

export type RegistrationRequestPayload = z.infer<typeof RegistrationRequestSchema>

export const ChallengeRequestSchema = z.strictObject({
  username: z.string().min(4).max(36).trim().toLowerCase(),
  device_pbk: z.string().min(50).max(255)
})

export type ChallengeRequestPayload = z.infer<typeof ChallengeRequestSchema>

export const VerifyChallengeRequestSchema = z.strictObject({
  userid: z.number(),
  device_pbk: z.string().min(50).max(255),
  deviceSignature: z.string().min(50).max(255).regex(hexRegex, "Must be valid Hex string."),
  identitySignature: z.string().min(50).max(255).regex(hexRegex, "Must be valid Hex string.")
})

export type VerifyChallengeRequestPayload = z.infer<typeof VerifyChallengeRequestSchema>

export const RecoveryChallengeRequestSchema = z.strictObject({
  identity_pbk: z.string().length(64).regex(hexRegex, "Must be valid Hex string.")
})

export type RecoveryChallengeRequestPayload = z.infer<typeof RecoveryChallengeRequestSchema>

export const VerifyRecoveryChallengeRequestSchema = z.strictObject({
  userid: z.number(),
  signature: z.string().min(50).max(255).regex(hexRegex, "Must be valid Hex string."),
  device: DeviceSchema
})

export type VerifyRecoveryChallengeRequestPayload = z.infer<typeof VerifyRecoveryChallengeRequestSchema>

export const SearchUsersRequestSchema = z.strictObject({
  userid: z.number(),
  usernamePattern: z.string().min(3).max(36).trim().toLowerCase()
})

export type SearchUsersRequestPayload = z.infer<typeof SearchUsersRequestSchema>

export const UserIdParamsSchema = z.strictObject({
  userid: z.coerce.number().int().positive()
})