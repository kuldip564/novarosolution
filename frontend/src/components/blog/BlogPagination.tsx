import Link from "next/link";

type BlogPaginationProps = {
  page: number;
  totalPages: number;
  category?: string;
};

export function BlogPagination({ page, totalPages, category }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  function href(targetPage: number) {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (category) params.set("category", category);
    return `/blog?${params}`;
  }

  return (
    <div className="blog-pagination">
      {page > 1 && (
        <Link href={href(page - 1)} className="btn btn-ghost">
          ← Previous
        </Link>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link href={href(page + 1)} className="btn btn-ghost">
          Next →
        </Link>
      )}
    </div>
  );
}
