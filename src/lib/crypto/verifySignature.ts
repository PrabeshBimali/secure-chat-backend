import { ed25519 } from "@noble/curves/ed25519.js";
import { hexToBytes } from "@noble/curves/utils.js";

export async function verifyDeviceSignature(rawKey: string, signature: string, data: string): Promise<boolean> {
  const rawKeyBytes = hexToBytes(rawKey)
  const signatureBytes = hexToBytes(signature)
  const dataBytes = hexToBytes(data)

  const device_pbk = await crypto.subtle.importKey(
    "raw",
    rawKeyBytes.buffer as ArrayBuffer,
    {
      name: "ECDSA",
      namedCurve: "P-256"
    },
    false,
    ["verify"]
  )
  
  const verified = await crypto.subtle.verify(
    {
      name: "ECDSA",
      hash: {"name": "SHA-256"}
    },
    device_pbk,
    signatureBytes.buffer as ArrayBuffer,
    dataBytes.buffer as ArrayBuffer
  )
  
  return verified
}

export function verifyIdentitySignature(rawKey: string, signature: string, data: string): boolean {
  const identityPublicKey = hexToBytes(rawKey)
  const signatureBytes = hexToBytes(signature)
  const dataBytes = hexToBytes(data)

  const verified = ed25519.verify(signatureBytes, dataBytes, identityPublicKey)

  return verified
}