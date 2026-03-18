import { Link } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import usePageReveal from '../hooks/usePageReveal';

const NotFoundPage = () => {
  const pageRef = usePageReveal();

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen text-white px-4 py-20">
        <section className="js-reveal mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">404</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-slate-50">Page not found</h1>
          <p className="mt-4 text-slate-300">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </section>
      </main>
    </HomeLayout>
  );
};

export default NotFoundPage;

