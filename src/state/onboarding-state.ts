import type { OnboardingState, OnboardingStep } from "./types"

export const initialOnboardingState: OnboardingState = {
  step: "password",
  password: "",
  revealed: false,
  phrase: [
    "apple", "river", "stone", "mirror",
    "green", "silent", "ocean", "yellow",
    "candle", "forest", "spirit", "mountain"
  ],
  metricsOptIn: false,
}

export function nextStep(step: OnboardingStep): OnboardingStep {
  switch (step) {
    case "password":
      return "reveal"
    case "reveal":
      return "confirm"
    case "confirm":
      return "metrics"
    case "metrics":
      return "complete"
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
    case "metrics":
      return "confirm"
    default:
      return step
  }
}