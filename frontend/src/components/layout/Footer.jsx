import { BriefcaseBusiness, Camera, Mail, MessageCircleMore } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const groups = [
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', to: '/' },
      { label: 'My Trips', to: '/trips' },
      { label: 'Create Trip', to: '/trips/new' },
      { label: 'Discover Cities', to: '/search/cities' },
    ],
  },
  {
    title: 'Planning',
    links: [
      { label: 'Activity Search', to: '/search/activities' },
      { label: 'Community', to: '/community' },
      { label: 'Notes', to: '/trips/101/notes' },
      { label: 'Checklist', to: '/trips/101/checklist' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Profile', to: '/profile' },
      { label: 'Admin', to: '/admin' },
      { label: 'Help Center', to: '/community' },
      { label: 'Contact', to: '/profile' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-white/80 bg-[rgba(255,255,255,0.74)] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] lg:px-8 lg:py-14">
        <div className="space-y-5">
          <BrandLogo markClassName="h-11" wordClassName="h-6" />
          <p className="max-w-md text-sm leading-7 text-[var(--text-secondary)]">
            Dream, budget, sequence, and ship multi-stop journeys from one polished planning workspace built for modern travelers.
          </p>
          <div className="flex flex-wrap gap-3">
            {[Camera, BriefcaseBusiness, MessageCircleMore].map((Icon, index) => (
              <a
                key={index}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-600 shadow-[0_12px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:text-slate-950"
                href="#"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {groups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="text-base font-semibold tracking-[-0.03em] text-slate-950">{group.title}</h3>
            <div className="flex flex-col gap-3">
              {group.links.map((link) => (
                <Link key={link.label} className="text-sm text-[var(--text-secondary)] transition hover:text-slate-950" to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 border-t border-slate-200/70 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} Traveloop. Built for premium, collaborative trip planning.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a className="transition hover:text-slate-950" href="#">
            Privacy
          </a>
          <a className="transition hover:text-slate-950" href="#">
            Terms
          </a>
          <a className="inline-flex items-center gap-2 transition hover:text-slate-950" href="mailto:hello@traveloop.app">
            <Mail size={14} />
            hello@traveloop.app
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
