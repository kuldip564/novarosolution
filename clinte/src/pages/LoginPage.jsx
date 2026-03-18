import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import { useAuth } from '../context/AuthContext';
import usePageReveal from '../hooks/usePageReveal';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';
  const pageRef = usePageReveal();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(formData);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen text-white px-4 py-16">
        <div className="js-reveal mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-slate-50">Login</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to access your account.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 py-3 text-sm font-semibold text-white"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-pink-300 hover:text-pink-200">
              Register
            </Link>
          </p>
        </div>
      </main>
    </HomeLayout>
  );
};

export default LoginPage;

