'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

type FeedItem = {
  _id?: string;
  id?: string;
  title: string;
  caption?: string;
  mediaUrl?: string;
  creatorName?: string;
};

async function fetchCreatorFeed() {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$/, '');
  const response = await fetch(`${apiUrl}/api/creator/feed?limit=3&sort=latest&view=summary`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load creator feed');
  const payload = await response.json();
  return (Array.isArray(payload?.data) ? payload.data : []) as FeedItem[];
}

function FeedSkeleton() {
  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <div className="grid gap-4 md:grid-cols-3" aria-hidden>
        {[1, 2, 3].map((key) => (
          <div key={key} className="page-content-card">
            <Skeleton height={160} borderRadius={8} />
            <div className="mt-3">
              <Skeleton height={16} width="70%" />
            </div>
            <div className="mt-2">
              <Skeleton height={12} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default function CreatorFeedPreview() {
  const reduceMotion = useReducedMotion();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['creator-feed-preview'],
    queryFn: fetchCreatorFeed
  });

  if (isLoading) return <FeedSkeleton />;
  if (isError) return <p className="text-sm text-slate-400">Creator feed is temporarily unavailable.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {data?.slice(0, 3).map((item, index) => {
        const itemKey = item._id || item.id || `${item.title}-${item.mediaUrl || 'no-media'}-${index}`;
        return (
        <motion.article
          key={itemKey}
          initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          whileHover={reduceMotion ? undefined : { y: -3 }}
          className="page-content-card overflow-hidden"
        >
          {item.mediaUrl ? (
            <div className="overflow-hidden rounded-md">
              <Image
                src={item.mediaUrl}
                alt={`${item.title} by ${item.creatorName || 'creator'}`}
                width={420}
                height={240}
                className="h-40 w-full rounded-md object-cover transition-transform duration-400 hover:scale-105"
              />
            </div>
          ) : (
            <div className="h-40 rounded-md bg-white/5" />
          )}
          <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{String(item.caption || '').slice(0, 90)}</p>
        </motion.article>
      );
      })}
    </div>
  );
}
