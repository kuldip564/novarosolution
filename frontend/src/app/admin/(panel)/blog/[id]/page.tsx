import { BlogPostEditorPage } from "@/components/admin/BlogPostEditorPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogEditPage({ params }: PageProps) {
  const { id } = await params;
  return <BlogPostEditorPage postId={id} />;
}
