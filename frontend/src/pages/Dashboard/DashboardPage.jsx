import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Filter,
  MapPinned,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import TripCard from '../../components/features/TripCard';
import { Button, EmptyState, Eyebrow, PageSection, SearchField, SectionHeader, SkeletonCard, Toolbar } from '../../components/ui/primitives';
import api from '../../api/axiosInstance';
import { cityDirectory, destinationHighlights, getDashboardSnapshot, getSeedTrips, hydrateTrip } from '../../data/mockData';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/formatters';

const heroSlides = [
  {
    id: 1,
    title: 'Plan cinematic journeys with the rigor of a modern product workspace.',
    copy: 'From the first spark to the final budget view, Traveloop turns multi-stop travel into a premium, collaborative flow.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    stat: '5 curated regions',
  },
  {
    id: 2,
    title: 'Move from inspiration to itinerary without losing the emotional part of travel.',
    copy: 'Banner-led discovery, structured trip history, and guided creation all live inside one cohesive light-mode ecosystem.',
    image:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80',
    stat: 'Route-first planning',
  },
  {
    id: 3,
    title: 'Keep budget visibility high while the interface still feels editorial and calm.',
    copy: 'Budget signals, previous trips, and destination rails stay connected so planning feels clear instead of fragmented.',
    image:
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
    stat: 'Live budget insight',
  },
  {
    id: 4,
    title: 'Design trips for solo escapes, family loops, or ambitious multi-city runs.',
    copy: 'A polished travel operating system for discovery, sequencing, budgeting, and reuse.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    stat: 'Premium collaboration',
  },
  {
    id: 5,
    title: 'Give every trip a home that feels startup-grade, responsive, and production ready.',
    copy: 'The dashboard mirrors the wireframe structure closely while upgrading every interaction and visual surface.',
    image:
      'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1600&q=80',
    stat: 'Responsive by default',
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(getDashboardSnapshot());
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [tripSearch, setTripSearch] = useState('');
  const inspirationRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        const tripsResponse = await api.get('/trips?limit=6');

        if (cancelled) return;

        const liveTrips = (tripsResponse.data?.trips ?? []).map((trip) => hydrateTrip(trip));
        const fallbackTrips = getSeedTrips().slice(0, 6);
        const trips = liveTrips.length ? liveTrips : fallbackTrips;

        setDashboard({
          trips,
          stats: [],
        });
      } catch {
        if (!cancelled) {
          setDashboard(getDashboardSnapshot());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const visibleTrips = (dashboard.trips ?? []).filter((trip) => {
    const query = tripSearch.trim().toLowerCase();
    return !query || trip.name.toLowerCase().includes(query) || trip.summary?.toLowerCase().includes(query);
  });

  const regionCards = [...new Set(cityDirectory.map((city) => city.region))].map((region) => {
    const cities = cityDirectory.filter((city) => city.region === region);
    return {
      region,
      city: cities[0],
      count: cities.length,
    };
  });

  const currentSlide = heroSlides[heroIndex];

  const moveInspiration = (direction) => {
    if (!inspirationRef.current) return;

    inspirationRef.current.scrollBy({
      left: direction === 'next' ? 340 : -340,
      behavior: 'smooth',
    });
  };

  return (
    <AppLayout contentClassName="gap-7">
      <section className="hero-fade-in relative overflow-hidden rounded-[40px] border border-white/80 shadow-[0_34px_110px_rgba(15,23,42,0.12)]">
        <img alt={currentSlide.title} className="absolute inset-0 h-full w-full object-cover" src={currentSlide.image} />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,23,42,0.78)_0%,rgba(15,23,42,0.46)_48%,rgba(15,23,42,0.20)_100%)]" />
        <div className="relative min-h-[372px] p-6 sm:p-8 lg:p-10">
          <div className="flex h-full max-w-4xl flex-col justify-between gap-8 text-white">
            <div className="space-y-5">
              <Eyebrow className="border-white/20 bg-white/12 text-white">Main landing page</Eyebrow>
              <div className="space-y-4">
                <h1 className="max-w-4xl font-['Fraunces'] text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                  {currentSlide.title}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/78 sm:text-base">{currentSlide.copy}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/trips/new')}>
                  <Plus size={17} />
                  Plan a trip
                </Button>
                <Button className="border-white/20 bg-white/10 text-white hover:bg-white/16" to="/community" variant="ghost">
                  <Sparkles size={17} />
                  Explore community
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/18"
                  onClick={() => setHeroIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/18"
                  onClick={() => setHeroIndex((current) => (current + 1) % heroSlides.length)}
                >
                  <ArrowRight size={18} />
                </button>
                <div className="flex items-center gap-2">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      className={cn(
                        'h-2.5 rounded-full transition-all',
                        index === heroIndex ? 'w-10 bg-white' : 'w-2.5 bg-white/35',
                      )}
                      onClick={() => setHeroIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageSection>
        <Toolbar>
          <SearchField className="min-w-0 lg:min-w-[340px] lg:flex-1" icon={Search}>
            <input
              placeholder="Search previous trips, destinations, or planning themes"
              value={tripSearch}
              onChange={(event) => setTripSearch(event.target.value)}
            />
          </SearchField>
          <Button className="justify-start lg:min-w-[150px]" variant="secondary">
            <MapPinned size={16} />
            Group by
          </Button>
          <Button className="justify-start lg:min-w-[150px]" variant="secondary">
            <Filter size={16} />
            Filter
          </Button>
          <Button className="justify-start lg:min-w-[150px]" variant="secondary">
            <SlidersHorizontal size={16} />
            Sort by
          </Button>
        </Toolbar>
      </PageSection>

      <PageSection>
        <SectionHeader
          eyebrow="Regional selections"
          title="Top regional selections"
          description="A premium browse layer for the regions people keep circling back to before they commit to a trip."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {regionCards.map((item, index) => (
            <article
              key={item.region}
              className={cn(
                'group relative overflow-hidden rounded-[28px] border border-white/80 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)]',
                index % 4 === 0 && 'bg-[linear-gradient(180deg,#ecfeff,#dff6ff)]',
                index % 4 === 1 && 'bg-[linear-gradient(180deg,#fff7ed,#fff1d6)]',
                index % 4 === 2 && 'bg-[linear-gradient(180deg,#eff6ff,#e5eefc)]',
                index % 4 === 3 && 'bg-[linear-gradient(180deg,#f0fdf4,#e5f8ea)]',
              )}
            >
              <div className="absolute right-[-2rem] top-[-1.5rem] h-24 w-24 rounded-full border border-white/70 bg-white/40 blur-md" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <Eyebrow className="bg-white/70">{item.region}</Eyebrow>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {item.count} cities
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{item.city.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.city.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Starting point</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(item.city.cost_index * 10)}</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/72 text-slate-800 transition group-hover:translate-x-1"
                    onClick={() => navigate('/search/cities')}
                  >
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <SectionHeader
          action={
            <Button size="sm" to="/trips" variant="secondary">
              View all trips
            </Button>
          }
          eyebrow="Previous trips"
          title="Previous trips"
          description="Your recent trip history, redesigned as rich planning cards with stronger visual hierarchy and faster actions."
        />

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <SkeletonCard key={item} />
            ))}
          </div>
        ) : visibleTrips.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleTrips.map((trip) => (
              <TripCard
                key={trip.id}
                actions={[
                  { label: 'View', to: `/trips/${trip.id}/view`, tone: 'primary' },
                  { label: 'Build', to: `/trips/${trip.id}/build` },
                  { label: 'Budget', to: `/trips/${trip.id}/invoice` },
                ]}
                trip={trip}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <Button onClick={() => navigate('/trips/new')}>
                <Plus size={16} />
                Create your first itinerary
              </Button>
            }
            description="Nothing matches the current search yet. Start a new trip or broaden the query."
            title="No trips surfaced"
          />
        )}
      </PageSection>

      <PageSection>
        <SectionHeader
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 transition hover:-translate-y-0.5"
                onClick={() => moveInspiration('prev')}
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 transition hover:-translate-y-0.5"
                onClick={() => moveInspiration('next')}
              >
                <ArrowRight size={17} />
              </button>
            </div>
          }
          eyebrow="Inspiration"
          title="Travel inspiration"
          description="A horizontal destination rail matching the wireframe flow, upgraded into a smooth editorial carousel."
        />
        <div className="hide-scrollbar -mx-1 flex gap-5 overflow-x-auto px-1 pb-2" ref={inspirationRef}>
          {destinationHighlights.map((destination) => (
            <article
              key={destination.id}
              className="min-w-[300px] max-w-[300px] overflow-hidden rounded-[30px] border border-white/80 bg-white/92 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:min-w-[340px] sm:max-w-[340px]"
            >
              <div className="relative h-72">
                <img alt={destination.name} className="h-full w-full object-cover" src={destination.image_url} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.58))]" />
                <div className="absolute left-5 top-5">
                  <Eyebrow className="border-white/16 bg-white/16 text-white">{destination.region}</Eyebrow>
                </div>
                <div className="absolute inset-x-5 bottom-5 text-white">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">{destination.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/76">{destination.summary}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Trending fare</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">From {formatCurrency(1600)}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => navigate('/trips/new')}>
                  <Compass size={16} />
                  Add to trip
                </Button>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <Link
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#0f766e_0%,#0ea5e9_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_rgba(14,116,144,0.32)] transition hover:-translate-y-1"
        to="/trips/new"
      >
        <Plus size={18} />
        Plan a new trip
      </Link>
    </AppLayout>
  );
};

export default DashboardPage;
