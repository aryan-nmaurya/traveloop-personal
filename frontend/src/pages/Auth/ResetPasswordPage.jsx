import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import BrandLogo from '../../components/layout/BrandLogo';
import { Button, FormField } from '../../components/ui/primitives';
import api from '../../api/axiosInstance';
import { Lock } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, new_password: newPassword });
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Reset link is invalid or expired.');
      } else {
        setError('Something went wrong. Please try again.');
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
              Reset password
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">Set a new password</h1>

            {success ? (
              <div className="mt-6 rounded-[22px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                Password updated. Redirecting you to login…
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  Enter and confirm your new password below.
                </p>

                {error && (
                  <div className="mt-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {error}
                  </div>
                )}

                <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
                  <FormField icon={Lock} label="New password">
                    <input
                      placeholder="••••••••"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </FormField>
                  <FormField icon={Lock} label="Confirm new password">
                    <input
                      placeholder="••••••••"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </FormField>
                  <Button className="w-full" type="submit" disabled={loading || !token}>
                    {loading ? 'Resetting…' : 'Reset password'}
                  </Button>
                  {!token && (
                    <p className="text-xs text-rose-600">No reset token found. Please use the link from your email.</p>
                  )}
                </form>
              </>
            )}

            <p className="mt-6 text-sm text-[var(--text-secondary)]">
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

export default ResetPasswordPage;
