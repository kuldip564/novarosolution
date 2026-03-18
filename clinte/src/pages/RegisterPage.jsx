import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import { useAuth } from '../context/AuthContext';
import usePageReveal from '../hooks/usePageReveal';
import useSiteContent from '../hooks/useSiteContent';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const pageRef = usePageReveal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data } = useSiteContent();
  const maintenanceMode = data?.systemSettings?.maintenanceMode ?? false;
  const allowUserRegistration =
    (data?.systemSettings?.allowUserRegistration ?? true) && !maintenanceMode;
  const maintenanceMessage =
    data?.systemSettings?.maintenanceMessage ||
    'Platform updates are in progress. Some actions are temporarily unavailable. Please try again soon.';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!allowUserRegistration) {
      setError(
        maintenanceMode
          ? maintenanceMessage
          : 'New registration is currently disabled by admin.',
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await register(formData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen text-white px-4 py-16">
        <div className="js-reveal mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-slate-50">Create account</h1>
          <p className="mt-2 text-sm text-slate-400">Join NovaRo Solution portal.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                placeholder="Your name"
              />
            </div>
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
                placeholder="At least 6 characters"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {!allowUserRegistration && (
              <p className="text-sm text-amber-300">
                {maintenanceMode
                  ? maintenanceMessage
                  : 'New registration is currently disabled by admin.'}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !allowUserRegistration}
              className="w-full rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 py-3 text-sm font-semibold text-white"
            >
              {isSubmitting
                ? 'Creating account...'
                : allowUserRegistration
                  ? 'Register'
                  : 'Registration Disabled'}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-300 hover:text-pink-200">
              Login
            </Link>
          </p>
        </div>
      </main>
    </HomeLayout>
  );
};

export default RegisterPage;

