import { useId, useState } from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupButton, InputGroupInput } from "../ui/input-group"
import { EyeOffIcon, EyeIcon } from "lucide-react"

const schema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters."),
        confirmPassword: z.string().min(1, "Please confirm your password."),
        acknowledge: z.boolean().refine((v) => v === true, {
            message: "You must acknowledge password recovery limitations.",
        }),
    })
    .refine((d) => d.password === d.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    })

type FormValues = z.infer<typeof schema>

export function PasswordStep(props: {
    defaultPassword?: string
    onContinue: (password: string) => void
}) {
    const formId = useId()
    const [show, setShow] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: props.defaultPassword ?? "",
            confirmPassword: "",
            acknowledge: false,
        }
    })

    function onSubmit(values: FormValues) {
        props.onContinue(values.password)
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                
                Wallet Password</h2>
            <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    {/* Password */}
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`${formId}-password`}>Create new password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={`${formId}-password`}
                                        type={show ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <InputGroupButton className="ml-auto mr-1" onClick={() => setShow((s) => !s)}>
                                        {show ? <EyeIcon /> : <EyeOffIcon />}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </InputGroupButton>
                                </InputGroup>
                                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                            </Field>
                        )}
                    />

                    {/* Confirm */}
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`${formId}-confirm`}>Confirm password</FieldLabel>

                                <Input
                                    {...field}
                                    id={`${formId}-confirm`}
                                    type={show ? "text" : "password"}        // native semantics
                                    autoComplete="new-password"
                                    required
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Repeat password"
                                />


                                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}

                            </Field>
                        )}
                    />

                    {/* Acknowledge */}
                    <Controller
                        name="acknowledge"
                        control={form.control}
                        render={({ field, fieldState }) => (

                            <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    id={`${formId}-ack`}
                                />
                                <FieldContent>
                                    <FieldLabel htmlFor={`${formId}-ack`}>
                                        If I lose this password, the wallet cannot reset it.
                                    </FieldLabel>
                                    {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                </FieldContent>
                            </Field>

                        )}
                    />
                </FieldGroup>
            </form>
            <Field className="mt-auto">
                <Button
                    type="submit"
                    size={"lg"}
                    form={formId}
                    className="w-full"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}>
                    Save
                </Button>
            </Field>
        </div>
    )
}




