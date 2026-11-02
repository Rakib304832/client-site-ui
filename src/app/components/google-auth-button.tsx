"use client"
import { Button } from "@heroui/react"
import { authClient } from "@/lib/auth-client"

export function GoogleAuthButton({ label, callbackURL }: { label: string; callbackURL: string}){
    const onPress = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL,
        })
    }
    return (
        <Button type="button" variant="secondary" className="w-full" onPress={onPress}>
            {label}
        </Button>
    )
}