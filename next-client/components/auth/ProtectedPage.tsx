'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type ProtectedPageProps = {
  children: React.ReactNode;
  requireCreator?: boolean;
  requireAdmin?: boolean;
  requireEmployee?: boolean;
};

export default function ProtectedPage({
  children,
  requireCreator = false,
  requireAdmin = false,
  requireEmployee = false
}: ProtectedPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, isAuthenticated, isCreator, isAdmin, isEmployee } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      const redirect = pathname ? `?redirect=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${redirect}`);
      return;
    }
    if (requireCreator && !isCreator && !isAdmin) {
      router.replace('/profile');
      return;
    }
    if (requireAdmin && !isAdmin) {
      router.replace('/profile');
      return;
    }
    if (requireEmployee && !isEmployee) {
      router.replace('/profile');
    }
  }, [
    loading,
    isAuthenticated,
    isCreator,
    isAdmin,
    isEmployee,
    requireCreator,
    requireAdmin,
    requireEmployee,
    router,
    pathname
  ]);

  if (
    loading ||
    !isAuthenticated ||
    (requireCreator && !isCreator && !isAdmin) ||
    (requireAdmin && !isAdmin) ||
    (requireEmployee && !isEmployee)
  ) {
    return (
      <div className="app-page-shell flex min-h-[38vh] flex-col items-center justify-center px-4 py-16">
        <div className="premium-page-hero flex max-w-sm flex-col items-center gap-4 text-center">
          <span
            className="h-11 w-11 animate-pulse rounded-2xl border border-white/15 bg-linear-to-br from-white/12 to-white/5 shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
            aria-hidden
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400/85">Secure</p>
            <p className="mt-2 text-sm text-slate-400">Verifying your session…</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
