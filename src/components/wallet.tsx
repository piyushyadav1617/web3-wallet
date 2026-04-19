import {
  Menu, Wallet, ArrowLeftRight, QrCode,
  Settings, HelpCircle,
  Send,
  LockKeyhole,
  ArrowDownLeft,
  ArrowDownUp,
  DollarSign,
  ChevronDown,
  Check,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWalletSession } from "@/state/session-store"
import { NetworksList } from "./accounts-list"
import { useNavigate } from "react-router"

export function WalletHomePage() {
  const navigate = useNavigate()

  return (
        <div>
          <div className="flex flex-row gap-2 justify-center flex-wrap">
            {/* <Button size={"lg"} variant={"secondary"}> <ArrowDownLeft className="size-5" />Recieve</Button> */}
            <Button size={"lg"} variant={"secondary"} onClick={()=>navigate("/wallet/send")}><Send />Send</Button>
            <Button size={"lg"} variant={"secondary"} onClick={()=>navigate("/wallet/swap")}><ArrowDownUp /> Swap</Button>
            <Button size={"lg"} variant={"secondary"} onClick={()=>{
              window.open("https://binance.com", "noopener,noreferrer");
            }}> <DollarSign />Buy</Button>
          </div>
         <NetworksList/>
        </div>
  )
}

