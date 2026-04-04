import {
  Menu, Wallet, ArrowLeftRight, QrCode,
  Settings, HelpCircle,
  Send,
  LockKeyhole,
  ArrowDownLeft,
  ArrowDownUp,
  DollarSign
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

export function WalletHomePage() {
  return (
    <main className="w-full">
      <div className="flex w-full flex-col sm:rounded-md sm:border dark:bg-card mx-auto sm:container lg:max-w-[800px] sm:my-4" >
        <header className="border-b box-border px-4 flex items-center h-[48px] sticky top-0 z-3">
          <span>Accounts</span>
          <div className="ml-auto">
            <UserDropdownMenu />
          </div>
        </header>
        <div className="flex flex-col min-h-100 max-h-[calc(100dvh-48px)] sm:max-h-[calc(100dvh-80px)] overflow-y-auto p-4">
          <div className="flex flex-row gap-2 justify-center flex-wrap">
            <Button size={"lg"} variant={"secondary"}> <ArrowDownLeft className="size-5" />Recieve</Button>
            <Button size={"lg"} variant={"secondary"}><Send />Send</Button>
            <Button size={"lg"} variant={"secondary"}><ArrowDownUp /> Swap</Button>
            <Button size={"lg"} variant={"secondary"}> <DollarSign />Buy</Button>
          </div>
         <NetworksList/>
        </div>
      </div>

    </main>
  )
}





export function UserDropdownMenu() {
  const { lock } = useWalletSession()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">

        {/* Wallet */}
        {/* <DropdownMenuLabel>My Wallet</DropdownMenuLabel> */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Wallet className="mr-2 h-4 w-4" />
            Accounts
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Swap
          </DropdownMenuItem>
          <DropdownMenuItem>
            <QrCode className="mr-2 h-4 w-4" />
            Recieve
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Send className="mr-2 h-4 w-4" />
            Send
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />


        {/* Preferences */}
        {/* <DropdownMenuLabel>Preferences</DropdownMenuLabel> */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            Support
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="" onClick={lock}>
            <LockKeyhole className="text-destructive" />
            Logout
            {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

