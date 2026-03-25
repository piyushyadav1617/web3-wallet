import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { EyeOffIcon } from "lucide-react"

const metamaskSupportLink =
  "https://support.metamask.io/start/what-is-a-secret-recovery-phrase-and-how-to-keep-your-crypto-wallet-secure"

export function SeedPhraseStep(props: {
  phrase: string[]
  onContinue: () => void
}) {
  const [revealed, setRevealed] = useState(false)

  const columns = useMemo(() => {
    return props.phrase.length > 12 ? 4 : 3
  }, [props.phrase.length])

  return (
    <div className="h-full flex flex-col">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Secret Recovery Phrase
      </h2>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          This is your
          <a
            href={metamaskSupportLink}
            target="__blank"
            className="text-blue-400 ml-1 mr-1"
          >
            Secret Recovery Phrase.
          </a>
          Write it down in the correct order and keep it safe. If someone has
          your Secret Recovery Phrase, they can access your wallet. Don't share
          it with anyone, ever.
        </p>
      </div>

      <div className="mt-2 flex-1">
        <motion.div
          className="relative p-2 overflow-hidden "
          role={revealed ? "list" : "button"}
          aria-label={
            revealed
              ? "Secret Recovery Phrase"
              : "Secret Recovery Phrase is hidden"
          }
          onClick={() => !revealed && setRevealed(true)}
          whileTap={!revealed ? { scale: 0.99 } : undefined}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
        >
          <AnimatePresence>
            {!revealed && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 backdrop-blur-sm cursor-pointer"
              >
                <motion.div
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
                  className="flex flex-col items-center gap-2 text-muted-foreground"
                >
                  <EyeOffIcon className="size-5" />
                  <span className="text-md font-medium">Tap to reveal</span>
                  <p className="text-sm text-center max-w-55">
                    Make sure no one is watching your screen.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            animate={{ filter: revealed ? "blur(0px)" : "blur(6px)" }}
            initial={false}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={["h-full", columns === 4 ? "grid grid-cols-4 gap-2" : "grid grid-cols-3 gap-2"].join(" ")}
          >
            {props.phrase.map((word, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md border px-2 py-2 bg-muted"
              >
                <span className="w-6 text-muted-foreground tabular-nums">
                  {index + 1}.
                </span>
                <span className="font-medium">{word}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-auto pt-4">
        <motion.div
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
        >
          <Button
            className="w-full"
            size={"lg"}
            onClick={props.onContinue}
            disabled={!revealed}
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  )
}