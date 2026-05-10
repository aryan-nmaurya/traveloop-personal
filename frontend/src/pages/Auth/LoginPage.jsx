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
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(13,148,136,0.18),_transparent_24%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <BrandLogo className="self-start" imgClassName="h-14 sm:h-16" />

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="surface-card mx-auto w-full max-w-xl p-6 sm:p-8">
            <span className="inline-flex rounded-full border border-[rgba(13,148,136,0.14)] bg-[rgba(13,148,136,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--accent-primary)]">
              Login screen
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">Welcome back</h1>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              Log in to keep building immersive journeys, budgets, and section flows without losing momentum.
            </p>

            {error ? (
              <div className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}

            <form className="mt-8 grid gap-5" onSubmit={handleLogin}>
              <FormField icon={Mail} label="Email address">
                <input placeholder="you@example.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </FormField>
              <FormField icon={Lock} label="Password">
                <input placeholder="••••••••" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </FormField>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a className="font-medium text-slate-700 transition hover:text-slate-950" href="#">
                  Forgot password?
                </a>
              </div>
              <Button className="w-full" type="submit">
                Sign in
                <ArrowRight size={16} />
              </Button>
            </form>

            <p className="mt-6 text-sm text-[var(--text-secondary)]">
              Don&apos;t have an account?{' '}
              <Link className="font-semibold text-slate-900" to="/signup">
                Create one
              </Link>
            </p>
          </div>

          <div className="relative hidden min-h-[620px] overflow-hidden rounded-[40px] border border-white/80 shadow-[0_32px_120px_rgba(15,23,42,0.14)] lg:block">
            <img
              alt="Travel inspiration"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.10),rgba(15,23,42,0.68))]" />
            <div className="absolute inset-x-8 bottom-8 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-white/64">Premium planning</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                Return to your curated travel workspace.
              </h2>
              <p className="mt-3 max-w-lg text-base leading-7 text-white/74">
                Banner-led discovery, stronger trip history, and production-ready itinerary tools all live in one cohesive light-mode platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
