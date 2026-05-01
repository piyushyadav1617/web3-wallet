import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { Network } from "@/lib/keyring"
import { NetworkDropdown } from "./netowork-dropdown"

function SwapSection({
    network,
    onChange,
    onAmountChange,
    amount,
    readonly
}: {
    amount: string
    network: Network
    onChange: (network: Network) => void
    onAmountChange?: (amt: string)=>void
    readonly?: boolean
}) {

    return (
        <div className="relative transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 flex-col">
                    <input value={amount} readOnly={readonly} onChange={e => {
                        let value = e.target.value
                        value = value.replace(/[^0-9.]/g, "")
                        const parts = value.split(".")
                        if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("")
                        const [whole, decimal] = value.split(".")
                        if (decimal !== undefined) value = `${whole}.${decimal.slice(0, 9)}`
                        onAmountChange?.(value)
                    }}
                     className="text-[52px] leading-none font-light tracking-tight text-white/85 outline-none border-none"
                     placeholder="0"
                     />

                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                    <NetworkDropdown network={network} onChange={onChange} />
                    {/* <span className="text-sm text-white/50">{"33"}</span> */}
                </div>
            </div>
        </div>
    )
}

export function WalletSwapPage() {
    const [fromNetwork, setFromNetwork] = useState<Network>("bitcoin")
    const [toNetwork, setToNetwork] = useState<Network>("solana")
    const [isSwapping, setIsSwapping] = useState(false)
    const [fromAmount, setFromAmount] = useState("")

    // useEffect(()=>{
    //     setToAmount(String(Math.random()*30))
    // },[fromAmount])


    function handleSwitchSides() {
        setIsSwapping(true)
        setFromNetwork(toNetwork)
        setToNetwork(fromNetwork)

        setTimeout(() => {
            setIsSwapping(false)
        }, 300)
    }


    return (
        <div className="flex flex-col gap-4 min-h-120">
            <h1 className="text-center text-2xl tracking-tight">Swap</h1>
            <section className="relative space-y-6">
                <div
                    className={[
                        "transition-all duration-300",
                        isSwapping ? "opacity-80" : "opacity-100",
                    ].join(" ")}
                >   
               
                    <SwapSection
                        amount={fromAmount}
                        network={fromNetwork}
                        onAmountChange={amt=>setFromAmount(amt)}
                        onChange={(nw)=>{
                            if (nw === toNetwork) return;
                            setFromNetwork(nw)
                        }}
                    />
                </div>

                <div className="relative z-10">
                    <div className="relative h-px bg-border">
                        <button
                            type="button"
                            onClick={handleSwitchSides}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-muted hover:bg-primary/20 backdrop-blur-md p-3  transition-all duration-300"
                        >
                            <ArrowUpDown
                                className={[
                                    "size-4 text-muted-foreground transition-transform  duration-300",
                                    isSwapping ? "rotate-180" : "rotate-0",
                                ].join(" ")}
                            />
                        </button>
                    </div>
                </div>

                <div
                    className={[
                        "transition-all duration-300",
                        isSwapping ? "opacity-80 " : "opacity-100 ",
                    ].join(" ")}
                >
                    
                    <SwapSection
                        amount={""}
                        readonly={true}
                        network={toNetwork}
                        onChange={(nw)=>{
                            if (nw === fromNetwork) return;
                            setToNetwork(nw)
                        }}
                    />
                </div>
            </section>
            <div className= "md:mx-auto">
                <Button
                    className="w-full md:w-100"
                    size="lg"
                    variant="default"
                    disabled={fromNetwork === toNetwork}
                >
                    Swap
                </Button>
            </div>

        </div>
    )
}