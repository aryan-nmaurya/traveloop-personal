import { useEffect, useState } from 'react';
import { ArrowUpDown, Edit2, Plus, Search, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import TripCard from '../../components/features/TripCard';
import api from '../../api/axiosInstance';
import { getAllTrips, hydrateTrip, removeLocalTrip } from '../../data/mockData';
import { Button, EmptyState, PageIntro, PageSection, SearchField, SectionHeader, SkeletonCard, TabButton, Toolbar } from '../../components/ui/primitives';

const sortOptions = {
  newest: 'Newest first',
  budget: 'Highest budget',
  status: 'Status',
  alphabetical: 'Alphabetical',
};

const statusOrder = ['Ongoing', 'Upcoming', 'Completed', 'Draft'];

const TripsListPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [editingTripId, setEditingTripId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  useEffect(() => {
    let cancelled = false;

    const loadTrips = async () => {
      try {
        const response = await api.get('/trips');
        if (!cancelled) {
          const liveTrips = (response.data?.trips ?? []).map((trip) => hydrateTrip(trip));
          setTrips(liveTrips.length ? liveTrips : getAllTrips());
        }
      } catch {
        if (!cancelled) {
          setTrips(getAllTrips());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTrips();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTrips = trips
    .filter((trip) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        trip.name.toLowerCase().includes(query) ||
        trip.description?.toLowerCase().includes(query) ||
        trip.summary?.toLowerCase().includes(query);
      const matchesTab = activeTab === 'All' || trip.status === activeTab;
      return matchesSearch && matchesTab;
    })
    .sort((left, right) => {
      if (sortBy === 'alphabetical') return left.name.localeCompare(right.name);
      if (sortBy === 'budget') return Number(right.budget ?? 0) - Number(left.budget ?? 0);
      if (sortBy === 'status') return left.status.localeCompare(right.status);
      return new Date(right.created_at ?? right.start_date ?? 0) - new Date(left.created_at ?? left.start_date ?? 0);
    });

  const groupedTrips =
    activeTab === 'All'
      ? statusOrder.map((status) => ({
          status,
          trips: filteredTrips.filter((trip) => trip.status === status),
        }))
      : [{ status: activeTab, trips: filteredTrips }];

  const handleEditOpen = (trip) => {
    setEditingTripId(trip.id);
    setEditDraft({
      name: trip.name ?? '',
      description: trip.description ?? '',
      start_date: trip.start_date ?? '',
      end_date: trip.end_date ?? '',
      budget: trip.budget ?? '',
      cover_photo_url: trip.cover_photo_url ?? '',
      is_public: trip.is_public ?? false,
    });
  };

  const handleEditSave = async (tripId) => {
    try {
      const res = await api.put(`/trips/${tripId}`, editDraft);
      setTrips((current) =>
        current.map((t) => String(t.id) === String(tripId) ? hydrateTrip({ ...t, ...res.data }) : t)
      );
    } catch { /* keep existing state */ }
    setEditingTripId(null);
  };

  const handleDelete = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}`);
    } catch {
      removeLocalTrip(tripId);
    } finally {
      setTrips((current) => current.filter((trip) => String(trip.id) !== String(tripId)));
    }
  };

  return (
    <AppLayout>
      <PageIntro
        actions={[
          <Button key="new" onClick={() => navigate('/trips/new')}>
            <Plus size={16} />
            Plan a trip
          </Button>,
        ]}
        description="Search, sort, and scan your ongoing, upcoming, completed, and draft journeys through the same polished trip card system used across the app."
        eyebrow="User trip listing"
        title="Everything you have planned, grouped in one place."
      />

      <PageSection>
        <Toolbar className="mb-5">
          <SearchField className="min-w-0 lg:min-w-[340px] lg:flex-1" icon={Search}>
            <input
              placeholder="Search trips, places, summaries, or traveler notes"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </SearchField>

          <label className="field-shell min-h-14 rounded-full lg:min-w-[220px]">
            <ArrowUpDown className="h-4.5 w-4.5 text-slate-400" />
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </Toolbar>

        <div className="flex flex-wrap gap-2">
          {['All', ...statusOrder].map((tab) => (
            <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </TabButton>
          ))}
        </div>
      </PageSection>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <SkeletonCard key={item} />
          ))}
        </div>
      ) : groupedTrips.some((group) => group.trips.length > 0) ? (
        groupedTrips.map((group) =>
          group.trips.length ? (
            <PageSection key={group.status}>
              <SectionHeader
                action={<span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{group.trips.length} trips</span>}
                eyebrow="Previous trips"
                title={group.status}
                description={`A ${group.status.toLowerCase()} slice of your travel workspace.`}
              />
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {group.trips.map((trip) => (
                  <div key={trip.id} className="space-y-3">
                    <TripCard
                      actions={[
                        { label: 'View', to: `/trips/${trip.id}/view`, tone: 'primary' },
                        { label: 'Build', to: `/trips/${trip.id}/build` },
                        { label: 'Budget', to: `/trips/${trip.id}/invoice` },
                      ]}
                      trip={trip}
                    />
                    <div className="flex flex-wrap items-center gap-3 px-2 text-sm font-medium">
                      <Link className="text-slate-600 transition hover:text-slate-950" to={`/trips/${trip.id}/checklist`}>
                        Checklist
                      </Link>
                      <Link className="text-slate-600 transition hover:text-slate-950" to={`/trips/${trip.id}/notes`}>
                        Notes
                      </Link>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-slate-600 transition hover:text-slate-950"
                        onClick={() => handleEditOpen(trip)}
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-rose-600 transition hover:text-rose-700"
                        onClick={() => handleDelete(trip.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>

                    {editingTripId === trip.id ? (
                      <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">Edit trip</p>
                          <button type="button" onClick={() => setEditingTripId(null)} className="text-slate-400 hover:text-slate-700">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Trip name</label>
                            <input
                              className="mt-1 w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                              value={editDraft.name}
                              onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Description</label>
                            <textarea
                              rows="2"
                              className="mt-1 w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                              value={editDraft.description}
                              onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Start date</label>
                            <input
                              type="date"
                              className="mt-1 w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                              value={editDraft.start_date}
                              onChange={(e) => setEditDraft((d) => ({ ...d, start_date: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">End date</label>
                            <input
                              type="date"
                              className="mt-1 w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                              value={editDraft.end_date}
                              onChange={(e) => setEditDraft((d) => ({ ...d, end_date: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Budget</label>
                            <input
                              type="number"
                              min="0"
                              className="mt-1 w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                              value={editDraft.budget}
                              onChange={(e) => setEditDraft((d) => ({ ...d, budget: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Cover image URL</label>
                            <input
                              type="url"
                              className="mt-1 w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                              value={editDraft.cover_photo_url}
                              onChange={(e) => setEditDraft((d) => ({ ...d, cover_photo_url: e.target.value }))}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                              <input
                                type="checkbox"
                                checked={editDraft.is_public}
                                onChange={(e) => setEditDraft((d) => ({ ...d, is_public: e.target.checked }))}
                              />
                              Make this trip public in the community gallery
                            </label>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <Button size="sm" onClick={() => handleEditSave(trip.id)}>Save changes</Button>
                          <Button size="sm" variant="secondary" onClick={() => setEditingTripId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </PageSection>
          ) : null,
        )
      ) : (
        <EmptyState
          action={
            <Button onClick={() => navigate('/trips/new')}>
              <Plus size={16} />
              Start a new itinerary
            </Button>
          }
          description="No trips matched the active filters. Try a broader search or begin a fresh planning workspace."
          title="No trips matched your filters"
        />
      )}
    </AppLayout>
  );
};

export default TripsListPage;
