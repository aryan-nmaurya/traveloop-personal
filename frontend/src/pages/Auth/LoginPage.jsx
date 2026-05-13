import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/layout/BrandLogo';
import { Button, FormField } from '../../components/ui/primitives';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, authMessage, clearAuthMessage } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    clearAuthMessage();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Root: lock to viewport, no scroll */
    <div className="relative h-screen overflow-hidden bg-[var(--background)]">
      {/* Ambient gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(13,148,136,0.18),_transparent_24%)]" />

      {/* Full-height content wrapper */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo header — compact, fixed height */}
        <div className="flex-shrink-0 pb-3">
          <BrandLogo className="self-start" imgClassName="h-7 sm:h-8" />
        </div>

        {/* Two-column grid — fills remaining height */}
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">

          {/* ── Form panel ── */}
          <div className="flex min-h-0 items-center justify-center">
            <div className="surface-card w-full max-w-xl overflow-y-auto p-6 sm:p-7">
              <span className="inline-flex rounded-full border border-[rgba(13,148,136,0.14)] bg-[rgba(13,148,136,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--accent-primary)]">
                Login screen
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Log in to keep building immersive journeys, budgets, and itinerary flows without losing momentum.
              </p>

              {authMessage ? (
                <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                  {authMessage}
                </div>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {error}
                </div>
              ) : null}

              <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
                <FormField icon={Mail} label="Email address">
                  <input placeholder="you@example.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </FormField>
                <FormField icon={Lock} label="Password">
                  <input placeholder="••••••••" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </FormField>
                <div className="flex justify-end text-sm">
                  <Link className="font-medium transition" style={{ color: 'var(--text-secondary)' }} to="/forgot-password">
                    Forgot password?
                  </Link>
                </div>
                <Button className="w-full" type="submit" disabled={submitting}>
                  {submitting ? 'Signing in…' : 'Sign in'}
                  {!submitting && <ArrowRight size={16} />}
                </Button>
              </form>

              <p className="mt-5 text-sm text-[var(--text-secondary)]">
                Don&apos;t have an account?{' '}
                <Link className="font-semibold text-slate-900" to="/signup">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* ── Image panel — full height, desktop only ── */}
          <div className="relative hidden h-full overflow-hidden rounded-[40px] border border-white/80 shadow-[0_32px_120px_rgba(15,23,42,0.14)] lg:block">
            <img
              alt="Travel inspiration"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.10),rgba(15,23,42,0.68))]" />
            <div className="absolute inset-x-8 bottom-8 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-white/64">Premium planning</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Return to your curated travel workspace.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/74">
                Banner-led discovery, stronger trip history, and production-ready itinerary tools all live in one cohesive platform.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
