import { motion } from "motion/react"
import { Button } from "@/components/ui/button"


export function CompletionStep(props:{
    onOpenWallet: () => void
}) {
    return (
        <div className="h-full flex flex-col">
            <h2 className="scroll-m-20 pb-2 text-5xl text-wrap font-semibold tracking-tight first:mt-0 text-center">
                Your Wallet is
            </h2>
            <h2 className="scroll-m-20 pb-2 text-5xl text-wrap font-semibold tracking-tight first:mt-0 text-center">ready!</h2>

          

            <div className="mt-auto pt-4">
                <motion.div
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
                >
                    <Button
                        className="w-full"
                        size={"lg"}
                        onClick={()=>{
                            props.onOpenWallet()
                        }}
                    >
                        Open wallet
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}