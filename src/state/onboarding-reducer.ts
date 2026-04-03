export type OnboardingStep =
  | "password"
  | "reveal"
  | "confirm"
  | "completion"

export type OnboardingUiState = {
  step: OnboardingStep
  revealed: boolean
  isSaving: boolean
  error: string | null
}

export type OnboardingDraftState = {
  passwordInput: string
  mnemonic: string
}

export type OnboardingState = {
  ui: OnboardingUiState
  draft: OnboardingDraftState
}

export type OnboardingAction =
  | { type: "SET_PASSWORD_INPUT"; password: string }
  | { type: "SET_MNEMONIC"; mnemonic: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_REVEALED"; value: boolean }
  | { type: "SET_SAVING"; value: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "CLEAR_DRAFT" }
  | { type: "RESET_ONBOARDING" }

export const initialOnboardingUiState: OnboardingUiState = {
  step: "password",
  revealed: false,
  isSaving: false,
  error: null,
}

export const initialOnboardingDraftState: OnboardingDraftState = {
  passwordInput: "",
  mnemonic: "",
}

export const initialOnboardingState: OnboardingState = {
  ui: initialOnboardingUiState,
  draft: initialOnboardingDraftState,
}

export function nextStep(step: OnboardingStep): OnboardingStep {
  switch (step) {
    case "password":
      return "reveal"
    case "reveal":
      return "confirm"
    case "confirm":
      return "completion"
    default:
      return step
  }
}

export function prevStep(step: OnboardingStep): OnboardingStep {
  switch (step) {
    case "reveal":
      return "password"
    case "confirm":
      return "reveal"
    case "completion":
      return "confirm"
    default:
      return step
  }
}

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "SET_PASSWORD_INPUT":
      return {
        ...state,
        draft: {
          ...state.draft,
          passwordInput: action.password,
        },
      }

    case "SET_MNEMONIC":
      return {
        ...state,
        draft: {
          ...state.draft,
          mnemonic: action.mnemonic,
        },
      }

    case "NEXT_STEP":
      return {
        ...state,
        ui: {
          ...state.ui,
          step: nextStep(state.ui.step),
          error: null,
        },
      }

    case "PREV_STEP":
      return {
        ...state,
        ui: {
          ...state.ui,
          step: prevStep(state.ui.step),
          error: null,
        },
      }

    case "SET_REVEALED":
      return {
        ...state,
        ui: {
          ...state.ui,
          revealed: action.value,
        },
      }

    case "SET_SAVING":
      return {
        ...state,
        ui: {
          ...state.ui,
          isSaving: action.value,
        },
      }

    case "SET_ERROR":
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.error,
        },
      }

    case "CLEAR_DRAFT":
      return {
        ...state,
        draft: initialOnboardingDraftState,
      }

    case "RESET_ONBOARDING":
      return initialOnboardingState

    default:
      return state
  }
}