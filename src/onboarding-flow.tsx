import { useReducer, useState } from "react"
import { StepLayout } from "@/components/layout/step-layout"
import {
  initialOnboardingState,
  onboardingReducer,
  type OnboardingStep,
} from "@/state/onboarding-reducer"
import type { Direction } from "@/lib/motion"
import { PasswordStep } from "@/components/onboarding/password-step"
import { SeedPhraseStep } from "@/components/onboarding/reveal-phrase-step"
import { ConfirmPhraseStep } from "@/components/onboarding/confirm-phrase-step"
import { CompletionStep } from "@/components/onboarding/completion-step"
import { generateNewMnemonic } from "./lib/mnemonic"
import { encryptVault } from "./lib/vault"
import { saveVaultRecord } from "./lib/storage"
import { useNavigate } from "react-router"
import { useWalletSession } from "./state/session-store"
import { createInitialKeyring } from "./lib/keyring"

export function OnboardingFlow() {
  const [state, dispatch] = useReducer(
    onboardingReducer,
    initialOnboardingState
  )
  const { unlock } = useWalletSession()
  const navigate = useNavigate()
  const [direction, setDirection] = useState<Direction>(1)

  const steps: OnboardingStep[] = [
    "password",
    "reveal",
    "confirm",
    "completion",
  ]

  const currentIndex = steps.indexOf(state.ui.step)

  function goBack() {
    setDirection(-1)
    dispatch({ type: "PREV_STEP" })
  }

  function handlePasswordContinue(password: string) {
    const mnemonic = generateNewMnemonic()

    dispatch({ type: "SET_PASSWORD_INPUT", password })
    dispatch({ type: "SET_MNEMONIC", mnemonic })

    setDirection(1)
    dispatch({ type: "NEXT_STEP" })
  }

  async function handleConfirmContinue() {
    try {
      dispatch({ type: "SET_SAVING", value: true })
      dispatch({ type: "SET_ERROR", error: null })

      const vault = await encryptVault(
        state.draft.mnemonic,
        state.draft.passwordInput
      )
      await saveVaultRecord(vault)
      setDirection(1)
      dispatch({ type: "NEXT_STEP" })
    } catch {
      dispatch({ type: "SET_ERROR", error: "Failed to create wallet vault" })
    } finally {
      dispatch({ type: "SET_SAVING", value: false })
    }
  }

  async function handleOpenNewWallet(){
      const mnemonic = state.draft.mnemonic
      const keyring = createInitialKeyring(mnemonic, 1)
      unlock(mnemonic, keyring)
      dispatch({type: "CLEAR_DRAFT"})
      navigate("/wallet")
  }

  function renderStep() {
    switch (state.ui.step) {
      case "password":
        return <PasswordStep
          defaultPassword={state.draft.passwordInput}
          onContinue={handlePasswordContinue}
        />
      case "reveal":
        return <SeedPhraseStep
          phrase={state.draft.mnemonic.split(" ").filter(Boolean)}
          onContinue={() => {
            setDirection(1)
            dispatch({ type: "NEXT_STEP" })
          }}
        />
      case "confirm":
        return <ConfirmPhraseStep
          phrase={state.draft.mnemonic.split(" ").filter(Boolean)}
          isSaving={state.ui.isSaving}
          error={state.ui.error}
          onContinue={handleConfirmContinue}
        />
      case "completion":
        return <CompletionStep onOpenWallet={handleOpenNewWallet} />
      default:
        return null
    }
  }

  return (
    <StepLayout
      stepKey={state.ui.step}
      direction={direction}
      totalSteps={steps.length}
      currentIndex={currentIndex}
      onBack={currentIndex === 0 ? () => navigate("/landing") : currentIndex != 1 && currentIndex < steps.length - 1 ? goBack : undefined}
    >
      {renderStep()}
    </StepLayout>
  )
}