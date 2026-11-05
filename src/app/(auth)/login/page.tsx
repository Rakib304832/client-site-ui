"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { toast } from "sonner";
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

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const { error } = await authClient.signIn.email({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });

      if (error) {
        const message =
          error.message ?? "Login failed. Check your details and try again.";
        setServerError(message);
        toast.error(message);
        if (
          message.toLowerCase().includes("invalid") ||
          message.toLowerCase().includes("credentials") ||
          message.toLowerCase().includes("not found")
        ) {
          toast.info(
            "If you signed up with Google, use 'Login with Google' instead, or create a new account.",
          );
        }
        return;
      }

      toast.success("Welcome back. Your studio desk is ready.");
      router.push(from);
      router.refresh();
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : "Login failed. Check your details and try again.";
      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  function forgotPassword() {
    toast.info(
      "Password reset is disabled for this demo. Use the demo credentials or create a new account.",
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Sign in to manage your bookings and listings.
        </p>
      </div>

      <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextField
          isRequired
          name="email"
          type="email"
          autoComplete="email"
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

        <TextField
          isRequired
          name="password"
          type="password"
          autoComplete="current-password"
        >
          <Label>Password</Label>
          <Input placeholder="Enter your password" />
          <FieldError />
        </TextField>

        <div className="-mt-1 flex justify-end">
          <button
            type="button"
            onClick={forgotPassword}
            className="text-xs font-medium text-slate-500 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            Forgot password?
          </button>
        </div>

        {serverError && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {serverError}
          </p>
        )}
        {!serverError && oauthError && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {oauthErrorDescription ?? `Google sign-in failed (${oauthError}).`}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-500 text-black"
          isDisabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </Form>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
        or
        <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
      </div>

      <GoogleAuthButton label="Login with Google" callbackURL={from} />

      <p className="text-center text-sm text-slate-500 dark:text-zinc-400">
        New to StudioSpace?{" "}
        <Link
          href={`/register?from=${encodeURIComponent(from)}`}
          className="font-semibold text-black underline underline-offset-4 dark:text-white"
        >
          Create an account
        </Link>
      </p>
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
