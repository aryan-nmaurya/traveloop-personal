import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, PageIntro, PageSection, SearchField, Toolbar } from '../../components/ui/primitives';
import { cityDirectory } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

const ACTIVITY_TYPES = ['All', 'physical', 'cultural', 'food', 'adventure'];
const MAX_COST_CAP = 10000;

const ActivitySearchPage = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [cityId, setCityId] = useState('All');
  const [maxCost, setMaxCost] = useState(MAX_COST_CAP);
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState(cityDirectory);

  // Add-to-section picker state
  const [pickingFor, setPickingFor] = useState(null); // activity being added
  const [userTrips, setUserTrips] = useState([]);
  const [pickTrip, setPickTrip] = useState('');
  const [tripSections, setTripSections] = useState([]);
  const [pickSection, setPickSection] = useState('');
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchActivities = async (params) => {
    try {
      const searchParams = new URLSearchParams({ page: 1, limit: 50 });
      if (params.cityId && params.cityId !== 'All') searchParams.set('city_id', params.cityId);
      if (params.type && params.type !== 'All') searchParams.set('type', params.type);
      if (params.maxCost && params.maxCost < MAX_COST_CAP) searchParams.set('max_cost', params.maxCost);
      const res = await api.get(`/activities?${searchParams}`);
      setActivities(res.data.activities ?? []);
    } catch {
      // keep existing state
    }
  };

  useEffect(() => {
    api.get('/cities?limit=100')
      .then((res) => setCities(res.data.cities ?? cityDirectory))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchActivities({ cityId, type, maxCost });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId, type, maxCost]);

  const filtered = query.trim()
    ? activities.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          (a.description ?? '').toLowerCase().includes(query.toLowerCase()),
      )
    : activities;

  const openPicker = async (activity) => {
    setPickingFor(activity);
    setPickTrip('');
    setPickSection('');
    setTripSections([]);
    if (!userTrips.length) {
      try {
        const res = await api.get('/trips?limit=50');
        setUserTrips(res.data.trips ?? []);
      } catch { /* ignore */ }
    }
  };

  const handleTripChange = async (tripId) => {
    setPickTrip(tripId);
    setPickSection('');
    if (!tripId) { setTripSections([]); return; }
    try {
      const res = await api.get(`/trips/${tripId}/sections`);
      setTripSections(res.data ?? []);
    } catch {
      setTripSections([]);
    }
  };

  const handleAddConfirm = async () => {
    if (!pickTrip || !pickSection || !pickingFor) return;
    setAdding(true);
    try {
      await api.post(`/trips/${pickTrip}/sections/${pickSection}/activities`, {
        activity_id: pickingFor.id,
      });
      setToast(`"${pickingFor.name}" added to your trip section.`);
      setPickingFor(null);
    } catch (err) {
      const msg = err.response?.data?.detail ?? 'Failed to add activity.';
      setToast(msg);
    } finally {
      setAdding(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <AppLayout>
      <PageIntro
        description="Filter by city, experience type, and price ceiling to find activities that fit the stop and the budget."
        eyebrow="Activity search"
        title="Find experiences that fit the trip rhythm."
      />

      <PageSection>
        <Toolbar>
          <SearchField className="min-w-0 lg:min-w-[320px] lg:flex-1" icon={Search}>
            <input
              placeholder="Search activity names or descriptions"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </SearchField>
          <label className="field-shell min-h-14 rounded-full lg:min-w-[210px]">
            <SlidersHorizontal className="h-4.5 w-4.5 text-slate-400" />
            <select value={type} onChange={(event) => setType(event.target.value)}>
              {ACTIVITY_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item === 'All' ? 'All types' : item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="field-shell min-h-14 rounded-full lg:min-w-[210px]">
            <select value={cityId} onChange={(event) => setCityId(event.target.value)}>
              <option value="All">All cities</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <label className="surface-card flex min-h-14 min-w-[240px] flex-1 flex-col justify-center gap-2 rounded-[26px] px-4 py-3 lg:max-w-[300px]">
            <span className="text-sm font-semibold text-slate-900">
              Max cost {maxCost >= MAX_COST_CAP ? 'Any' : formatCurrency(maxCost)}
            </span>
            <input
              max={MAX_COST_CAP}
              min="100"
              step="100"
              type="range"
              value={maxCost}
              onChange={(event) => setMaxCost(Number(event.target.value))}
            />
          </label>
        </Toolbar>
      </PageSection>

      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((activity) => {
            const city = cities.find((item) => item.id === activity.city_id);
            const isPicking = pickingFor?.id === activity.id;
            return (
              <article
                key={activity.id}
                className="overflow-hidden rounded-[30px] border border-white/80 bg-white/92 shadow-[0_22px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
              >
                <img
                  alt={activity.name}
                  className="h-60 w-full object-cover"
                  src={activity.image_url}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200'; }}
                />
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{activity.name}</h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {city?.name ?? '—'} • {activity.type}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {formatCurrency(activity.cost)}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">{activity.description}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">{Math.round(activity.duration_minutes / 60)} hours</span>
                    <Button size="sm" variant="secondary" onClick={() => isPicking ? setPickingFor(null) : openPicker(activity)}>
                      {isPicking ? 'Cancel' : 'Add to trip'}
                    </Button>
                  </div>

                  {isPicking && (
                    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Select trip & section</p>
                      <select
                        className="w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                        value={pickTrip}
                        onChange={(e) => handleTripChange(e.target.value)}
                      >
                        <option value="">— Choose a trip —</option>
                        {userTrips.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      {tripSections.length > 0 && (
                        <select
                          className="w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                          value={pickSection}
                          onChange={(e) => setPickSection(e.target.value)}
                        >
                          <option value="">— Choose a section —</option>
                          {tripSections.map((s) => (
                            <option key={s.id} value={s.id}>{s.description || `Section ${s.order_index + 1}`}</option>
                          ))}
                        </select>
                      )}
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={!pickTrip || !pickSection || adding}
                        onClick={handleAddConfirm}
                      >
                        {adding ? 'Adding…' : 'Confirm'}
                      </Button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          description="No activities match the current cost and category settings."
          title="No activities found"
        />
      )}

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/80 bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_rgba(15,23,42,0.24)]">
          {toast}
        </div>
      ) : null}
    </AppLayout>
  );
};

export default ActivitySearchPage;
