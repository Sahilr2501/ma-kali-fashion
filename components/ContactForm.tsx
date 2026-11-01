"use client";

import { useState } from "react";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4 border border-[#eadfce] bg-white p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const formEl = event.currentTarget;
        setPending(true);
        setMessage("");
        const form = new FormData(formEl);
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.get("name"),
            email: form.get("email"),
            phone: form.get("phone"),
            message: form.get("message"),
          }),
        });
        const data = (await response.json()) as { message?: string };
        setPending(false);
        setMessage(data.message || "Something went wrong.");
        if (response.ok) formEl.reset();
      }}
    >
      <label className="block text-sm">
        Name
        <input name="name" required className="mt-1 w-full border border-[#eadfce] bg-ivory px-3 py-2" />
      </label>
      <label className="block text-sm">
        Email
        <input name="email" type="email" required className="mt-1 w-full border border-[#eadfce] bg-ivory px-3 py-2" />
      </label>
      <label className="block text-sm">
        Phone
        <input name="phone" className="mt-1 w-full border border-[#eadfce] bg-ivory px-3 py-2" />
      </label>
      <label className="block text-sm">
        Message
        <textarea name="message" required minLength={10} rows={5} className="mt-1 w-full border border-[#eadfce] bg-ivory px-3 py-2" />
      </label>
      <button type="submit" disabled={pending} className="bg-maroon px-5 py-2 text-ivory disabled:opacity-60">
        {pending ? "Sending…" : "Send message"}
      </button>
      {message ? <p className="text-sm">{message}</p> : null}
    </form>
  );
}
