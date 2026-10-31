import { Suspense } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/AdminActions";
import { getAdminSession } from "@/lib/auth";

async function AdminHeader() {
  const session = await getAdminSession();
  if (!session) return null;

  return (
    <header className="border-b border-[#eadfce] bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="font-serif text-xl text-maroon">Store admin</p>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/">View store</Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-ivory">
      <Suspense>
        <AdminHeader />
      </Suspense>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={<p>Loading admin…</p>}>{children}</Suspense>
      </div>
    </div>
  );
}
