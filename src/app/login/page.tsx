"use client"
import { useRouter, useSearchParams } from "next/navigation"

export default function  LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    async function handleLogion(){
        const res = await fetch("/api/login", { method: "POST"})
        if (res.ok) return;
        const from = searchParams.get("from") ?? "/";
        const safe = from.startsWith("/") && !from.startsWith('//')? from : "/";
        router.push(safe);
        router.refresh()
    }
    return <button onClick={handleLogion}>Login</button>

    
}