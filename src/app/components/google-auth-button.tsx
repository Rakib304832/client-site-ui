"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
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
        setError(signInError.message ?? "Google sign-in failed. Please try again.");
      }
    } catch {
      setError("Google sign-in is unavailable. Check your OAuth configuration and try again.");
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
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </>
  );
}