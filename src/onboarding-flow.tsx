import { useState } from "react"
import { StepLayout } from "@/components/layout/step-layout"
import {
  initialOnboardingState,
  nextStep,
  prevStep,
} from "@/state/onboarding-state"
import type { OnboardingStep } from "@/state/types"
import type { Direction } from "@/lib/motion"
import { PasswordStep } from "./components/onboarding/password-step"
import { SeedPhraseStep } from "./components/onboarding/reveal-phrase-step"
import { ConfirmPhraseStep } from "./components/onboarding/confirm-phrase-step"

export function OnboardingFlow() {
  const [state, setState] = useState(initialOnboardingState)
  const [direction, setDirection] = useState<Direction>(1)

  const steps: OnboardingStep[] = [
    "password",
    "reveal",
    "confirm",
    "success",
  ]

  const currentIndex = steps.indexOf(state.step)

  function goNext() {
    setDirection(1)
    setState((s) => ({
      ...s,
      step: nextStep(s.step),
    }))
  }

  function goBack() {
    setDirection(-1)
    setState((s) => ({
      ...s,
      step: prevStep(s.step),
    }))
  }

  function renderStep() {
    switch (state.step) {
      case "password":
        return <PasswordStep
      defaultPassword={state.password}
      onContinue={(password) => {
        setDirection(1)
        setState((s) => ({ ...s, password, step: nextStep(s.step) }))
      }}
    />
      case "reveal":
        return <SeedPhraseStep
      phrase={state.phrase}
      onContinue={() => {
        setDirection(1)
        setState((s) => ({
          ...s,
          step: nextStep(s.step),
        }))
      }}
    />
      case "confirm":
        return <ConfirmPhraseStep
        phrase={state.phrase}
      onContinue={() => {
        setDirection(1)
        setState((s) => ({
          ...s,
          step: nextStep(s.step),
        }))
      }}
        />
      case "metrics":
        return <div>Metrics Step</div>
      default:
        return null
    }
  }

  function getTitle(step: OnboardingStep) {
      if (step == "password") return "Wallet Password"
      if (step == "reveal") return "Secret Recovery Phrase"
      if (step === "confirm") return "Confirm Secret Recovery Phrase"
      if (step == "complete") return "Wallet Created"
      if (step === "metrics") return "Wallet Metrics"
      return "Create Wallet"
  } 

  return (
    <StepLayout
      stepKey={state.step}
      direction={direction}
      totalSteps={steps.length}
      currentIndex={currentIndex}
      onBack={currentIndex > 0 ? goBack : undefined}
    >
      {renderStep()}
    </StepLayout>
  )
}