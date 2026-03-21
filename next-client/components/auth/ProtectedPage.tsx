'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const { loading, isAuthenticated, isCreator, isAdmin, isEmployee } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (requireCreator && !isCreator) {
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
  }, [loading, isAuthenticated, isCreator, isAdmin, isEmployee, requireCreator, requireAdmin, requireEmployee, router]);

  if (
    loading ||
    !isAuthenticated ||
    (requireCreator && !isCreator) ||
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
