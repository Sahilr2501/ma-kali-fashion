import Image from "next/image";
import Link from "next/link";
import type { PublicCategory } from "@/lib/types";

export function CategoryCard({ category }: { category: PublicCategory }) {
  const image = category.image || "/images/placeholder.svg";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden border border-[#eadfce] focus-visible:outline-2 focus-visible:outline-gold"
    >
      <div className="relative aspect-[4/3] bg-[#efe6d8]">
        <Image src={image} alt="" fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width:768px) 100vw, 25vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 to-transparent" />
      <div className="absolute bottom-0 p-4 text-ivory">
        <h3 className="font-serif text-2xl">{category.name}</h3>
        {category.description ? <p className="mt-1 text-sm text-ivory/85">{category.description}</p> : null}
      </div>
    </Link>
  );
}
