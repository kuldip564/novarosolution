'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

type FeedItem = {
  _id: string;
  title: string;
  caption?: string;
  mediaUrl?: string;
  creatorName?: string;
};

async function fetchCreatorFeed() {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$/, '');
  const response = await fetch(`${apiUrl}/api/creator/feed`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load creator feed');
  const payload = await response.json();
  return (Array.isArray(payload?.data) ? payload.data : []) as FeedItem[];
}

function FeedSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3" aria-hidden>
      {[1, 2, 3].map((key) => (
        <div key={key} className="card animate-pulse">
          <div className="h-40 rounded-md bg-white/10" />
          <div className="mt-3 h-4 w-2/3 rounded bg-white/10" />
          <div className="mt-2 h-3 w-full rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function CreatorFeedPreview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['creator-feed-preview'],
    queryFn: fetchCreatorFeed
  });

  if (isLoading) return <FeedSkeleton />;
  if (isError) return <p className="text-sm text-slate-400">Creator feed is temporarily unavailable.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {data?.slice(0, 3).map((item) => (
        <article key={item._id} className="card">
          {item.mediaUrl ? (
            <Image
              src={item.mediaUrl}
              alt={`${item.title} by ${item.creatorName || 'creator'}`}
              width={420}
              height={240}
              className="h-40 w-full rounded-md object-cover"
            />
          ) : (
            <div className="h-40 rounded-md bg-white/5" />
          )}
          <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{String(item.caption || '').slice(0, 90)}</p>
        </article>
      ))}
    </div>
  );
}
