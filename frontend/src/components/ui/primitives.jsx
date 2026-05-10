import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const Eyebrow = ({ children, className = '' }) => (
  <span
    className={cn(
      'inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(13,148,136,0.14)] bg-[rgba(13,148,136,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--accent-primary)]',
      className,
    )}
  >
    {children}
  </span>
);

export const PageIntro = ({ eyebrow, title, description, actions, badges, className = '' }) => (
  <section className={cn('grid gap-5 rounded-[32px] border border-white/70 bg-white/76 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur xl:grid-cols-[minmax(0,1fr)_auto]', className)}>
    <div className="space-y-4">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <div className="space-y-3">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">{title}</h1>
        {description ? <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">{description}</p> : null}
      </div>
    </div>
    {(actions || badges) ? (
      <div className="flex flex-col items-start gap-4 xl:items-end">
        {badges ? <div className="flex flex-wrap gap-2">{badges}</div> : null}
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    ) : null}
  </section>
);

export const PageSection = ({ children, className = '' }) => (
  <section className={cn('surface-card p-5 sm:p-6 lg:p-7', className)}>{children}</section>
);

export const SectionHeader = ({ eyebrow, title, description, action, className = '' }) => (
  <div className={cn('mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
    <div className="space-y-3">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2rem]">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">{description}</p> : null}
      </div>
    </div>
    {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
  </div>
);

const buttonBase =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(13,148,136,0.24)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60';

const buttonVariants = {
  primary:
    'bg-[linear-gradient(135deg,#0f766e_0%,#0ea5e9_100%)] text-white shadow-[0_18px_40px_rgba(14,116,144,0.24)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(14,116,144,0.28)]',
  secondary:
    'border border-slate-200/80 bg-white/92 text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:border-slate-300/90 hover:bg-white',
  ghost:
    'border border-transparent bg-slate-950/[0.03] text-slate-700 hover:-translate-y-0.5 hover:bg-slate-950/[0.06]',
  danger:
    'border border-rose-200 bg-rose-50 text-rose-700 hover:-translate-y-0.5 hover:bg-rose-100',
};

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  ...props
}) => {
  const classes = cn(buttonBase, buttonVariants[variant], size === 'sm' ? 'min-h-10 px-4 text-sm' : 'px-5', className);

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
};

export const InfoBadge = ({ children, className = '' }) => (
  <span className={cn('inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.07)]', className)}>
    {children}
  </span>
);

export const EmptyState = ({ title, description, action, className = '' }) => (
  <div className={cn('rounded-[28px] border border-dashed border-slate-200 bg-[rgba(248,250,252,0.88)] p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]', className)}>
    <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
    {description ? <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">{description}</p> : null}
    {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
  </div>
);

export const SearchField = ({ icon: Icon, className = '', children, contentClassName = '' }) => (
  <label className={cn('field-shell min-h-14 gap-3 rounded-full px-4', className)}>
    {Icon ? <Icon className="h-4.5 w-4.5 text-slate-400" /> : null}
    <div className={cn('flex-1', contentClassName)}>{children}</div>
  </label>
);

export const FormField = ({ label, icon: Icon, hint, className = '', shellClassName = '', children }) => (
  <label className={cn('flex flex-col gap-3', className)}>
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {hint ? <span className="text-xs font-medium text-slate-400">{hint}</span> : null}
    </div>
    <div className={cn('field-shell', shellClassName)}>
      {Icon ? <Icon className="h-4.5 w-4.5 shrink-0 text-slate-400" /> : null}
      {children}
    </div>
  </label>
);

export const TabButton = ({ active, children, className = '', ...props }) => (
  <button
    type="button"
    className={cn(
      'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-300',
      active
        ? 'bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]'
        : 'border border-slate-200/70 bg-white/90 text-slate-600 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={cn('overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]', className)}>
    <div className="h-56 animate-pulse bg-slate-200/70" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200/70" />
      <div className="h-6 w-2/3 animate-pulse rounded-full bg-slate-200/70" />
      <div className="h-4 w-full animate-pulse rounded-full bg-slate-200/70" />
      <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200/70" />
    </div>
  </div>
);

export const Toolbar = ({ children, className = '' }) => (
  <div className={cn('flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center', className)}>{children}</div>
);
