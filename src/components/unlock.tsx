import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useId, useState } from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { EyeOffIcon, EyeIcon, Unlock } from "lucide-react"
import { loadVaultRecord } from "@/lib/storage"
import { decryptVault } from "@/lib/vault"
import { useNavigate } from "react-router"
import { useWalletSession } from "@/state/session-store"
import { toast } from "sonner"
import { createInitialKeyring } from "@/lib/keyring"


const schema = z.object({
    password: z.string().min(1, "Password Needed"),
})

type FormValues = z.infer<typeof schema>

export function UnlockPage() {
    const formId = useId()
    const navigate = useNavigate()
    const {unlock} = useWalletSession()
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: "",
        }
    })
    const [show, setShow] = useState(false)

    async function onSubmit(values: FormValues) {
    try {
      const vault = await loadVaultRecord()

      if (!vault) {
        throw new Error("No wallet found")
      }
      const { mnemonic } = await decryptVault(vault, values.password)
      const keyring = await createInitialKeyring(mnemonic, 1)
      unlock(mnemonic, keyring)
      form.reset()
      navigate("/wallet")
    } catch {
      toast.error("Incorrect password or corrupted vault")
    }
    }
    return <main className="h-dvh w-full flex items-center justify-center">
        <div className="space-y-6 w-full max-w-xs">
            <h1 className="text-5xl mb-10 font-semibold tracking-tight text-center">Unlock Wallet</h1>
            <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <InputGroup className="h-11">
                                <InputGroupInput

                                    {...field}
                                    id={`${formId}-password`}
                                    type={show ? "text" : "password"}
                                    autoComplete="password"
                                    autoFocus
                                    required
                                    placeholder="Enter your password"
                                    aria-invalid={fieldState.invalid}
                                    className=""
                                />
                                <InputGroupButton className="ml-auto mr-1" onClick={() => setShow((s) => !s)}>
                                    {show ? <EyeIcon /> : <EyeOffIcon />}
                                    <span className="sr-only">Toggle password visibility</span>
                                </InputGroupButton>
                            </InputGroup>
                         
                        </Field>
                    )}
                />
                <Field className="">
                    <Button
                        type="submit"
                        size={"lg"}
                        form={formId}
                        className="w-full"
                        disabled={!form.formState.isValid || form.formState.isSubmitting}>
                        Unlock
                    </Button>
                </Field>
            </form>
            <div className="flex">
                <Button
                    variant={"link"}
                    type="button"
                    size={"lg"}
                    className="text-blue-400 mx-auto"
                >
                    Forgot password?
                </Button>
            </div>
        </div>

    </main>
}