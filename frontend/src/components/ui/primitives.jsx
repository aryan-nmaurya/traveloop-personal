import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const Eyebrow = ({ children, className = '' }) => (
  <span
    className={cn(
      'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em]',
      className,
    )}
    style={{
      borderColor: 'rgba(13,148,136,0.18)',
      background: 'var(--accent-soft)',
      color: 'var(--accent-primary)',
    }}
  >
    {children}
  </span>
);

export const PageIntro = ({ eyebrow, title, description, actions, badges, className = '' }) => (
  <section
    className={cn('grid gap-5 rounded-[32px] border p-6 backdrop-blur xl:grid-cols-[minmax(0,1fr)_auto]', className)}
    style={{
      background: 'var(--card-bg)',
      borderColor: 'var(--card-border)',
      boxShadow: '0 20px 80px rgba(15,23,42,0.08)',
    }}
  >
    <div className="space-y-4">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <div className="space-y-3">
        <h1
          className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl text-base leading-7 sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
    {actions || badges ? (
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
        <h2
          className="text-2xl font-semibold tracking-[-0.04em] sm:text-[2rem]"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
    {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
  </div>
);

/* ── Button ── */
const buttonBase =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60';

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  style,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'min-h-10 px-4 text-sm' : 'px-5';

  let variantStyle = {};
  let variantClass = '';

  if (variant === 'primary') {
    variantClass = 'text-white hover:-translate-y-0.5';
    variantStyle = {
      background: 'linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)',
      boxShadow: '0 18px 40px rgba(14,116,144,0.24)',
    };
  } else if (variant === 'secondary') {
    variantClass = 'hover:-translate-y-0.5';
    variantStyle = {
      background: 'var(--card-bg)',
      border: '1px solid var(--input-border)',
      color: 'var(--text-primary)',
      boxShadow: '0 12px 30px rgba(15,23,42,0.07)',
    };
  } else if (variant === 'ghost') {
    variantClass = 'hover:-translate-y-0.5';
    variantStyle = {
      background: 'rgba(15,23,42,0.03)',
      color: 'var(--text-secondary)',
    };
  } else if (variant === 'danger') {
    variantStyle = {
      background: 'rgba(244,63,94,0.08)',
      border: '1px solid rgba(244,63,94,0.25)',
      color: '#e11d48',
    };
  }

  const merged = { ...variantStyle, ...style };
  const classes = cn(buttonBase, sizeClass, variantClass, className);

  if (to) return <Link className={classes} style={merged} to={to} {...props}>{children}</Link>;
  if (href) return <a className={classes} style={merged} href={href} {...props}>{children}</a>;
  return <button className={classes} style={merged} type={type} {...props}>{children}</button>;
};

export const InfoBadge = ({ children, className = '', style }) => (
  <span
    className={cn('inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium', className)}
    style={{
      background: 'var(--card-bg)',
      borderColor: 'var(--card-border)',
      color: 'var(--text-secondary)',
      boxShadow: '0 10px 28px rgba(15,23,42,0.07)',
      ...style,
    }}
  >
    {children}
  </span>
);

export const EmptyState = ({ title, description, action, className = '' }) => (
  <div
    className={cn('rounded-[28px] border border-dashed p-8 text-center', className)}
    style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
  >
    <h3 className="text-xl font-semibold tracking-[-0.03em]" style={{ color: 'var(--text-primary)' }}>
      {title}
    </h3>
    {description ? (
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
    ) : null}
    {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
  </div>
);

export const SearchField = ({ icon: Icon, className = '', children }) => (
  <label className={cn('field-shell min-h-14 gap-3 rounded-full px-4', className)}>
    {Icon ? <Icon className="h-4.5 w-4.5 shrink-0" style={{ color: 'var(--text-muted)' }} /> : null}
    <div className="flex-1">{children}</div>
  </label>
);

export const FormField = ({ label, icon: Icon, hint, className = '', shellClassName = '', children }) => (
  <label className={cn('flex flex-col gap-3', className)}>
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {label}
      </span>
      {hint ? (
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </span>
      ) : null}
    </div>
    <div className={cn('field-shell', shellClassName)}>
      {Icon ? <Icon className="h-4.5 w-4.5 shrink-0" style={{ color: 'var(--text-muted)' }} /> : null}
      {children}
    </div>
  </label>
);

export const TabButton = ({ active, children, className = '', ...props }) => (
  <button
    type="button"
    className={cn(
      'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-300',
      className,
    )}
    style={
      active
        ? {
            background: 'var(--text-primary)',
            color: 'var(--background)',
            boxShadow: '0 14px 30px rgba(15,23,42,0.18)',
          }
        : {
            background: 'var(--card-bg)',
            border: '1px solid var(--input-border)',
            color: 'var(--text-secondary)',
          }
    }
    {...props}
  >
    {children}
  </button>
);

export const SkeletonCard = ({ className = '' }) => (
  <div
    className={cn('overflow-hidden rounded-[28px] border', className)}
    style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: '0 20px 60px rgba(15,23,42,0.08)' }}
  >
    <div className="h-56 animate-pulse" style={{ background: 'var(--skeleton)' }} />
    <div className="space-y-3 p-5">
      <div className="h-4 w-20 animate-pulse rounded-full" style={{ background: 'var(--skeleton)' }} />
      <div className="h-6 w-2/3 animate-pulse rounded-full" style={{ background: 'var(--skeleton)' }} />
      <div className="h-4 w-full animate-pulse rounded-full" style={{ background: 'var(--skeleton)' }} />
      <div className="h-4 w-3/4 animate-pulse rounded-full" style={{ background: 'var(--skeleton)' }} />
    </div>
  </div>
);

export const Toolbar = ({ children, className = '' }) => (
  <div className={cn('flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center', className)}>
    {children}
  </div>
);
