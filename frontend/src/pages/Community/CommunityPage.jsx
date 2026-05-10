import { ArrowUpDown, Copy, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import TripCard from '../../components/features/TripCard';
import { Button, EmptyState, PageIntro, PageSection, SearchField, Toolbar } from '../../components/ui/primitives';
import { communityTrips } from '../../data/mockData';

const CommunityPage = () => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [copiedTrip, setCopiedTrip] = useState(null);

  const trips = [...communityTrips]
    .filter((trip) => {
      const queryText = query.trim().toLowerCase();
      return (
        !queryText ||
        trip.name.toLowerCase().includes(queryText) ||
        trip.description.toLowerCase().includes(queryText) ||
        trip.traveler.name.toLowerCase().includes(queryText)
      );
    })
    .sort((left, right) => {
      if (sortBy === 'budget') return Number(left.budget) - Number(right.budget);
      if (sortBy === 'latest') return new Date(right.start_date) - new Date(left.start_date);
      return right.popularity_score - left.popularity_score;
    });

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
              onChange={(event) => setQuery(event.target.value)}
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
                { label: 'Copy trip', onClick: () => setCopiedTrip(trip.name) },
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
