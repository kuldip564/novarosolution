import { useEffect, useState } from 'react';
import HomeLayout from '../assets/componet/HomeLayout';
import { fetchContactSubmissions } from '../config/api';
import { useAuth } from '../context/AuthContext';
import usePageReveal from '../hooks/usePageReveal';

const ContactSubmissionsPage = () => {
  const { token, isAdmin } = useAuth();
  const pageRef = usePageReveal();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !isAdmin) {
      setLoading(false);
      setSubmissions([]);
      return;
    }

    let isMounted = true;

    async function loadSubmissions() {
      try {
        const data = await fetchContactSubmissions(token);
        if (!isMounted) return;
        setSubmissions(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load submissions.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSubmissions();
    return () => {
      isMounted = false;
    };
  }, [token, isAdmin]);

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen text-white px-4 py-16 md:py-20">
        <section className="js-reveal mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Admin
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-50">
            Contact Submissions
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            Dynamic submissions fetched from backend storage.
          </p>
        </section>

        <section className="js-reveal mx-auto max-w-6xl mt-8">
          {!isAdmin && (
            <p className="text-amber-300">
              You do not have permission to view submissions.
            </p>
          )}
          {loading && <p className="text-slate-400">Loading submissions...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && isAdmin && submissions.length === 0 && (
            <p className="text-slate-400">No submissions yet.</p>
          )}

          {!loading && !error && isAdmin && submissions.length > 0 && (
            <div className="grid gap-4">
              {submissions
                .slice()
                .reverse()
                .map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h2 className="text-lg font-semibold text-slate-100">{item.subject}</h2>
                      <p className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-slate-200">{item.message}</p>
                    <div className="mt-3 text-xs text-slate-400">
                      <span>{item.name}</span> · <span>{item.email}</span>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </section>
      </main>
    </HomeLayout>
  );
};

export default ContactSubmissionsPage;

