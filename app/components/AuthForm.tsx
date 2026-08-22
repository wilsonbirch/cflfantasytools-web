import { Alert, Button, Input, Label, TextField } from '@heroui/react'
import { Form, Link, useNavigation } from 'react-router'

type Props = {
    title: string
    submitLabel: string
    redirectTo: string
    error?: string
    alternate: { text: string; to: string; label: string }
}

export function AuthForm({ title, submitLabel, redirectTo, error, alternate }: Props) {
    const busy = useNavigation().state !== 'idle'
    return (
        <div className="mx-auto max-w-sm">
            <h1 className="mb-4 text-2xl font-semibold">{title}</h1>
            <Form method="post" className="flex flex-col gap-4">
                <input type="hidden" name="redirectTo" value={redirectTo} />
                {error && (
                    <Alert status="danger" role="alert">
                        <Alert.Content>
                            <Alert.Title>{error}</Alert.Title>
                        </Alert.Content>
                    </Alert>
                )}
                <TextField name="email" type="email" isRequired autoComplete="email">
                    <Label>Email</Label>
                    <Input />
                </TextField>
                <TextField
                    name="password"
                    type="password"
                    isRequired
                    minLength={8}
                    autoComplete={submitLabel === 'Log in' ? 'current-password' : 'new-password'}
                >
                    <Label>Password</Label>
                    <Input />
                </TextField>
                <Button type="submit" variant="primary" isDisabled={busy}>
                    {submitLabel}
                </Button>
            </Form>
            <p className="mt-4 text-sm text-default-500">
                {alternate.text}{' '}
                <Link to={alternate.to} className="underline">
                    {alternate.label}
                </Link>
            </p>
        </div>
    )
}
