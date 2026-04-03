import type { VaultRecord } from "./vault"

const DB_NAME = "wallet-db"
const STORE_NAME = "kv"
const VAULT_KEY = "vault"

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveVaultRecord(vault: VaultRecord) {
  const db = await openDb()

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)

    store.put(vault, VAULT_KEY)

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export async function loadVaultRecord() {
  const db = await openDb()

  return new Promise<VaultRecord | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(VAULT_KEY)

    request.onsuccess = () => resolve((request.result as VaultRecord | undefined) ?? null)
    request.onerror = () => reject(request.error)
  })
}

export async function clearVaultRecord() {
  const db = await openDb()

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)

    store.delete(VAULT_KEY)

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}