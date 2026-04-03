import { type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { stepVariants, stepTransition, type Direction } from "@/lib/motion"
import { ProgressDots } from "./progress-dots"
import { ChevronLeft } from "lucide-react"

interface StepLayoutProps {
  stepKey: string
  direction: Direction
  totalSteps: number
  currentIndex: number
  onBack?: () => void
  children: ReactNode
}

export function StepLayout({
  stepKey,
  direction,
  totalSteps,
  currentIndex,
  onBack,
  children,
}: StepLayoutProps) {
  return (
    <div className="flex h-screen relative justify-center items-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="">
          <div className="flex flex-row items-center">
            {onBack && (
              <button
                onClick={onBack}
                className="absolute group w-10"
              >
                <ChevronLeft className="size-7 text-muted-foreground group-hover:-translate-x-1  group-hover:text-foreground transition-all delay-100 ease-linear" />
              </button>
            )
            }
            <div className="relative mx-auto">
              <ProgressDots total={totalSteps} currentIndex={currentIndex} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex h-130 flex-col">
          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={stepKey}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}