import { ArrowRight, CalendarDays, Clock3, MapPinned, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/primitives';

const statusStyles = {
  Ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Upcoming: 'bg-sky-50 text-sky-700 border-sky-200',
  Completed: 'bg-slate-100 text-slate-600 border-slate-200',
  Draft: 'bg-amber-50 text-amber-700 border-amber-200',
};

const TripCard = ({ trip, actions = [], variant = 'default', className = '' }) => {
  const navigate = useNavigate();
  const cover =
    trip.cover_photo_url ||
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200';
  const statusClass = statusStyles[trip.status] || statusStyles.Upcoming;

  const handleAction = (action) => {
    if (action.onClick) {
      action.onClick();
      return;
    }

    if (action.to) {
      navigate(action.to);
    }
  };

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-[30px] border border-white/80 bg-white/92 shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_90px_rgba(15,23,42,0.14)]',
        className,
      )}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          alt={trip.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={cover}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200'; }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.60))]" />
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-sm', statusClass)}>
            {trip.status || 'Upcoming'}
          </span>
          {trip.social_proof ? (
            <span className="rounded-full border border-white/30 bg-white/14 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {trip.social_proof}
            </span>
          ) : null}
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
          <div className="space-y-2 text-white">
            {trip.traveler?.name ? <p className="text-sm font-medium text-white/72">{trip.traveler.name}</p> : null}
            <h3 className="text-2xl font-semibold tracking-[-0.04em]">{trip.name}</h3>
          </div>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/16 text-white backdrop-blur transition duration-300 group-hover:translate-x-1"
            onClick={() => navigate(`/trips/${trip.id}/view`)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <p className="line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{trip.summary || trip.description || 'A premium trip canvas with itinerary, budgeting, and planning visibility.'}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] bg-slate-50/90 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <CalendarDays size={14} />
              Dates
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{trip.date_range || 'Dates flexible'}</p>
          </div>
          <div className="rounded-[22px] bg-slate-50/90 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <MapPinned size={14} />
              Destinations
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {trip.destinations_count || 1} {trip.destinations_count === 1 ? 'stop' : 'stops'}
            </p>
          </div>
          <div className="rounded-[22px] bg-slate-50/90 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <Clock3 size={14} />
              Duration
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{trip.duration || 'Planning in progress'}</p>
          </div>
          <div className="rounded-[22px] bg-slate-50/90 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <Wallet size={14} />
              Pricing
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
              <span className="text-sm font-bold text-slate-950">{formatCurrency(trip.total_spent || 0)}</span>
              {trip.budget ? (
                <span className="text-[10px] text-slate-400">/ {formatCurrency(trip.budget)} limit</span>
              ) : (
                <span className="text-[10px] text-slate-400">spent</span>
              )}
            </div>
          </div>
        </div>

        {trip.status !== 'Completed' && typeof trip.progress === 'number' ? (
          <div className="space-y-2 rounded-[24px] bg-[linear-gradient(180deg,rgba(15,118,110,0.06),rgba(14,165,233,0.03))] p-4">
            <div className="flex items-center justify-between text-sm font-medium text-slate-700">
              <span>Planning progress</span>
              <span>{trip.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/90">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0ea5e9)]"
                style={{ width: `${trip.progress}%` }}
              />
            </div>
          </div>
        ) : null}

        {actions.length ? (
          <div className={cn('flex flex-wrap gap-2', variant === 'community' && 'pt-1')}>
            {actions.map((action) => (
              <Button
                key={action.label}
                className={cn('flex-1', variant === 'community' ? 'min-w-[160px]' : 'min-w-[120px]')}
                size="sm"
                variant={action.tone === 'primary' ? 'primary' : 'secondary'}
                onClick={() => handleAction(action)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default TripCard;
