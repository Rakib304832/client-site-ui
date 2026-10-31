"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { GoogleAuthButton } from "@/app/components/google-auth-button";
import { getSafePath } from "@/lib/redirect";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = getSafePath(searchParams.get("from"));
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const { error } = await authClient.signUp.email({
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });

    setLoading(false);
    if (error) {
      setServerError(error.message ?? "no acount found");
      return;
    }
    router.push(from);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
 
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-semibold">Sign Up</h1>
            <p className="text-sm text-slate-500">Create a new account</p>
          </div>

          <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <TextField isRequired name="name">
              <Label>Name</Label>
              <Input placeholder="Your name" />
              <FieldError />
            </TextField>

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
              <Input placeholder="john@example.com" />
              <FieldError />
            </TextField>

            <TextField
              isRequired
              name="password"
              type="password"
              value={password}
              onChange={setPassword}
              minLength={8}
              validate={(value) => {
                if (value.length < 8) {
                  return "Password must be at least 8 characters";
                }
                if (!/[A-Z]/.test(value)) {
                  return "Password must contain at least one uppercase letter";
                }
                if (!/[0-9]/.test(value)) {
                  return "Password must contain at least one number";
                }
                return null;
              }}
            >
              <Label>Password</Label>
              <Input placeholder="Enter your password" />
              <FieldError />
            </TextField>

            <TextField
              isRequired
              name="confirmPassword"
              type="password"
              validate={(value) => {
                if (value !== password) {
                  return "Passwords do not match";
                }
                return null;
              }}
            >
              <Label>Confirm Password</Label>
              <Input placeholder="Re-enter your password" />
              <FieldError />
            </TextField>

            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

            <Button type="submit" className="w-full bg-[#BEF452] text-black" isDisabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </Form>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            Or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleAuthButton label="Sign up with Google" callbackURL={from} />

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href={`/login?from=${encodeURIComponent(from)}`}
              className="font-medium underline "
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
