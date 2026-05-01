import { createContext, useContext, useMemo, useState } from "react"
import { addNewAccount, type Keyring, keyringToMeta } from "@/lib/keyring"
import { saveKeyringMeta } from "@/lib/storage"


export type SessionState = {
  isUnlocked: boolean
  mnemonic: string | null
  keyring: Keyring | null
}

export const initialSessionState: SessionState = {
  isUnlocked: false,
  mnemonic: null,
  keyring: null,
}

type SessionContextValue = SessionState & {
  unlock: (mnemonic: string, keyring: Keyring) => void
  lock: () => void,
  addAccount: () => Promise<void>
  setSelectedAccountIndex: (index: number) => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function WalletSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(initialSessionState)

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      unlock: (mnemonic: string, keyring: Keyring) => {
        setState({
          isUnlocked: true,
          mnemonic,
          keyring: keyring
        })
      },
      lock: () => {
        setState(initialSessionState)
      },
      addAccount: async () => {
        if (!state.mnemonic || !state.keyring) return

        const updatedKeyring = await addNewAccount(
          state.mnemonic,
          state.keyring
        )

        await saveKeyringMeta(keyringToMeta(updatedKeyring))

        setState((prev) => ({
          ...prev,
          keyring: updatedKeyring,
        }))
      },
      setSelectedAccountIndex: async (index: number) => {
        if (!state.keyring) return

        const exists = state.keyring.accounts.some(
          (acc) => acc.accountIndex === index
        )

        if (!exists) return

        const updatedKeyring = {
          ...state.keyring,
          selectedAccountIndex: index,
        }

        await saveKeyringMeta(keyringToMeta(updatedKeyring))

        setState((prev) => ({
          ...prev,
          keyring: updatedKeyring,
        }))
      }
    }),
    [state]
  )

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

export function useWalletSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within SessionProvider")
  }

  return context
}