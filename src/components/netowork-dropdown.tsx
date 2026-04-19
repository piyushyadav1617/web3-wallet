import type { Network } from "@/lib/keyring";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

function NetworkIcon({ network }: { network: Network }) {
  const baseClass = "size-10 shrink-0";

  switch (network) {
    case "ethereum":
      return (
        <div className={baseClass}>
          <img src="/eth_logo.svg" className="rounded-xl" />
        </div>
      );
    case "bitcoin":
      return (
        <div className={baseClass}>
          <img src="/bitcoin-logo.svg" className="rounded-xl" />
        </div>
      );
    case "solana":
      return (
        <div className={baseClass}>
          <img src="/solana-logo.svg" className="rounded-xl" />
        </div>
      );
    case "linea":
      return (
        <div className={`${baseClass} rounded-xl`}>
          <img src="/linea-logo-mainnet.svg" className="rounded-xl" />
        </div>
      );
    case "base":
      return (
        <div className={baseClass}>
          <img src="/base.svg" className="rounded-xl" />
        </div>
      );
    case "bnb":
      return (
        <div className={baseClass}>
          <img src="/bnb.svg" className="rounded-xl" />
        </div>
      );
    case "polygon":
      return (
        <div className={baseClass}>
          <img src="/pol-token.svg" className="rounded-xl" />
        </div>
      );
    case "optimism":
      return (
        <div className={baseClass}>
          <img src="/optimism.svg" className="rounded-xl" />
        </div>
      );
    case "arbitrum":
      return (
        <div className={baseClass}>
          <img src="/arbitrum.svg" className="rounded-xl" />
        </div>
      );
    case "tron":
      return (
        <div className={baseClass}>
          <img src="/tron-logo.svg" className="rounded-xl" />
        </div>
      );
    default:
      return <div className={`${baseClass} bg-muted`} />;
  }
}

type NetworkMeta = {
  name: string;
  token: string;
};

export const NETWORK_META: Record<Network, NetworkMeta> = {
  ethereum: { name: "Ethereum", token: "ETH" },
  bitcoin: { name: "Bitcoin", token: "BTC" },
  solana: { name: "Solana", token: "SOL" },
  linea: { name: "Linea", token: "LINEA" },
  base: { name: "Base", token: "BASE" },
  bnb: { name: "BNB Chain", token: "BNB" },
  polygon: { name: "Polygon", token: "MATIC" },
  optimism: { name: "Optimism", token: "OP" },
  arbitrum: { name: "Arbitrum", token: "ARB" },
  tron: { name: "Tron", token: "TRX" },
};

export const networkOptions: { key: Network; name: string; token: string }[] =
  Object.entries(NETWORK_META).map(([key, value]) => ({
    key: key as Network,
    ...value,
  }));

export function NetworkDropdown({
  network,
  onChange,
}: {
  network: Network;
  onChange: (nw: Network) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 w-40 bg-muted p-2 px-3 rounded-full group hover:bg-primary/20 backdrop-blur-3xl transition-colors">
          <NetworkIcon network={network} />
          <span className="text-base font-medium">
            {NETWORK_META[network].token}
          </span>
          <ChevronDown className="ml-auto size-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-60">
        {networkOptions.map(({ key:nw, name, token }) => (
          <DropdownMenuItem key={nw} onClick={() => onChange(nw)} className={`${nw == network && "bg-accent border-l-4 "}`}>
            <div className="flex gap-2 w-full">
              <NetworkIcon network={nw} />
              <div className={`flex flex-col`}>
                <span>{name}</span>
                <span>{token}</span>
              </div>
            </div>
            {nw == network && <Check/>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}