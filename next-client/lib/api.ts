import { sanityFetch } from '@/lib/sanity';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$/, '');

export type Project = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  category?: string;
  tech?: string[];
  client?: string;
  year?: string;
  status?: string;
  timeline?: string;
  projectLink?: string;
  results?: string[];
  challenge?: string;
  solution?: string;
};

export type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  authorName?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
};

type FetchCacheMode = {
  revalidate?: number;
  noStore?: boolean;
};

type SiteContentShape = {
  hero?: {
    titleMain?: string;
    description?: string;
  };
  projectsPage?: {
    items?: Array<Record<string, unknown>>;
  };
} & Record<string, unknown>;

function slugify(input: string) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function requestJson<T>(path: string, cacheMode: FetchCacheMode = { revalidate: 300 }) {
  const requestInit: RequestInit & { next?: { revalidate: number } } = {};
  if (cacheMode.noStore) {
    requestInit.cache = 'no-store';
  } else {
    requestInit.next = { revalidate: cacheMode.revalidate ?? 300 };
  }

  const response = await fetch(`${API_URL}${path}`, requestInit);
  if (!response.ok) {
    throw new Error(`API request failed (${response.status}) for ${path}`);
  }
  return (await response.json()) as T;
}

async function requestClientJson<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, init);
  const rawBody = await response.text();
  let payload: unknown = {};
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }
  }
  if (!response.ok) {
    throw new Error((payload as { message?: string })?.message || `Request failed: ${response.status}`);
  }
  return payload as T;
}

export async function fetchSiteContent(cacheMode: FetchCacheMode = { revalidate: 180 }) {
  const payload = await requestJson<{ ok: boolean; data: SiteContentShape }>('/api/site-content', cacheMode);
  if (!payload?.ok || !payload?.data) {
    throw new Error('Invalid site content payload.');
  }
  return payload.data;
}

export async function submitContactForm(payload: Record<string, string>, token: string) {
  return requestClientJson('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
}

export async function createServiceAppointment(payload: Record<string, string>, token: string) {
  return requestClientJson('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
}

function mapProject(item: Record<string, any>, index: number): Project {
  const title = String(item?.name || item?.title || `Project ${index + 1}`);
  return {
    _id: String(item?._id || item?.id || `project-${index + 1}`),
    title,
    slug: slugify(String(item?.slug || title)),
    description: String(item?.summary || item?.description || ''),
    imageUrl: typeof item?.image === 'string' ? item.image : undefined,
    category: item?.category,
    tech: Array.isArray(item?.tech) ? item.tech.filter(Boolean) : [],
    client: item?.client,
    year: item?.year,
    status: item?.status,
    timeline: item?.timeline,
    projectLink: item?.projectLink,
    results: Array.isArray(item?.results) ? item.results.filter(Boolean) : [],
    challenge: item?.challenge,
    solution: item?.solution
  };
}

export async function getProjects(cacheMode: FetchCacheMode = { revalidate: 300 }) {
  try {
    const content = await fetchSiteContent(cacheMode);
    const items = Array.isArray(content?.projectsPage?.items) ? content.projectsPage.items : [];
    return items.map(mapProject);
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string, cacheMode: FetchCacheMode = { revalidate: 300 }) {
  const projects = await getProjects(cacheMode);
  return projects.find((project) => project.slug === slug) || null;
}

function mapArticle(item: Record<string, any>, index: number): Article {
  const title = String(item?.title || `Article ${index + 1}`);
  const excerpt = String(item?.excerpt || '');
  const content = String(item?.content || '');
  const rawSlug = typeof item?.slug === 'string' ? item.slug : item?.slug?.current;
  return {
    _id: String(item?._id || item?.id || `article-${index + 1}`),
    title,
    slug: slugify(String(rawSlug || title)),
    excerpt: excerpt || content.slice(0, 140) || 'Latest updates from our team.',
    content: content || 'No article content available.',
    imageUrl: typeof item?.coverImageUrl === 'string' ? item.coverImageUrl : undefined,
    authorName: item?.authorName || 'Novaro Team',
    publishedAt: item?.publishedAt || item?.createdAt,
    seoTitle: item?.seoTitle || '',
    seoDescription: item?.seoDescription || '',
    seoKeywords: Array.isArray(item?.seoKeywords) ? item.seoKeywords : []
  };
}

export async function getBlogPosts(cacheMode: FetchCacheMode = { revalidate: 120 }) {
  const mergedBySlug = new Map<string, Article>();

  try {
    const payload = await requestJson<{ ok: boolean; data: Array<Record<string, any>> }>('/api/blog', cacheMode);
    if (payload?.ok && Array.isArray(payload?.data) && payload.data.length) {
      payload.data.map(mapArticle).forEach((article) => {
        mergedBySlug.set(article.slug, article);
      });
    }
  } catch {
    // Continue with Sanity even when backend is unavailable.
  }

  try {
    const sanityPosts = await sanityFetch<Array<Record<string, any>>>(
      `*[_type == "blogPost" && !(_id in path("drafts.**")) && coalesce(status, "published") != "draft"] | order(coalesce(publishedAt, _createdAt) desc) {
        _id,
        title,
        slug,
        excerpt,
        content,
        coverImageUrl,
        authorName,
        publishedAt,
        seoTitle,
        seoDescription,
        seoKeywords
      }`
    );
    if (Array.isArray(sanityPosts) && sanityPosts.length) {
      sanityPosts.map(mapArticle).forEach((article) => {
        // Keep backend data as source of truth on conflicts.
        if (!mergedBySlug.has(article.slug)) {
          mergedBySlug.set(article.slug, article);
        }
      });
    }
  } catch {
    // Ignore Sanity errors and return what we already have.
  }

  return Array.from(mergedBySlug.values()).sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });
}

export async function getBlogPostBySlug(slug: string, cacheMode: FetchCacheMode = { revalidate: 120 }) {
  try {
    const payload = await requestJson<{ ok: boolean; data: Record<string, any> }>(
      `/api/blog/${encodeURIComponent(slug)}`,
      cacheMode
    );
    if (payload?.ok && payload?.data) {
      return mapArticle(payload.data, 0);
    }
  } catch {
    // Fall through to Sanity when backend is unavailable.
  }

  try {
    const sanityPost = await sanityFetch<Record<string, any> | null>(
      `*[_type == "blogPost" && !(_id in path("drafts.**")) && coalesce(status, "published") != "draft" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        content,
        coverImageUrl,
        authorName,
        publishedAt,
        seoTitle,
        seoDescription,
        seoKeywords
      }`,
      { slug }
    );
    if (sanityPost) return mapArticle(sanityPost, 0);
  } catch {
    // Ignore Sanity errors.
  }

  return null;
}
