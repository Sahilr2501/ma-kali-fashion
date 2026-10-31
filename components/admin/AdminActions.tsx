"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({
  endpoint,
  label = "Delete",
}: {
  endpoint: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      className="text-sm text-red-800 underline disabled:opacity-50"
      onClick={async () => {
        if (!confirm("Delete this item?")) return;
        setPending(true);
        const response = await fetch(endpoint, { method: "DELETE" });
        const data = (await response.json()) as { message?: string };
        setPending(false);
        if (!response.ok) {
          alert(data.message || "Delete failed.");
          return;
        }
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm underline"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Log out
    </button>
  );
}
