import Link from "next/link";

export const metadata = { title: "Admin" };

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-serif text-4xl text-maroon">Catalogue</h1>
      <p className="mt-3 max-w-2xl text-[#5c534b]">
        Manage products and categories here. Customer orders are not stored in MongoDB. Watch the admin email inbox for new-order notifications and keep those messages.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/admin/products" className="border border-[#eadfce] bg-white p-6">
          <h2 className="font-serif text-2xl text-maroon">Products</h2>
          <p className="mt-2 text-sm">Add, edit, hide, or delete products, prices, images, and stock.</p>
        </Link>
        <Link href="/admin/categories" className="border border-[#eadfce] bg-white p-6">
          <h2 className="font-serif text-2xl text-maroon">Categories</h2>
          <p className="mt-2 text-sm">Maintain clothing, earrings, necklaces, and additional accessory groups.</p>
        </Link>
      </div>
    </div>
  );
}
