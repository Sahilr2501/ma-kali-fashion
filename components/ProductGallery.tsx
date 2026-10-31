"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const gallery = images.length > 0 ? images : ["/images/placeholder.svg"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden border border-[#eadfce] bg-[#efe6d8]">
        <Image src={gallery[active]} alt={name} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" priority />
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 flex gap-2">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-16 overflow-hidden border ${index === active ? "border-maroon" : "border-[#eadfce]"}`}
              aria-label={`Show image ${index + 1}`}
            >
              <Image src={image} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
