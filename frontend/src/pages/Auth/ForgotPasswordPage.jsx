import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../components/layout/BrandLogo';
import { Button, FormField } from '../../components/ui/primitives';
import api from '../../api/axiosInstance';
import { Mail } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNetworkError(null);
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      if (!err.response) {
        // Network/connection error — the only case we surface an error
        setNetworkError('Unable to connect. Please check your connection and try again.');
      } else {
        // Any HTTP response (including 404) — show the neutral success message
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[var(--background)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(13,148,136,0.18),_transparent_24%)]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 pb-3">
          <BrandLogo className="self-start" imgClassName="h-7 sm:h-8" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="surface-card w-full max-w-md p-6 sm:p-8">
            <span className="inline-flex rounded-full border border-[rgba(13,148,136,0.14)] bg-[rgba(13,148,136,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--accent-primary)]">
              Password reset
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">Forgot your password?</h1>

            {submitted ? (
              <div className="mt-6 rounded-[22px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                Check your email for a reset link.
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  Enter your account email and we'll send you a link to reset your password.
                </p>

                {networkError && (
                  <div className="mt-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {networkError}
                  </div>
                )}

                <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
                  <FormField icon={Mail} label="Email address">
                    <input
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormField>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Sending…' : 'Send reset link'}
                  </Button>
                </form>
              </>
            )}

            <p className="mt-6 text-sm text-[var(--text-secondary)]">
              Remember your password?{' '}
              <Link className="font-semibold text-slate-900" to="/login">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
