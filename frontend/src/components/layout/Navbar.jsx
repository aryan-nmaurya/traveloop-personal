import { useEffect, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Plus, Settings2, UserRound, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/primitives';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const closeMenus = () => {
      setMobileOpen(false);
      setProfileOpen(false);
    };

    window.addEventListener('resize', closeMenus);
    return () => window.removeEventListener('resize', closeMenus);
  }, []);

  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.trim() || 'TL';
  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/trips', label: 'Trips' },
    { to: '/search/cities', label: 'Discover' },
    { to: '/community', label: 'Community' },
    { to: '/profile', label: 'Profile' },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/admin', label: 'Admin' });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-[rgba(252,253,255,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.06)] lg:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <BrandLogo imgClassName="h-5 sm:h-6" />
        </div>

        <nav
          className={cn(
            'absolute inset-x-4 top-[84px] z-40 rounded-[30px] border border-white/90 bg-white/95 p-4 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur lg:static lg:block lg:rounded-full lg:border lg:bg-white/70 lg:p-1.5 lg:shadow-[0_14px_40px_rgba(15,23,42,0.08)]',
            mobileOpen ? 'block' : 'hidden lg:block',
          )}
        >
          <div className="flex flex-col gap-1 lg:flex-row lg:items-center">
            {links.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) => cn('nav-link justify-between lg:justify-center', isActive && 'nav-link-active')}
                onClick={() => setMobileOpen(false)}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/92 text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-amber-400" />
          </button>

          <div className="relative">
            <button
              type="button"
              className="flex min-h-12 items-center gap-3 rounded-full border border-slate-200/80 bg-white/92 px-3 py-2 shadow-[0_12px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
              onClick={() => setProfileOpen((current) => !current)}
            >
              {user?.profile_photo_url ? (
                <img alt={user?.first_name || 'Traveler'} className="h-10 w-10 rounded-full object-cover" src={user.profile_photo_url} />
              ) : (
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {initials}
                </span>
              )}
              <span className="text-left">
                <span className="block text-sm font-semibold text-slate-900">{user?.first_name || 'Traveler'}</span>
                <span className="block text-xs text-slate-400">{user?.role === 'admin' ? 'Admin workspace' : 'Premium planner'}</span>
              </span>
              <ChevronDown className={cn('h-4 w-4 text-slate-400 transition', profileOpen && 'rotate-180')} />
            </button>

            {profileOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-[28px] border border-white/90 bg-white/96 p-2 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur">
                <Link
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                  onClick={() => setProfileOpen(false)}
                  to="/profile"
                >
                  <UserRound size={16} />
                  View profile
                </Link>
                <Link
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                  onClick={() => setProfileOpen(false)}
                  to="/profile"
                >
                  <Settings2 size={16} />
                  Preferences
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            ) : null}
          </div>

          <Button className="shadow-[0_18px_36px_rgba(14,116,144,0.22)]" size="sm" to="/trips/new">
            <Plus size={16} />
            New trip
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200/70 bg-white/88 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3">
            <Button className="w-full" size="sm" to="/trips/new" variant="primary">
              <Plus size={16} />
              New trip
            </Button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              onClick={logout}
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
