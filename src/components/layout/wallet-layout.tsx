import {
    Menu, Wallet, ArrowLeftRight, QrCode,
    Settings, HelpCircle,
    Send,
    LockKeyhole,
    ChevronDown,
    Check,
    Plus,
    ChevronLeft
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
import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"

export function WalletLayout() {
    const accounts = ["Account 1"]
    const location = useLocation()
    const navigate = useNavigate()
    const [selectedAccount, setSelectedAccount] = useState(accounts[0])

    function handleAccountSelect(account: string) {
        setSelectedAccount(account)
    }

    function renderDynamicHeader() {
        switch (location.pathname) {
            case "/wallet":
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="px-0 h-auto hover:bg-transparent focus-visible:ring-0"
                            >
                                <span className="text-base font-medium">{selectedAccount}</span>
                                <ChevronDown className="ml-1 size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            {accounts.map((account) => (
                                <DropdownMenuItem
                                    key={account}
                                    onClick={() => handleAccountSelect(account)}
                                    className="flex items-center justify-between"
                                >
                                    <span>{account}</span>
                                    {selectedAccount === account ? <Check className="size-4" /> : null}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem>
                                <Button variant={"ghost"} size={"sm"} className="w-full"><Plus /> Add</Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            case "/wallet/swap":
                return (
                        <button
                            onClick={() => navigate("/wallet")}
                            className="absolute group w-10"
                        >
                            <ChevronLeft className="size-7 text-muted-foreground group-hover:-translate-x-1  group-hover:text-foreground transition-all delay-100 ease-linear" />
                        </button>
                )
            case "/wallet/send":
                return (
                    <button
                        onClick={() => navigate("/wallet")}
                        className="absolute group w-10"
                    >
                        <ChevronLeft className="size-7 text-muted-foreground group-hover:-translate-x-1  group-hover:text-foreground transition-all delay-100 ease-linear" />
                    </button>
                )
        }
    }
    return (
        <main className="w-full">
            <div className="flex w-full flex-col sm:rounded-md sm:border dark:bg-card mx-auto sm:container lg:max-w-[800px] sm:my-4" >
                <header className="border-b box-border px-4 flex items-center h-[48px] sticky rounded-t-lg top-0 z-3 backdrop-blur-md">
                    {renderDynamicHeader()}
                    <div className="ml-auto">
                        <UserDropdownMenu />
                    </div>
                </header>
                <div className="max-h-[calc(100dvh-48px)] sm:max-h-[calc(100dvh-80px)] overflow-y-auto p-4">
                    <Outlet />
                </div>
            </div>

        </main>
    )
}





export function UserDropdownMenu() {
    const { lock } = useWalletSession()
    const navigate = useNavigate()
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
                    {/* <DropdownMenuItem onClick={()=>navigate("/wallet")}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Accounts
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={()=>navigate("/wallet/swap")}>
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        Swap
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>navigate("/wallet")}>
                        <QrCode className="mr-2 h-4 w-4" />
                        Recieve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>navigate("/wallet/send")}>
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

