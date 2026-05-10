import { CalendarDays, LayoutList, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, InfoBadge, PageIntro, PageSection, SectionHeader, TabButton } from '../../components/ui/primitives';
import { getTripById, hydrateTrip, profileFallback } from '../../data/mockData';
import { formatCurrency, formatDate, formatDateRange } from '../../utils/formatters';

const buildDayCards = (trip, sections) => {
  if (!trip?.start_date || !trip?.end_date) return [];

  const cards = [];
  let current = new Date(trip.start_date);
  const end = new Date(trip.end_date);

  while (current <= end) {
    const currentLabel = current.toISOString().slice(0, 10);
    const matching = sections.filter((section) => {
      if (!section.start_date || !section.end_date) return false;
      return currentLabel >= section.start_date && currentLabel <= section.end_date;
    });

    cards.push({
      key: currentLabel,
      label: formatDate(current, { weekday: 'short', month: 'short', day: 'numeric' }),
      sections: matching,
    });

    current = new Date(current.getTime() + 86400000);
  }

  return cards;
};

const ItineraryViewPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(getTripById(id));
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    let cancelled = false;

    const loadTrip = async () => {
      try {
        const response = await api.get(`/trips/${id}`);
        if (cancelled) return;

        const fallback = getTripById(id);
        setTrip(
          hydrateTrip({
            ...fallback,
            ...response.data,
            sections: fallback?.sections ?? [],
            traveler: fallback?.traveler ?? profileFallback,
          }),
        );
      } catch {
        if (!cancelled) {
          setTrip(getTripById(id));
        }
      }
    };

    loadTrip();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!trip) {
    return (
      <AppLayout>
        <EmptyState description="We could not load the requested itinerary." title="Trip not found" />
      </AppLayout>
    );
  }

  const sections = trip.sections ?? [];
  const dayCards = buildDayCards(trip, sections);

  return (
    <AppLayout>
      <PageIntro
        badges={[
          <InfoBadge key="dates">{trip.date_range}</InfoBadge>,
          <InfoBadge key="destinations">{trip.destinations_count} destinations</InfoBadge>,
          <InfoBadge key="budget">{formatCurrency(trip.budget)}</InfoBadge>,
        ]}
        description={trip.hero_fact || 'A polished itinerary view with both list and day-based reads of the same trip structure.'}
        eyebrow="Itinerary view"
        title={trip.name}
      />

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
          eyebrow="Read itinerary"
          title="Switch between trip flow and day flow"
        />

        {viewMode === 'list' ? (
          <div className="space-y-4">
            {sections.map((section) => (
              <article key={section.id} className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <InfoBadge>{section.type}</InfoBadge>
                    <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{section.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{section.description}</p>
                  </div>
                  <div className="rounded-[24px] bg-[linear-gradient(180deg,#f8fafc,#eefaf9)] px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Budget</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(section.budget)}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <InfoBadge>
                    <MapPin size={14} />
                    {section.city}
                  </InfoBadge>
                  <InfoBadge>{formatDateRange(section.start_date, section.end_date)}</InfoBadge>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dayCards.map((card) => (
              <article key={card.key} className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{card.label}</h3>
                <div className="mt-4 space-y-3">
                  {card.sections.length ? (
                    card.sections.map((section) => (
                      <div key={`${card.key}-${section.id}`} className="rounded-[22px] bg-slate-50/90 p-3">
                        <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">{section.city}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)]">No fixed plans</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection>
        <SectionHeader eyebrow="Keep planning" title="Companion actions" />
        <div className="flex flex-wrap gap-3">
          <Button to={`/trips/${trip.id}/build`} variant="secondary">
            Refine builder
          </Button>
          <Button to={`/trips/${trip.id}/invoice`} variant="secondary">
            Open budget view
          </Button>
          <Button to={`/trips/${trip.id}/notes`} variant="secondary">
            Review notes
          </Button>
        </div>
      </PageSection>
    </AppLayout>
  );
};

export default ItineraryViewPage;
