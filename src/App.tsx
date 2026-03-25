import { ThemeProvider } from "./components/theme-provider"
import { ModeToggle } from "./components/theme-toggle"
import { OnboardingFlow } from "./onboarding-flow"



function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <header className="mx-auto container p-2">
        <ModeToggle/>
      </header> */}
      <OnboardingFlow/>
    </ThemeProvider>
  )
}

export default App
