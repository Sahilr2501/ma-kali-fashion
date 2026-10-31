"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteButton } from "./AdminActions";

type CategoryRow = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
};

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-8">
      <form
        className="grid gap-3 border border-[#eadfce] bg-white p-5 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.get("name"),
              description: form.get("description"),
              image: form.get("image"),
              isActive: true,
            }),
          });
          const data = (await response.json()) as { message?: string };
          if (!response.ok) {
            setMessage(data.message || "Could not add category.");
            return;
          }
          event.currentTarget.reset();
          router.refresh();
        }}
      >
        <label className="text-sm">
          Name
          <input name="name" required className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
        </label>
        <label className="text-sm">
          Image URL
          <input name="image" className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
        </label>
        <label className="text-sm md:col-span-2">
          Description
          <input name="description" className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
        </label>
        <button type="submit" className="bg-maroon px-4 py-2 text-ivory">
          Add category
        </button>
        {message ? <p className="text-sm text-red-800">{message}</p> : null}
      </form>

      <div className="overflow-x-auto border border-[#eadfce] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ivory">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-t border-[#eadfce]">
                <td className="px-3 py-2">{category.name}</td>
                <td className="px-3 py-2">{category.slug}</td>
                <td className="px-3 py-2">{category.isActive ? "Yes" : "No"}</td>
                <td className="px-3 py-2">
                  <form
                    className="flex flex-wrap items-end gap-2"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const form = new FormData(event.currentTarget);
                      await fetch(`/api/admin/categories/${category._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: form.get("name"),
                          description: form.get("description"),
                          image: form.get("image"),
                          isActive: form.get("isActive") === "on",
                        }),
                      });
                      router.refresh();
                    }}
                  >
                    <input name="name" defaultValue={category.name} className="border border-[#eadfce] px-2 py-1" />
                    <input name="description" defaultValue={category.description} className="border border-[#eadfce] px-2 py-1" />
                    <input name="image" defaultValue={category.image} placeholder="Image URL" className="border border-[#eadfce] px-2 py-1" />
                    <label className="flex items-center gap-1">
                      <input type="checkbox" name="isActive" defaultChecked={category.isActive} />
                      Active
                    </label>
                    <button type="submit" className="underline">
                      Save
                    </button>
                    <DeleteButton endpoint={`/api/admin/categories/${category._id}`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
