const enc = new TextEncoder()
const dec = new TextDecoder()
const ITERATIONS = 250000

function bytesToB64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
}

function b64ToBytes(value: string) {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0))
}

async function deriveKey(password: string, salt: Uint8Array) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",//password based key derivation function 2
    false,
    ["deriveKey"]
  )

  const saltBuffer = new Uint8Array(salt).buffer

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt:saltBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  )
}

export type VaultRecord = {
  saltB64: string
  ivB64: string
  ciphertextB64: string
}

export async function encryptVault(
  mnemonic: string,
  password: string,
  
): Promise<VaultRecord> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(JSON.stringify({ mnemonic }))
  )

  return {
    saltB64: bytesToB64(salt),
    ivB64: bytesToB64(iv),
    ciphertextB64: bytesToB64(new Uint8Array(ciphertext)),
  }
}

export async function decryptVault(vault: VaultRecord, password: string) {
  const key = await deriveKey(password, b64ToBytes(vault.saltB64))

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBytes(vault.ivB64) },
    key,
    b64ToBytes(vault.ciphertextB64)
  )

  return JSON.parse(dec.decode(plaintext)) as { mnemonic: string }
}