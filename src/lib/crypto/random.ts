import { bytesToHex } from "@noble/curves/utils.js"

export function generateXBytesNonce(bytes: number): string {
  const array = new Uint8Array(bytes)
  const randomArray = crypto.getRandomValues(array)

  const nonce = bytesToHex(randomArray)

  return nonce
}