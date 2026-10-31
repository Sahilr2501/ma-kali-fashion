"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mx-auto max-w-md space-y-4 border border-[#eadfce] bg-white p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setMessage("");
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.get("username"),
            password: form.get("password"),
          }),
        });
        const data = (await response.json()) as { message?: string };
        setPending(false);
        if (!response.ok) {
          setMessage(data.message || "Sign-in failed.");
          return;
        }
        router.push(params.get("from") || "/admin");
        router.refresh();
      }}
    >
      <h1 className="font-serif text-3xl text-maroon">Admin login</h1>
      <label className="block text-sm">
        Username
        <input name="username" autoComplete="username" required className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
      </label>
      <label className="block text-sm">
        Password
        <input name="password" type="password" autoComplete="current-password" required className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
      </label>
      <button type="submit" disabled={pending} className="w-full bg-maroon py-2 text-ivory disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
      {message ? <p className="text-sm text-red-800">{message}</p> : null}
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
