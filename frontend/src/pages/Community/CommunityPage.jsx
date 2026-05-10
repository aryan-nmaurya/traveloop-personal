import { ArrowUpDown, Copy, Filter, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import TripCard from '../../components/features/TripCard';
import api from '../../api/axiosInstance';
import { Button, EmptyState, PageIntro, PageSection, SearchField, Toolbar } from '../../components/ui/primitives';
import { communityTrips } from '../../data/mockData';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [trips, setTrips] = useState(communityTrips);
  const [copiedTrip, setCopiedTrip] = useState(null);
  const [copying, setCopying] = useState(null);
  const debounceRef = useRef(null);

  const fetchTrips = useCallback(async (q, sort) => {
    try {
      const params = new URLSearchParams({ page: 1, limit: 20 });
      if (q) params.set('q', q);
      if (sort === 'latest') params.set('sort', 'recent');
      else if (sort === 'popular') params.set('sort', 'popular');
      const res = await api.get(`/community?${params}`);
      let data = res.data.trips ?? [];
      if (sort === 'budget') {
        data = [...data].sort((a, b) => Number(a.budget ?? 0) - Number(b.budget ?? 0));
      }
      setTrips(data);
    } catch {
      // keep existing state
    }
  }, []);

  useEffect(() => {
    fetchTrips(query, sortBy);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleQueryChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchTrips(value, sortBy), 300);
  };

  const handleCopyTrip = async (trip) => {
    setCopying(trip.id);
    try {
      await api.post(`/trips/${trip.id}/copy`);
      setCopiedTrip(trip.name);
      setTimeout(() => setCopiedTrip(null), 4000);
      setTimeout(() => navigate('/trips'), 1500);
    } catch {
      // ignore
    } finally {
      setCopying(null);
    }
  };

  return (
    <AppLayout>
      <PageIntro
        description="A community surface where travelers share trip structures, experiences, and ideas you can reuse inside your own workspace."
        eyebrow="Community"
        title="Borrow great ideas from itineraries that already feel lived-in."
      />

      <PageSection>
        <Toolbar>
          <SearchField className="min-w-0 lg:min-w-[320px] lg:flex-1" icon={Search}>
            <input
              placeholder="Search trips, travelers, or experience styles"
              value={query}
              onChange={handleQueryChange}
            />
          </SearchField>
          <Button className="justify-start lg:min-w-[150px]" variant="secondary">
            <Filter size={16} />
            Filter
          </Button>
          <label className="field-shell min-h-14 rounded-full lg:min-w-[220px]">
            <ArrowUpDown className="h-4.5 w-4.5 text-slate-400" />
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="popular">Most popular</option>
              <option value="latest">Latest departures</option>
              <option value="budget">Lowest budget</option>
            </select>
          </label>
        </Toolbar>
      </PageSection>

      {trips.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              actions={[
                { label: 'View', to: `/trips/${trip.id}/view`, tone: 'primary' },
                {
                  label: copying === trip.id ? 'Copying…' : 'Copy trip',
                  onClick: () => handleCopyTrip(trip),
                },
              ]}
              trip={trip}
              variant="community"
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description="No community trips matched the current search terms."
          title="No public itineraries found"
        />
      )}

      {copiedTrip ? (
        <div className="fixed bottom-5 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/80 bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_rgba(15,23,42,0.24)]">
          <Copy size={16} />
          {copiedTrip} has been copied into your workspace queue.
        </div>
      ) : null}
    </AppLayout>
  );
};

export default CommunityPage;
