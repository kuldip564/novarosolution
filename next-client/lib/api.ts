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
  creatorName?: string;
  publishedAt?: string;
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
    items?: Array<Record<string, any>>;
  };
} & Record<string, any>;

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
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed: ${response.status}`);
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
    slug: slugify(item?.slug || title),
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
  const caption = String(item?.caption || '');
  return {
    _id: String(item?._id || item?.id || `article-${index + 1}`),
    title,
    slug: slugify(item?.slug || title),
    excerpt: caption.slice(0, 140) || 'Latest updates from our creator community.',
    content: caption || 'No article content available.',
    imageUrl: typeof item?.mediaUrl === 'string' ? item.mediaUrl : undefined,
    creatorName: item?.creatorName || 'Creator',
    publishedAt: item?.createdAt
  };
}

export async function getBlogPosts(cacheMode: FetchCacheMode = { revalidate: 120 }) {
  try {
    const payload = await requestJson<{ ok: boolean; data: Array<Record<string, any>> }>(
      '/api/creator/feed',
      cacheMode
    );
    if (!payload?.ok || !Array.isArray(payload?.data)) {
      return [];
    }
    return payload.data.map(mapArticle);
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string, cacheMode: FetchCacheMode = { revalidate: 120 }) {
  const posts = await getBlogPosts(cacheMode);
  return posts.find((post) => post.slug === slug) || null;
}
