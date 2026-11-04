"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { toast } from "sonner";
import SafeImage from "@/app/components/SafeImage";
import { GoogleAuthButton } from "@/app/components/google-auth-button";
import { authClient } from "@/lib/auth-client";
import { getSafePath } from "@/lib/redirect";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = getSafePath(searchParams.get("from"));
  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const { error } = await authClient.signUp.email({
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      image: image.trim() || undefined,
    });

    setLoading(false);
    if (error) {
      const message =
        error.message ?? "We could not create your account. Please try again.";
      setServerError(message);
      toast.error(message);
      return;
    }

    toast.success("Account created. Sign in to start booking studios.");
    router.push(`/login?from=${encodeURIComponent(from)}`);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Save spaces, manage bookings, and list your own studio.
        </p>
      </div>

      <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextField isRequired name="name" autoComplete="name">
          <Label>Name</Label>
          <Input placeholder="Your name" />
          <FieldError />
        </TextField>

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
          <Input placeholder="john@example.com" />
          <FieldError />
        </TextField>

        <TextField
          name="image"
          type="url"
          value={image}
          onChange={setImage}
          validate={(value) => {
            if (value && !/^(https?:\/\/|\/)/i.test(value.trim())) {
              return "Photo URL must start with http:// or https://";
            }
            return null;
          }}
        >
          <Label>Photo URL (optional)</Label>
          <Input placeholder="https://i.ibb.co.com/your-photo.jpg" />
          <FieldError />
        </TextField>

        {image.trim() && /^(https?:\/\/|\/)/i.test(image.trim()) ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-current/15">
            <SafeImage
              src={image.trim()}
              alt="Profile preview"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : null}

        <TextField
          isRequired
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          minLength={6}
          validate={(value) => {
            if (value.length < 6) {
              return "Password must be at least 6 characters";
            }
            if (!/[A-Z]/.test(value)) {
              return "Password must contain at least one uppercase letter";
            }
            if (!/[a-z]/.test(value)) {
              return "Password must contain at least one lowercase letter";
            }
            return null;
          }}
        >
          <Label>Password</Label>
          <Input placeholder="At least 6 characters" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
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
          className="w-full bg-[#BEF452] text-black"
          isDisabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </Form>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
        or
        <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
      </div>

      <GoogleAuthButton
        label="Sign up with Google"
        callbackURL={from}
        errorCallbackURL="/register"
      />

      <p className="text-center text-sm text-slate-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href={`/login?from=${encodeURIComponent(from)}`}
          className="font-semibold text-black underline underline-offset-4 dark:text-white"
        >
          Sign in
        </Link>
      </p>
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
