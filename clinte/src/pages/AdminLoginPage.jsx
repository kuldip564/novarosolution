import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaLock, FaUserShield } from 'react-icons/fa';
import HomeLayout from '../assets/componet/HomeLayout';
import usePageReveal from '../hooks/usePageReveal';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const { login, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = usePageReveal();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login({
        email: form.username,
        password: form.password,
      });

      if (user?.role !== 'admin') {
        logout();
        setError('This account is not an admin account.');
        return;
      }

      const redirect = location.state?.from?.pathname || '/admin/dashboard';
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || 'Admin login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen text-white px-4 py-16">
        <section className="js-reveal mx-auto max-w-md">
          <div className="rounded-3xl border border-white/15 bg-slate-950/80 p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600">
                <FaUserShield className="text-white" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-50">Admin Login</h1>
                <p className="text-xs text-slate-400 mt-1">Access website management dashboard</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Admin Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 py-3 text-sm font-semibold text-white"
              >
                <FaLock />
                {isSubmitting ? 'Signing in...' : 'Login as Admin'}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-400">
              Need regular login?{' '}
              <Link to="/login" className="text-pink-300 hover:text-pink-200">
                Go to user login
              </Link>
            </p>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
};

export default AdminLoginPage;

