"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function GoogleAuthButton({
  label,
  callbackURL,
  errorCallbackURL = "/login",
}: {
  label: string;
  callbackURL: string;
  errorCallbackURL?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL,
      });

      if (signInError) {
        const message =
          signInError.message ?? "Google sign-in failed. Please try again.";
        setError(message);
        toast.error(message);
      }
    } catch {
      const message =
        "Google sign-in is unavailable. Check your OAuth configuration and try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onPress={onPress}
        isDisabled={loading}
      >
        {loading ? "Connecting to Google..." : label}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </>
  );
}
