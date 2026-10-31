import Link from "next/link";
import { DeleteButton } from "@/components/admin/AdminActions";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { formatINR } from "@/lib/format";
import { Product } from "@/models/Product";
import { redirect } from "next/navigation";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  if (!(await requireAdmin())) redirect("/admin/login");
  await connectDB();
  const products = await Product.find({}).populate("categoryId", "name").sort({ updatedAt: -1 }).lean();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-4xl text-maroon">Products</h1>
        <Link href="/admin/products/new" className="bg-maroon px-4 py-2 text-ivory">
          Add product
        </Link>
      </div>
      <div className="overflow-x-auto border border-[#eadfce] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ivory">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={String(product._id)} className="border-t border-[#eadfce]">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{formatINR(product.price)}</td>
                <td className="px-3 py-2">{product.stock}</td>
                <td className="px-3 py-2">{product.isActive ? "Yes" : "No"}</td>
                <td className="flex gap-3 px-3 py-2">
                  <Link href={`/admin/products/${String(product._id)}`} className="underline">
                    Edit
                  </Link>
                  <DeleteButton endpoint={`/api/admin/products/${String(product._id)}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
