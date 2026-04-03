import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import { ThemeProvider } from "./components/theme-provider"
import { WalletSessionProvider, useWalletSession } from "./state/session-store"
import { loadVaultRecord } from "./lib/storage"
import { LandingPage } from "./components/landing"
import { OnboardingFlow } from "./onboarding-flow"
import { UnlockPage } from "./components/unlock"
import { WalletHomePage } from "./components/wallet"
import { useEffect, useState } from "react"
import { Toaster } from "sonner"

type BootTarget = "loading" | "wallet" | "unlock" | "onboarding"

function EntryGate() {
  const { isUnlocked } = useWalletSession()
  const [target, setTarget] = useState<BootTarget>("loading")

  useEffect(() => {
    let active = true

    async function run() {
      if (isUnlocked) {
        if (active) setTarget("wallet")
        return
      }

      const vault = await loadVaultRecord()
      if (!active) return
      setTarget(vault ? "unlock" : "onboarding")
    }

    run()

    return () => {
      active = false
    }
  }, [isUnlocked])

  if (target === "loading") return <div>Loading...</div>
  if (target === "wallet") return <Navigate to="/wallet" replace />
  if (target === "unlock") return <Navigate to="/unlock" replace />
  return <Navigate to="/landing" replace />
}
function ProtectedWalletRoute() {
  const { isUnlocked } = useWalletSession()
  return isUnlocked ? <WalletHomePage /> : <Navigate to="/unlock" replace />
}

const router = createBrowserRouter([
  { path: "/", Component: EntryGate },
  { path: "/landing", Component: LandingPage },
  { path: "/onboarding", Component: OnboardingFlow },
  { path: "/unlock", Component: UnlockPage },
  { path: "/wallet", Component: ProtectedWalletRoute },
])

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WalletSessionProvider>
        <RouterProvider router={router} />
         <Toaster />
      </WalletSessionProvider>
    </ThemeProvider>
  )
}

export default App
