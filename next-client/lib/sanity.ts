import {createClient, type QueryParams} from '@sanity/client';

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a50o6hm';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01';
const SANITY_USE_CDN = (process.env.NEXT_PUBLIC_SANITY_USE_CDN || 'true') !== 'false';

const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: SANITY_USE_CDN
});

export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  return sanityClient.fetch<T>(query, params);
}
