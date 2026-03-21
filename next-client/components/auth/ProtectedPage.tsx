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
      <section className="card">
        <p className="text-slate-300">Checking access...</p>
      </section>
    );
  }

  return <>{children}</>;
}
