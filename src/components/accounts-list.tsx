import { useMemo, useState } from "react"
import {
    Search,
    Copy,
    QrCode,
    Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useWalletSession } from "@/state/session-store"
import QRCode from "react-qr-code"
import type { Network } from "@/lib/keyring"

type NetworkItem = {
    key: Network
    name: string
    address: string
}

function shortenAddress(address: string, start = 6, end = 5) {
    if (address.length <= start + end + 3) return address
    return `${address.slice(0, start)}...${address.slice(-end)}`
}

function getEvmAddress(ethAddress?: string) {
    return ethAddress ?? ""
}

function getNetworkItems(addresses: {
    ethereum?: { address: string }
    bitcoin?: { address: string }
    solana?: { address: string }
}): NetworkItem[] {
    const eth = addresses.ethereum?.address
    const btc = addresses.bitcoin?.address
    const sol = addresses.solana?.address
    return [
        { key: "ethereum", name: "Ethereum", address: getEvmAddress(eth) },
        { key: "bitcoin", name: "Bitcoin", address: btc ?? "" },
        { key: "solana", name: "Solana", address: sol ?? "" },
        { key: "linea", name: "Linea", address: getEvmAddress(eth) },
        { key: "base", name: "Base", address: getEvmAddress(eth) },
        { key: "bnb", name: "BNB Chain", address: getEvmAddress(eth) },
        { key: "polygon", name: "Polygon", address: getEvmAddress(eth) },
        { key: "optimism", name: "OP", address: getEvmAddress(eth) },
        { key: "arbitrum", name: "Arbitrum", address: getEvmAddress(eth) },
        // { key: "tron", name: "Tron", address: getEvmAddress(eth) },
    ]
}

function NetworkIcon({ network }: { network: Network }) {
    const baseClass =
        "size-10 shrink-0"

    switch (network) {
        case "ethereum":
            return (
                <div className={`${baseClass}`}>
                    <img src="/eth_logo.svg" className="rounded-xl" />
                </div>
            )
        case "bitcoin":
            return (
                <div className={`${baseClass}`}>
                    <img src="/bitcoin-logo.svg" className="rounded-xl" />
                </div>
            )
        case "solana":
            return (
                <div className={`${baseClass}`}>
                    <img src="/solana-logo.svg" className="rounded-xl" />
                </div>
            )
        case "linea":
            return (
                <div className={`${baseClass} rounded-xl `}>
                    <img src="/linea-logo-mainnet.svg" className="rounded-xl" />
                </div>
            )
        case "base":
            return (
                <div className={`${baseClass}`}>
                    <img src="/base.svg" className="rounded-xl" />

                </div>
            )
        case "bnb":
            return (
                <div className={`${baseClass}`}>
                    <img src="/bnb.svg" className="rounded-xl" />

                </div>
            )
        case "polygon":
            return (
                <div className={`${baseClass}`}>
                    <img src="/pol-token.svg" className="rounded-xl" />
                </div>
            )
        case "optimism":
            return (
                <div className={`${baseClass} b`}>
                    <img src="/optimism.svg" className="rounded-xl" />
                </div>
            )
        case "arbitrum":
            return (
                <div className={`${baseClass} b`}>
                    <img src="/arbitrum.svg" className="rounded-xl" />
                </div>
            )
        case "tron":
            return (
                <div className={`${baseClass} b`}>
                    <img src="/tron-logo.svg" className="rounded-xl" />
                </div>
            )
        default:
            return <div className={`${baseClass} bg-muted`} />
    }
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1200)
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="size-10 text-muted-foreground hover:text-foreground"
        >
            {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
        </Button>
    )
}

function QrButton({
    name,
    address,
}: {
    name: string
    address: string
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="size-10 text-muted-foreground hover:text-foreground"
            >
                <QrCode className="size-5" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{name}</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-4 py-2">
                        <div className="rounded-xl bg-white p-4">
                            <QRCode value={address} size={220} />
                        </div>

                        <div className="text-center text-sm break-all text-muted-foreground">
                            {address}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

function NetworkRow({ item }: { item: NetworkItem }) {
    return (
        <div className="flex items-center gap-4 py-6">
            <NetworkIcon network={item.key} />

            <div className="min-w-0 flex-1">
                <div className="text-xl leading-none font-medium tracking-tight">
                    {item.name}
                </div>
                <div className="mt-2 text-2xl text-muted-foreground sm:text-lg truncate">
                    {shortenAddress(item.address)}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <CopyButton value={item.address} />
                <QrButton name={item.name} address={item.address} />
            </div>
        </div>
    )
}

export function NetworksList() {
    const { keyring } = useWalletSession()
    const [query, setQuery] = useState("")

    if (!keyring || keyring.accounts.length === 0) {
        return (
            <div className="p-6 text-sm text-muted-foreground">
                No accounts available
            </div>
        )
    }

    const selectedAccount =
        keyring.accounts.find(
            (account) => account.accountIndex === keyring.selectedAccountIndex
        ) ?? keyring.accounts[0]

    const items = useMemo(() => {
        const all = getNetworkItems(selectedAccount.addresses)
        const q = query.trim().toLowerCase()

        if (!q) return all

        return all.filter(
            (item) =>
                item.name.toLowerCase().includes(q) ||
                item.address.toLowerCase().includes(q)
        )
    }, [selectedAccount, query])

    return (
        <section className="w-full">
            <div className="p-2">
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search networks"
                        className="h-20  pl-14 sm:h-14 "
                    />
                </div>

                <div className="mt-6 divide-y divide-transparent">
                    {items.map((item) => (
                        <NetworkRow key={item.key} item={item} />
                    ))}
                </div>
            </div>
        </section>
    )
}