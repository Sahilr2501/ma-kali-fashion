import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-serif text-4xl text-maroon">Page not found</h1>
      <p className="mt-3">The page you requested is not available.</p>
      <Link href="/" className="mt-6 inline-block bg-maroon px-4 py-2 text-ivory">
        Back to home
      </Link>
    </div>
  );
}
