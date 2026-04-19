import { useId, useState } from "react"
import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { NetworkDropdown } from "./netowork-dropdown"
import type { Network } from "@/lib/keyring"

const sendSchema = z.object({
    recipient: z
        .string()
        .trim()
        .min(1, "Recipient is required.")
        .refine(
            (v) =>
                v.length >= 32 ||
                /^[a-zA-Z0-9_.-]+$/.test(v),
            "Enter a valid address or name."
        ),
    amount: z
        .string()
        .trim()
        .min(1, "Amount is required.")
        .refine((v) => !Number.isNaN(Number(v)), "Amount must be a number.")
        .refine((v) => Number(v) >= 0, "Amount cannot be negative."),
})

type SendFormValues = z.infer<typeof sendSchema>

export function WalletSendPage() {
    const navigate = useNavigate()
    const formId = useId()

    const form = useForm<SendFormValues>({
        resolver: zodResolver(sendSchema),
        defaultValues: {
            recipient: "",
            amount: "",
        },
        mode: "onTouched",
    })
    const [selectedNetwork, setSelectedNetwork] = useState<Network>("ethereum")

    const recipient = form.watch("recipient")
    const amount = form.watch("amount")

    const parsedAmount = Number(amount || 0)
    const fiatValue = Number.isFinite(parsedAmount) ? parsedAmount * 0 : 0
    const availableBalance = 0

    function onSubmit(values: SendFormValues) {
        console.log("send form", values)
    }

    return (

        <div className="flex flex-col gap-4 min-h-120">
            <h1 className="text-center text-2xl tracking-tight">Send</h1>
            <div className="flex flex-col items-center">
                <NetworkDropdown onChange={(n)=>setSelectedNetwork(n)} network={selectedNetwork}/>
            </div>
            <form
                id={formId}
                onSubmit={form.handleSubmit(onSubmit)}
                className=""
            >
                <FieldGroup className="">
                    <Controller
                        name="recipient"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`${formId}-recipient`} className="">
                                    To
                                </FieldLabel>
                                <InputGroup className="h-12">
                                    <InputGroupInput
                                        {...field}
                                        id={`${formId}-recipient`}
                                        placeholder="Enter or paste an address"
                                        autoComplete="off"
                                        spellCheck={false}
                                        aria-invalid={fieldState.invalid}
                                        className=""
                                    />
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="" />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="amount"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`${formId}-amount`} className="">
                                    Amount
                                </FieldLabel>

                                <InputGroup className="h-12">
                                    <InputGroupInput
                                        {...field}
                                        id={`${formId}-amount`}
                                        inputMode="decimal"
                                        type="text"
                                        onChange={(e) => {
                                            let value = e.target.value
                                            value = value.replace(/[^0-9.]/g, "")
                                            const parts = value.split(".")
                                            if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("")

                                            const [whole, decimal] = value.split(".")
                                            if (decimal !== undefined) value = `${whole}.${decimal.slice(0, 9)}`

                                            field.onChange(value)
                                        }}
                                        placeholder="0"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="" />}
                            </Field>
                        )}
                    />
                </FieldGroup>
                
            </form>
            <div className="lg:mx-auto">
                    <Button
                        type="button"
                        form={formId}
                        variant={"default"}
                        size="lg"
                        className="w-full lg:w-100  mt-10"
                        disabled={
                            !form.formState.isValid ||
                            form.formState.isSubmitting ||
                            !recipient.trim() ||
                            !amount
                        }
                    >
                        Continue
                    </Button>
                </div>
        </div>
    )
}