"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type BlogFiltersProps = {
  categories: string[];
  activeCategory?: string;
};

export function BlogFilters({ categories, activeCategory }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setCategory(category?: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (category) params.set("category", category);
    else params.delete("category");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="blog-filters">
      <button
        type="button"
        className={!activeCategory ? "active" : undefined}
        onClick={() => setCategory()}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={activeCategory === category ? "active" : undefined}
          onClick={() => setCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
