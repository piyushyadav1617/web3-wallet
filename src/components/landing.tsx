import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"


export function LandingPage() {
    const navigate = useNavigate()
    return <main className="h-dvh w-full flex items-center justify-center">
        <div className="space-y-6 w-full max-w-xs">
            <h1 className="text-5xl mb-10 font-semibold tracking-tight text-center">Welcome</h1>
            <Button size={"lg"} className="w-full" onClick={()=>navigate("/onboarding")}>Create a new wallet</Button>
            <Button size={"lg"} variant={"secondary"} className="w-full">I have an existing wallet</Button>
        </div>
    </main>
}