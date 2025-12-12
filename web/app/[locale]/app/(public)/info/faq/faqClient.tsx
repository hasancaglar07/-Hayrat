'use client';

import { useState } from "react";
import clsx from "clsx";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray-100">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <button
            key={item.q}
            type="button"
            onClick={() => setOpenIndex(open ? null : index)}
            className="flex w-full flex-col gap-2 py-4 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-text-dark">{item.q}</span>
              <span className={clsx("material-symbols-outlined transition-transform", open && "rotate-45")}>add</span>
            </div>
            {open ? <p className="text-sm leading-relaxed text-text-medium">{item.a}</p> : null}
          </button>
        );
      })}
    </div>
  );
}
