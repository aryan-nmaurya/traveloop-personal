import { CalendarDays, Edit3, LayoutList, MapPin, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, InfoBadge, PageIntro, PageSection, SectionHeader, TabButton } from '../../components/ui/primitives';
import { coverFallback } from '../../data/mockData';
import { formatCurrency, formatDate, formatDateRange } from '../../utils/formatters';

const ItineraryViewPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [sections, setSections] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadTrip = async () => {
      try {
        // Try owner endpoint first (includes sections).
        const res = await api.get(`/trips/${id}/itinerary`);
        if (cancelled) return;
        setTrip(res.data);
        setSections(res.data.sections ?? []);
      } catch {
        if (cancelled) return;
        try {
          // Fallback: public trip endpoint (community view by non-owner).
          const res = await api.get(`/trips/${id}/public`);
          if (!cancelled) {
            setTrip(res.data);
            setSections(res.data.sections ?? []);
          }
        } catch {
          // Trip not found and not public — leave trip=null for not-found state.
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadTrip();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!trip) {
    return (
      <AppLayout>
        <EmptyState description="We could not load the requested itinerary." title="Trip not found" />
      </AppLayout>
    );
  }


  return (
    <AppLayout>
      {/* Hero cover */}
      {trip.cover_photo_url && (
        <div className="relative -mx-4 -mt-4 mb-8 overflow-hidden rounded-b-[36px] sm:-mx-6 lg:-mx-8" style={{ height: 260 }}>
          <img
            src={trip.cover_photo_url || coverFallback}
            alt={trip.name}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => { e.currentTarget.src = coverFallback; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-x-6 bottom-8 text-white sm:inset-x-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-2">Itinerary view</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{trip.name}</h1>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="mb-8 flex flex-wrap gap-3">
        {trip.start_date && trip.end_date && (
          <InfoBadge>📅 {formatDateRange(trip.start_date, trip.end_date)}</InfoBadge>
        )}
        <InfoBadge>📍 {sections.length} segment{sections.length !== 1 ? 's' : ''}</InfoBadge>
        <InfoBadge>
          💰 Spent: {formatCurrency(trip.total_spent || 0)} {trip.budget ? `/ Limit: ${formatCurrency(trip.budget)}` : ''}
        </InfoBadge>
        <InfoBadge>📋 {trip.status || 'upcoming'}</InfoBadge>
      </div>

      {trip.description && (
        <p className="mb-8 max-w-3xl text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
          {trip.description}
        </p>
      )}

      {/* View toggle + sections */}
      <PageSection>
        <SectionHeader
          action={
            <div className="flex flex-wrap gap-2">
              <TabButton active={viewMode === 'list'} onClick={() => setViewMode('list')}>
                <LayoutList size={16} />
                List
              </TabButton>
              <TabButton active={viewMode === 'calendar'} onClick={() => setViewMode('calendar')}>
                <CalendarDays size={16} />
                By day
              </TabButton>
            </div>
          }
          eyebrow="Trip flow"
          title="Your itinerary segments"
        />

        {sections.length === 0 ? (
          <EmptyState
            description="No sections have been added yet. Go to the builder to add your first segment."
            title="Empty itinerary"
          />
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {sections.map((section, i) => {
              // Parse location from description (format: "Location — activities")
              const descParts = (section.description || '').split(' — ');
              const location = descParts.length > 1 ? descParts[0] : null;
              const details = descParts.length > 1 ? descParts.slice(1).join(' — ') : section.description;

              return (
                <article
                  key={section.id}
                  className="rounded-[28px] border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)]"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                          style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                        >
                          {section.type || 'segment'}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                          Section {i + 1}
                        </span>
                      </div>
                      {location && (
                        <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                          📍 {location}
                        </h3>
                      )}
                      <p className="text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
                        {details}
                      </p>
                      {section.start_date && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <InfoBadge>{formatDateRange(section.start_date, section.end_date)}</InfoBadge>
                        </div>
                      )}
                    </div>
                    {section.budget > 0 && (
                      <div className="rounded-[20px] px-5 py-3 text-right" style={{ background: 'var(--surface)' }}>
                        <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Budget</p>
                        <p className="mt-1 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(section.budget)}</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Calendar / day-based view */
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map((section, i) => {
              const descParts = (section.description || '').split(' — ');
              const location = descParts.length > 1 ? descParts[0] : `Segment ${i + 1}`;
              const activities = descParts.length > 1 ? descParts[1]?.split(', ') : [section.description];

              return (
                <article
                  key={section.id}
                  className="rounded-[24px] border p-5 transition hover:-translate-y-0.5"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>📍 {location}</h3>
                    <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
                      {formatCurrency(section.budget || 0)}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {(activities || []).map((act, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                        {act?.trim()}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </PageSection>

      {/* Actions */}
      <PageSection>
        <SectionHeader eyebrow="Keep planning" title="What's next?" />
        <div className="flex flex-wrap gap-3">
          <Button to={`/trips/${trip.id}/build`}>
            <Edit3 size={15} />
            Edit in builder
          </Button>
          <Button to={`/trips/${trip.id}/invoice`} variant="secondary">
            <Receipt size={15} />
            Budget breakdown
          </Button>
          <Button to={`/trips/${trip.id}/checklist`} variant="secondary">
            ✅ Packing checklist
          </Button>
          <Button to={`/trips/${trip.id}/notes`} variant="secondary">
            📝 Trip notes
          </Button>
        </div>
      </PageSection>
    </AppLayout>
  );
};

export default ItineraryViewPage;
