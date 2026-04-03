import {
  Menu, Wallet, ArrowLeftRight, QrCode,
  Settings, HelpCircle,
  Send,
  LockKeyhole
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function WalletHomePage() {
    return (
        <main className="w-full">
            <div className="flex w-full flex-col sm:rounded-md bg-card mx-auto sm:max-w-[720px] sm:my-4" >
                <header className="border-b box-border px-4 flex items-center h-[48px] sticky top-0 z-3">
                    <span>Wallet</span>
                    <div className="ml-auto">
                    <UserDropdownMenu/>
                    </div>
                </header>
                <div className="flex flex-col min-h-100 max-h-[calc(100dvh-48px)] sm:max-h-[calc(100dvh-80px)] overflow-y-auto p-4">
               
                </div>
            </div>

        </main>
    )
}



import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWalletSession } from "@/state/session-store"

export function UserDropdownMenu() {
  const {lock} = useWalletSession()
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
            Portfolio
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Swap
          </DropdownMenuItem>
          <DropdownMenuItem>
            <QrCode className="mr-2 h-4 w-4" />
            Receive
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

