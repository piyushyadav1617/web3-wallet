export type OnboardingStep =
  | "password"
  | "reveal"
  | "confirm"
  | "metrics"
  | "complete"

export interface OnboardingState {
  step: OnboardingStep
  password: string
  revealed: boolean
  phrase: string[]
  metricsOptIn: boolean
}