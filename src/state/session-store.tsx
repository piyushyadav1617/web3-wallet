import { createContext, useContext, useMemo, useState } from "react"
import type { KeyringState } from "./keyring"


export type SessionState = {
  isUnlocked: boolean
  mnemonic: string | null
  keyring: KeyringState | null
}

export const initialSessionState: SessionState = {
  isUnlocked: false,
  mnemonic: null,
  keyring: null,
}

type SessionContextValue = SessionState & {
  unlock: (mnemonic: string) => void
  lock: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function WalletSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(initialSessionState)

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      unlock: (mnemonic: string) => {
        setState({
          isUnlocked: true,
          mnemonic,
          keyring: null
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