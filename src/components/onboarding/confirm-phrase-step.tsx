import { useEffect, useMemo, useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { generateRandomIndices, shuffleArray } from "@/lib/utils"

export function ConfirmPhraseStep({phrase, onContinue}: {
  phrase: string[],
  isSaving:boolean,
  error: string | null
  onContinue: () => void
}) {

  const columns = useMemo(() => {
    return phrase.length > 12 ? 4 : 3
  }, [phrase.length])
  const [copiedPhrase, setCopiedPhrase] = useState<string[]>([])
  const [currIndex, setCurrIndex] = useState(0)
  const [shuffledWords, setShuffledWords] = useState<string[]>([])
  const [randomIndices, setRandomIndices] = useState<number[]>([])
  const [openPerfectAlert, setOpenPerfectAlert] = useState(false)
  const [openErrorAlert, setOpenErrorAlert] = useState(false)

  function initialize(){
    const random = generateRandomIndices(phrase.length, 3)
    setRandomIndices(random)
    setCurrIndex(0)
    const copied:string[] = []
    const shuffled:string[] = []
    phrase.forEach((word, i)=>{
        if (random.includes(i)){
           shuffled.push(word)
           copied.push("")
        }else{
          copied.push(word)
        }
     })
    setCopiedPhrase(copied);
    setShuffledWords(shuffleArray(shuffled));
  }
  useEffect(()=>{
    initialize()
  },[])

  function handleclick(word:string){
    if (currIndex > 2) return
    const currRandom = randomIndices[currIndex]
    const copied = [...copiedPhrase];
    copied[currRandom] = word;
    setCopiedPhrase(copied)
    setCurrIndex(curr=>curr + 1)
  }

  function errorAction(){
    initialize()
  }

  return (
    <div className="h-full flex flex-col">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Confirm Secret Recovery Phrase
      </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
           Select the missing words in the correct order.
        </p>

      <div className="mt-2 flex-1">
        <motion.div
          className="relative p-2 overflow-hidden"
          aria-label={
            "Secret Recovery Phrase is hidden"
          }
        >

          <motion.div
            initial={false}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={[ "h-full", columns === 4? "grid grid-cols-4 gap-2" : "grid grid-cols-3 gap-2"].join(" ")}
          >
            {copiedPhrase.map((word, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 rounded-md border px-2 py-2  ${randomIndices[currIndex] == index && "ring-1 ring-primary"} ${randomIndices.includes(index) ? "bg-background": "bg-muted"}`}
              >
                <span className="w-6 text-muted-foreground tabular-nums">
                  {index + 1}.
                </span>
                {randomIndices.includes(index)? 
                <span className="font-medium">{word}</span> : 
                <span className="font-medium">...</span>
                }
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="grid grid-cols-3 p-2 gap-2">
        {shuffledWords.map((word)=>{
          return <button 
            key={word} 
            className="rounded-md bg-muted p-2 text-center"
            onClick={()=>handleclick(word)}
            > 
                <span className="font-medium">{word}</span>
          </button>
        })}
      </div>

      <div className="mt-auto pt-4">
        <motion.div
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
        >
          <Button
            className="w-full"
            size={"lg"}
            onClick={()=>{
              if (copiedPhrase.join(" ") === phrase.join(" ")){
                setOpenPerfectAlert(true)
              }else{
                 setOpenErrorAlert(true)
              }
            }}
            disabled={currIndex != randomIndices.length}

          >
            Continue
          </Button>
        </motion.div>
      <PerfectAlert open={openPerfectAlert} onOpenChange={setOpenPerfectAlert} action={onContinue}/>
      <ErrorAlert open={openErrorAlert} onOpenChange={setOpenErrorAlert} action={errorAction}/>
      </div>
    </div>
  )
}


import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, X } from "lucide-react"

interface AlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: (...args: any)=>void
}

export function PerfectAlert({ open, onOpenChange, action }: AlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
        <AlertDialogMedia className="bg-green-500 text-green-800 dark:bg-green-400">
            <CheckCircle2 />
        </AlertDialogMedia>

        <AlertDialogTitle>
          Perfect
        </AlertDialogTitle>

        <AlertDialogDescription>
          That's right! And remember: never share this phrase with anyone, ever.
        </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
           <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={action}>
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

import {
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog"

export function ErrorAlert({ open, onOpenChange, action }: AlertProps){
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <X />
          </AlertDialogMedia>
          <AlertDialogTitle>
            Not quite right
          </AlertDialogTitle>
          <AlertDialogDescription>
           Double-check your Secret Recovery Phrase and try again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
           <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="default" onClick={action}>Try again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}



