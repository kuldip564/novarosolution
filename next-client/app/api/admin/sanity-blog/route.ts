import { sanityFetch } from '@/lib/sanity';

export const revalidate = 0;

export async function GET() {
  try {
    const rows = await sanityFetch<Array<Record<string, any>>>(
      `*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, _updatedAt) desc) {
        _id,
        _updatedAt,
        title,
        slug,
        status,
        publishedAt
      }`
    );

    const data = Array.isArray(rows)
      ? rows.map((item) => ({
          id: String(item?._id || ''),
          title: String(item?.title || 'Untitled'),
          slug: String(item?.slug?.current || item?.slug || '').trim(),
          status: item?.status === 'published' ? 'published' : 'draft',
          publishedAt: item?.publishedAt || null,
          updatedAt: item?._updatedAt || ''
        }))
      : [];

    return Response.json({ ok: true, data });
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        message: error?.message || 'Unable to load Sanity blog posts.',
        data: []
      },
      { status: 500 }
    );
  }
}
