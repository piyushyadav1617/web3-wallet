import type { Keyring } from "@/lib/keyring"
import { createContext, useContext, useMemo, useState } from "react"


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
  lock: () => void
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