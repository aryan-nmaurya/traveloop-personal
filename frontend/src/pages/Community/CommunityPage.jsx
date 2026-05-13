import { ArrowUpDown, Copy, Filter, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import TripCard from '../../components/features/TripCard';
import api from '../../api/axiosInstance';
import { Button, EmptyState, PageIntro, PageSection, SearchField, Toolbar } from '../../components/ui/primitives';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
];

const CommunityPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [trips, setTrips] = useState([]);
  const [copiedTrip, setCopiedTrip] = useState(null);
  const [copying, setCopying] = useState(null);
  const debounceRef = useRef(null);

  const fetchTrips = useCallback(async (q, sort, status) => {
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
      // Apply status filter client-side since the community endpoint doesn't support it natively.
      if (status) {
        data = data.filter((t) => t.status === status);
      }
      setTrips(data);
    } catch {
      // keep existing state
    }
  }, []);

  useEffect(() => {
    fetchTrips(query, sortBy, statusFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, statusFilter]);

  const handleQueryChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchTrips(value, sortBy, statusFilter), 300);
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

  const activeFilterCount = statusFilter ? 1 : 0;

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
          <Button
            className="justify-start lg:min-w-[150px] relative"
            variant={showFilterPanel ? 'primary' : 'secondary'}
            onClick={() => setShowFilterPanel((v) => !v)}
          >
            <Filter size={16} />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
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

        {showFilterPanel && (
          <div className="mt-4 rounded-[22px] border border-slate-200/80 bg-slate-50/90 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Filter by trip status</p>
              {statusFilter && (
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                  onClick={() => setStatusFilter('')}
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setStatusFilter(f.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    statusFilter === f.value
                      ? 'border-teal-500/40 bg-teal-500/10 text-teal-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
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
