import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  Bike,
  Car,
  Compass,
  Crown,
  Filter,
  Heart,
  MapPinned,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sunrise,
  TentTree,
  Users,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import TripCard from '../../components/features/TripCard';
import { Button, EmptyState, Eyebrow, PageSection, SearchField, SectionHeader, SkeletonCard } from '../../components/ui/primitives';
import api from '../../api/axiosInstance';
import { cityDirectory, destinationHighlights, hydrateTrip } from '../../data/mockData';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/formatters';

const heroSlides = [
  {
    id: 1,
    title: 'Plan cinematic journeys with the rigor of a modern product workspace.',
    copy: 'From the first spark to the final budget view, Traveloop turns multi-stop travel into a premium, collaborative flow.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    stat: '5 curated regions',
  },
  {
    id: 2,
    title: 'Move from inspiration to itinerary without losing the emotional part of travel.',
    copy: 'Banner-led discovery, structured trip history, and guided creation all live inside one cohesive ecosystem.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80',
    stat: 'Route-first planning',
  },
  {
    id: 3,
    title: 'Keep budget visibility high while the interface still feels editorial and calm.',
    copy: 'Budget signals, previous trips, and destination rails stay connected so planning feels clear instead of fragmented.',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
    stat: 'Live budget insight',
  },
  {
    id: 4,
    title: 'Design trips for solo escapes, family loops, or ambitious multi-city runs.',
    copy: 'A polished travel operating system for discovery, sequencing, budgeting, and reuse.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    stat: 'Premium collaboration',
  },
  {
    id: 5,
    title: 'Give every trip a home that feels startup-grade, responsive, and production ready.',
    copy: 'The dashboard mirrors the wireframe structure closely while upgrading every interaction and visual surface.',
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1600&q=80',
    stat: 'Responsive by default',
  },
];

const adventureCategories = [
  {
    id: 'solo',
    category: 'Solo Travel',
    tagline: 'Find yourself on the road',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
    duration: '7–14 days',
    budget: '₹35,000–₹65,000',
    difficulty: 'Flexible',
    Icon: TentTree,
    gradient: 'from-amber-600/85 to-orange-700/85',
  },
  {
    id: 'bike',
    category: 'Bike Adventures',
    tagline: 'Highways and open horizons',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    duration: '3–10 days',
    budget: '₹8,000–₹25,000',
    difficulty: 'Challenging',
    Icon: Bike,
    gradient: 'from-rose-600/85 to-red-800/85',
  },
  {
    id: 'road',
    category: 'Road Trips',
    tagline: 'The journey is the destination',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80',
    duration: '5–12 days',
    budget: '₹15,000–₹45,000',
    difficulty: 'Easy',
    Icon: Car,
    gradient: 'from-sky-600/85 to-blue-800/85',
  },
  {
    id: 'backpack',
    category: 'Backpacking',
    tagline: 'Light pack, big world',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80',
    duration: '14–30 days',
    budget: '₹25,000–₹80,000',
    difficulty: 'Moderate',
    Icon: Backpack,
    gradient: 'from-emerald-600/85 to-teal-800/85',
  },
  {
    id: 'group',
    category: 'Group Expeditions',
    tagline: 'Better with your people',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
    duration: '5–10 days',
    budget: '₹20,000–₹60,000',
    difficulty: 'Moderate',
    Icon: Users,
    gradient: 'from-violet-600/85 to-purple-800/85',
  },
  {
    id: 'weekend',
    category: 'Weekend Escapes',
    tagline: 'Recharge in 48 hours',
    image: 'https://images.unsplash.com/photo-1492364089012-5a8e32ba734b?auto=format&fit=crop&w=900&q=80',
    duration: '2–3 days',
    budget: '₹5,000–₹18,000',
    difficulty: 'Easy',
    Icon: Sunrise,
    gradient: 'from-pink-500/85 to-rose-700/85',
  },
  {
    id: 'luxury',
    category: 'Luxury Packages',
    tagline: 'Travel without compromise',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
    duration: '7–21 days',
    budget: '₹1,50,000+',
    difficulty: 'Curated',
    Icon: Crown,
    gradient: 'from-yellow-500/85 to-amber-700/85',
  },
];

const buildSearchIndex = (trips, cities) => {
  const suggestions = [];
  trips.forEach((t) => {
    suggestions.push({ type: 'trip', label: t.name, sub: t.status, href: `/trips/${t.id}/view` });
  });
  cities.forEach((c) => {
    suggestions.push({ type: 'city', label: c.name, sub: `${c.country} · ${c.region}`, href: '/search/cities' });
  });
  return suggestions;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({ trips: [], stats: [] });
  const [liveCities, setLiveCities] = useState(cityDirectory);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [tripSearch, setTripSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tl-wishlist') || '[]'); } catch { return []; }
  });
  const inspirationRef = useRef(null);
  const searchRef = useRef(null);
  const adventureRailRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const loadDashboard = async () => {
      try {
        const [tripsResponse, citiesResponse] = await Promise.all([
          api.get('/trips?limit=6'),
          api.get('/cities?limit=50'),
        ]);
        if (cancelled) return;
        const liveTrips = (tripsResponse.data?.trips ?? []).map((trip) => hydrateTrip(trip));
        setDashboard({ trips: liveTrips, stats: [] });
        const fetchedCities = citiesResponse.data?.cities ?? [];
        if (fetchedCities.length) setLiveCities(fetchedCities);
      } catch {
        // network error — leave with empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadDashboard();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const searchIndex = buildSearchIndex(dashboard.trips ?? [], liveCities);

  const suggestions = tripSearch.trim().length > 1
    ? searchIndex.filter((item) =>
        item.label.toLowerCase().includes(tripSearch.toLowerCase()) ||
        item.sub.toLowerCase().includes(tripSearch.toLowerCase())
      ).slice(0, 7)
    : [];

  const visibleTrips = (dashboard.trips ?? []).filter((trip) => {
    const query = tripSearch.trim().toLowerCase();
    return (
      !query ||
      trip.name.toLowerCase().includes(query) ||
      trip.summary?.toLowerCase().includes(query) ||
      trip.description?.toLowerCase().includes(query) ||
      trip.status?.toLowerCase().includes(query)
    );
  });

  const regionCards = [...new Set(cityDirectory.map((city) => city.region))].map((region) => {
    const cities = cityDirectory.filter((city) => city.region === region);
    return { region, city: cities[0], count: cities.length };
  });

  const currentSlide = heroSlides[heroIndex];

  const moveInspiration = (direction) => {
    if (!inspirationRef.current) return;
    inspirationRef.current.scrollBy({ left: direction === 'next' ? 340 : -340, behavior: 'smooth' });
  };

  const moveAdventures = (direction) => {
    if (!adventureRailRef.current) return;
    adventureRailRef.current.scrollBy({ left: direction === 'next' ? 320 : -320, behavior: 'smooth' });
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem('tl-wishlist', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <AppLayout contentClassName="gap-7">
      {/* ── Hero Carousel ── */}
      <section className="hero-fade-in relative overflow-hidden rounded-[40px] border border-white/80 shadow-[0_34px_110px_rgba(15,23,42,0.12)]">
        <img alt={currentSlide.title} className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700" src={currentSlide.image} />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,23,42,0.82)_0%,rgba(15,23,42,0.50)_50%,rgba(15,23,42,0.22)_100%)]" />
        <div className="relative min-h-[372px] p-6 sm:p-8 lg:p-10">
          <div className="flex h-full max-w-4xl flex-col justify-between gap-8 text-white">
            <div className="space-y-5">
              <Eyebrow className="border-white/20 bg-white/12 text-white">Traveloop Dashboard</Eyebrow>
              <div className="space-y-4">
                <h1 className="max-w-4xl font-['Fraunces'] text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                  {currentSlide.title}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">{currentSlide.copy}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/trips/new')}>
                  <Plus size={17} />
                  Plan a trip
                </Button>
                <Button className="border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur hover:-translate-y-0.5" to="/community" variant="custom">
                  <Sparkles size={17} />
                  Explore community
                </Button>
                <Button className="border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur hover:-translate-y-0.5" to="/movie-itinerary" variant="custom">
                  🎬 Movie Trips
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                onClick={() => setHeroIndex((c) => (c - 1 + heroSlides.length) % heroSlides.length)}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                onClick={() => setHeroIndex((c) => (c + 1) % heroSlides.length)}
              >
                <ArrowRight size={18} />
              </button>
              <div className="flex items-center gap-2">
                {heroSlides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={cn('h-2.5 rounded-full transition-all', i === heroIndex ? 'w-10 bg-white' : 'w-2.5 bg-white/35')}
                    onClick={() => setHeroIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Smart Search Bar ── */}
      <PageSection>
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative min-w-0 flex-1 lg:min-w-[340px]" ref={searchRef}>
            <label className="field-shell min-h-14 gap-3 rounded-full px-4">
              <Search className="h-4.5 w-4.5 shrink-0 text-slate-400" />
              <input
                className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Search trips, destinations, cities, adventures…"
                value={tripSearch}
                onChange={(e) => { setTripSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
              />
              {tripSearch && (
                <button type="button" onClick={() => { setTripSearch(''); setShowSuggestions(false); }}>
                  <X className="h-4 w-4 text-slate-400 hover:text-slate-700" />
                </button>
              )}
            </label>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-[22px] border border-white/80 bg-white/96 shadow-[0_28px_80px_rgba(15,23,42,0.16)] backdrop-blur">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                    onClick={() => { setTripSearch(s.label); setShowSuggestions(false); navigate(s.href); }}
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                      {s.type === 'trip' ? <MapPinned size={14} className="text-slate-500" /> : <Compass size={14} className="text-teal-600" />}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{s.label}</p>
                      <p className="text-xs text-slate-400">{s.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button className="justify-start lg:min-w-[150px]" variant="secondary" onClick={() => navigate('/trips')}>
            <MapPinned size={16} />
            All trips
          </Button>
          <Button className="justify-start lg:min-w-[150px]" variant="secondary" onClick={() => navigate('/search/cities')}>
            <Filter size={16} />
            Discover cities
          </Button>
          <Button className="justify-start lg:min-w-[150px]" variant="secondary" onClick={() => navigate('/search/activities')}>
            <SlidersHorizontal size={16} />
            Find activities
          </Button>
        </div>
      </PageSection>

      {/* ── Top Regional Selections ── */}
      <PageSection>
        <SectionHeader
          eyebrow="Regional selections"
          title="Top regional selections"
          description="Premium browse layer for the regions people keep circling back to before committing to a trip."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {regionCards.map((item) => (
            <article
              key={item.region}
              className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-white/80 shadow-[0_20px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_90px_rgba(15,23,42,0.14)]"
              onClick={() => navigate('/search/cities')}
            >
              <img
                alt={item.city.name}
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                src={item.city.image_url}
                loading="lazy"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80'; }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.74)_100%)]" />
              <div className="absolute inset-x-5 bottom-5 text-white">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Eyebrow className="border-white/20 bg-white/14 text-[10px] text-white">{item.region}</Eyebrow>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{item.count} cities</span>
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">{item.city.name}</h3>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/56">From</p>
                    <p className="text-sm font-semibold">{formatCurrency(item.city.cost_index * 10)}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/16 transition group-hover:translate-x-1">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      {/* ── Adventures & Experiences ── */}
      <PageSection>
        <SectionHeader
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 transition hover:-translate-y-0.5"
                onClick={() => moveAdventures('prev')}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 transition hover:-translate-y-0.5"
                onClick={() => moveAdventures('next')}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          }
          eyebrow="Adventures & Experiences"
          title="Choose your travel style"
          description="Immersive experience-based categories — from solo escapes to luxury journeys. Tap to start planning."
        />
        <div className="hide-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2" ref={adventureRailRef}>
          {adventureCategories.map((adv) => (
            <article
              key={adv.id}
              className="group relative min-w-[280px] max-w-[280px] cursor-pointer overflow-hidden rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_32px_80px_rgba(15,23,42,0.20)]"
              onClick={() => navigate('/trips/new')}
            >
              <img
                alt={adv.category}
                className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
                src={adv.image}
                loading="lazy"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80'; }}
              />
              <div className={cn('absolute inset-0 bg-gradient-to-t', adv.gradient, 'opacity-90 group-hover:opacity-95 transition duration-300')} />
              {/* Wishlist */}
              <button
                type="button"
                className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur transition hover:bg-white/35"
                onClick={(e) => { e.stopPropagation(); toggleWishlist(adv.id); }}
                aria-label={wishlist.includes(adv.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={15} fill={wishlist.includes(adv.id) ? 'white' : 'none'} />
              </button>
              <div className="absolute inset-x-5 bottom-5 text-white">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
                  <adv.Icon size={11} />
                  {adv.difficulty}
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">{adv.category}</h3>
                <p className="mt-1 text-sm text-white/80">{adv.tagline}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/56">Budget est.</p>
                    <p className="text-sm font-semibold">{adv.budget}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/56">Duration</p>
                    <p className="text-sm font-semibold">{adv.duration}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-full border border-white/30 bg-white/18 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/28 group-hover:border-white/50"
                >
                  Start planning →
                </button>
              </div>
              {/* Trending badge */}
              {['solo', 'weekend', 'road'].includes(adv.id) && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-950">
                  <Star size={10} fill="currentColor" />
                  Trending
                </div>
              )}
            </article>
          ))}
        </div>
      </PageSection>

      {/* ── Previous Trips ── */}
      <PageSection>
        <SectionHeader
          action={
            <Button size="sm" to="/trips" variant="secondary">
              View all trips
            </Button>
          }
          eyebrow="Previous trips"
          title="Your trip workspace"
          description="Recent trip history redesigned as rich planning cards with stronger visual hierarchy and faster actions."
        />
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => <SkeletonCard key={item} />)}
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
        ) : tripSearch.trim() ? (
          <EmptyState
            action={
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => setTripSearch('')} variant="secondary">Clear search</Button>
                <Button onClick={() => navigate('/trips/new')}>
                  <Plus size={16} />
                  Create a new trip
                </Button>
              </div>
            }
            description={`No trips or destinations match "${tripSearch}". Try a different search or start a new itinerary.`}
            title="Nothing matched your search"
          />
        ) : (
          <EmptyState
            action={
              <Button onClick={() => navigate('/trips/new')}>
                <Plus size={16} />
                Create your first itinerary
              </Button>
            }
            description="You have not planned any trips yet. Start a new itinerary to get going."
            title="No trips yet"
          />
        )}
      </PageSection>

      {/* ── Travel Inspiration Rail ── */}
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
          description="A horizontal destination rail — tap any card to add it to your next itinerary."
        />
        <div className="hide-scrollbar -mx-1 flex gap-5 overflow-x-auto px-1 pb-2" ref={inspirationRef}>
          {destinationHighlights.map((destination) => (
            <article
              key={destination.id}
              className="min-w-[300px] max-w-[300px] overflow-hidden rounded-[30px] border border-white/80 bg-white/92 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 sm:min-w-[340px] sm:max-w-[340px]"
            >
              <div className="relative h-72">
                <img
                  alt={destination.name}
                  className="h-full w-full object-cover"
                  src={destination.image_url}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80'; }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.60))]" />
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

      {/* ── Movie Trips CTA ── */}
      <section
        className="relative overflow-hidden rounded-[36px] border border-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.10)] cursor-pointer group"
        onClick={() => navigate('/movie-itinerary')}
      >
        <img
          alt="Movie-inspired travel"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.88)_0%,rgba(15,23,42,0.55)_60%,rgba(15,23,42,0.28)_100%)]" />
        <div className="relative p-8 sm:p-10 lg:p-12">
          <div className="max-w-2xl space-y-5 text-white">
            <Eyebrow className="border-amber-300/30 bg-amber-400/20 text-amber-200">🎬 New feature</Eyebrow>
            <h2 className="font-['Fraunces'] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Travel like your favourite movie.
            </h2>
            <p className="text-base leading-7 text-white/80">
              From the vineyards of <em>Zindagi Na Milegi Dobara</em> to the wild trails of <em>Into the Wild</em> — generate a full cinematic itinerary in seconds.
            </p>
            <Button className="border border-white/20 bg-white/14 text-white hover:bg-white/24 backdrop-blur hover:-translate-y-0.5" variant="custom">
              <Sparkles size={17} />
              Explore movie trips
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

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
