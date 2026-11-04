"use client"; 

import { Suspense, useState } from "react"; 
import Link from "next/link"; 
import { useRouter, useSearchParams } from "next/navigation"; 
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react"; 
import { authClient } from "@/lib/auth-client"; 
import { GoogleAuthButton } from "@/app/components/google-auth-button"; 
import { getSafePath } from "@/lib/redirect"; 

function LoginForm() { 
  const router = useRouter(); 
  const searchParams = useSearchParams(); 
  const from = getSafePath(searchParams.get("from"));
  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");
  const [loading, setLoading] = useState(false); 
  const [serverError, setServerError] = useState<string | null>(null); 

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setServerError(null); 
    setLoading(true); 

    const formData = new FormData(e.currentTarget); 
    const { error } = await authClient.signIn.email({ 
      email: String(formData.get("email")), 
      password: String(formData.get("password")), 
    }); 

    setLoading(false); 
    if (error) {
      setServerError(error.message ?? "Login fail"); 
      return; 
    } 
    router.push(from); 
    router.refresh(); 
  }; 

  return ( 
    <div className="flex flex-col gap-4">
    
    <div className="flex flex-col gap-4"> 
      <div>
        <h1 className="text-xl font-semibold">Sign In</h1> 
        <p className="text-sm text-slate-500">Enter your email</p> 
      </div>

      <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextField
          isRequired
          name="email"
          type="email"
          validate={(value) => { 
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) { 
              return "Please enter a valid email address"; 
            } 
            return null; 
          }}
        > 
          <Label>Email</Label> 
          <Input placeholder="m@example.com" />
          <FieldError /> 
        </TextField> 

        <TextField isRequired name="password" type="password"> 
          <Label>Password</Label> 
          <Input placeholder="password" />
          <FieldError /> 
        </TextField> 

        {serverError && <p className="text-sm text-red-600">{serverError}</p>} 
        {!serverError && oauthError && (
          <p className="text-sm text-red-600">
            {oauthErrorDescription ?? `Google sign-in failed (${oauthError}).`}
          </p>
        )}

        <Button type="submit" className="w-full bg-[#BEF452] text-black" isDisabled={loading}> 
          {loading ? "Signing in..." : "Sign In"} 
        </Button> 
      </Form> 

      <div className="flex items-center gap-2 text-xs text-slate-400"> 
        <span className="h-px flex-1 bg-slate-200" /> 
        or
        <span className="h-px flex-1 bg-slate-200" /> 
      </div> 

      <GoogleAuthButton label="Login with Google " callbackURL={from} /> 

      <p className="text-center text-sm text-slate-500">
        If you do not have acount ?{" "} 
        <Link href={`/register?from=${encodeURIComponent(from)}`} className="font-medium underline"> 
          Sign Up 
        </Link>
      </p> 
    </div>
    </div>
    
  ); 
} 


export default function LoginPage() { 
  return ( 
    <Suspense> 
      <LoginForm /> 
    </Suspense> 
  ); 
} 