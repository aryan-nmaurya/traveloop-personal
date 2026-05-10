import { Image as ImageIcon, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/layout/BrandLogo';
import { Button, FormField } from '../../components/ui/primitives';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    }
  };

  return (
    /* Root: lock to viewport, no scroll */
    <div className="relative h-screen overflow-hidden bg-[var(--background)]">
      {/* Ambient gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(13,148,136,0.18),_transparent_24%)]" />

      {/* Full-height content wrapper */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-4 py-1.5 sm:px-6 lg:px-8">

        {/* Logo header */}
        <div className="flex-shrink-0 pb-1.5">
          <BrandLogo className="self-start" imgClassName="h-7 sm:h-8" />
        </div>

        {/* Two-column grid: form LEFT, image RIGHT */}
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">

          {/* ── Form panel ── */}
          <div className="flex min-h-0 items-center justify-center">
            <div className="surface-card w-full p-3 sm:p-4">
              <span className="inline-flex rounded-full border border-[rgba(13,148,136,0.14)] bg-[rgba(13,148,136,0.08)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-primary)]">
                Registration
              </span>
              <h1 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-2xl">Start your journey</h1>
              <p className="mt-1 text-[11px] leading-4 text-[var(--text-secondary)]">
                Create your account to build premium itineraries and manage budgets in one place.
              </p>

              {error ? (
                <div className="mt-2 rounded-[16px] border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-medium text-rose-700">
                  {error}
                </div>
              ) : null}

              <form className="mt-2 grid gap-1 md:grid-cols-2" onSubmit={handleSignup}>
                <FormField label="First name" shellClassName="!min-h-10 px-3">
                  <input name="firstName" onChange={handleChange} placeholder="Aarav" value={formData.firstName} required />
                </FormField>
                <FormField label="Last name" shellClassName="!min-h-10 px-3">
                  <input name="lastName" onChange={handleChange} placeholder="Shah" value={formData.lastName} required />
                </FormField>
                <FormField className="md:col-span-2" label="Email address" shellClassName="!min-h-10 px-3">
                  <input name="email" onChange={handleChange} placeholder="you@example.com" type="email" value={formData.email} required />
                </FormField>
                <FormField className="md:col-span-2" label="Password" shellClassName="!min-h-10 px-3">
                  <input name="password" onChange={handleChange} placeholder="••••••••" type="password" value={formData.password} required />
                </FormField>
                <FormField label="City" shellClassName="!min-h-10 px-3">
                  <input name="city" onChange={handleChange} placeholder="Vadodara" value={formData.city} />
                </FormField>
                <FormField label="Country" shellClassName="!min-h-10 px-3">
                  <input name="country" onChange={handleChange} placeholder="India" value={formData.country} />
                </FormField>
                <FormField className="md:col-span-2" label="Phone number" shellClassName="!min-h-10 px-3">
                  <input name="phone" onChange={handleChange} placeholder="+91 9876543210" type="tel" value={formData.phone} />
                </FormField>
                <div className="md:col-span-2 mt-2">
                  <Button className="w-full" size="sm" type="submit">
                    Create account
                    <UserPlus size={14} />
                  </Button>
                </div>
              </form>

              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                Already have an account?{' '}
                <Link className="font-semibold text-slate-900" to="/login">
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* ── Image panel — full height, desktop only, RIGHT side ── */}
          <div className="relative hidden h-full overflow-hidden rounded-[40px] border border-white/80 shadow-[0_32px_120px_rgba(15,23,42,0.14)] lg:block">
            <img
              alt="Travel inspiration"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.16),rgba(15,23,42,0.74))]" />
            <div className="absolute inset-x-8 bottom-8 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-white/64">Registration screen</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Create the account that powers every future itinerary.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/74">
                Build a profile once, then reuse destinations, preferences, and community-ready trips throughout the platform.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;
