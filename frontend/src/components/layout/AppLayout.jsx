import Navbar from './Navbar';
import Footer from './Footer';
import { cn } from '../../utils/cn';

const AppLayout = ({ children, className = '', contentClassName = '', footer = true }) => {
  return (
    <div
      className={cn('relative min-h-screen overflow-x-clip', className)}
      style={{ background: 'var(--background)', color: 'var(--text-primary)' }}
    >
      {/* Ambient light blobs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(13,148,136,0.16),_transparent_28%)]" />
      <div className="pointer-events-none absolute left-[-9rem] top-28 h-72 w-72 rounded-full bg-[rgba(255,191,36,0.08)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-7rem] top-40 h-80 w-80 rounded-full bg-[rgba(14,165,233,0.07)] blur-3xl" />
      <div className="relative z-10">
        <Navbar />
        <main className={cn('mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-8', contentClassName)}>
          {children}
        </main>
        {footer ? <Footer /> : null}
      </div>
    </div>
  );
};

export default AppLayout;
