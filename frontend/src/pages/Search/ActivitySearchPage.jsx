import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { Button, EmptyState, PageIntro, PageSection, SearchField, Toolbar } from '../../components/ui/primitives';
import { activityDirectory, cityDirectory } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

const ActivitySearchPage = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [cityId, setCityId] = useState('All');
  const [maxCost, setMaxCost] = useState(200);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const types = ['All', ...new Set(activityDirectory.map((activity) => activity.type))];

  const filtered = activityDirectory.filter((activity) => {
    const matchesQuery =
      !query ||
      activity.name.toLowerCase().includes(query.toLowerCase()) ||
      activity.description.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === 'All' || activity.type === type;
    const matchesCity = cityId === 'All' || String(activity.city_id) === String(cityId);
    const matchesCost = Number(activity.cost) <= Number(maxCost);
    return matchesQuery && matchesType && matchesCity && matchesCost;
  });

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
              {types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="field-shell min-h-14 rounded-full lg:min-w-[210px]">
            <select value={cityId} onChange={(event) => setCityId(event.target.value)}>
              <option value="All">All cities</option>
              {cityDirectory.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <label className="surface-card flex min-h-14 min-w-[240px] flex-1 flex-col justify-center gap-2 rounded-[26px] px-4 py-3 lg:max-w-[300px]">
            <span className="text-sm font-semibold text-slate-900">Max cost {formatCurrency(maxCost)}</span>
            <input max="200" min="25" step="5" type="range" value={maxCost} onChange={(event) => setMaxCost(event.target.value)} />
          </label>
        </Toolbar>
      </PageSection>

      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((activity) => {
            const city = cityDirectory.find((item) => item.id === activity.city_id);
            return (
              <article
                key={activity.id}
                className="overflow-hidden rounded-[30px] border border-white/80 bg-white/92 shadow-[0_22px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
              >
                <img alt={activity.name} className="h-60 w-full object-cover" src={activity.image_url} />
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{activity.name}</h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {city?.name} • {activity.type}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {formatCurrency(activity.cost)}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">{activity.description}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">{Math.round(activity.duration_minutes / 60)} hours</span>
                    <Button size="sm" variant="secondary" onClick={() => setSelectedActivity(activity.name)}>
                      Add activity
                    </Button>
                  </div>
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

      {selectedActivity ? (
        <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/80 bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_rgba(15,23,42,0.24)]">
          {selectedActivity} has been staged for your selected section.
        </div>
      ) : null}
    </AppLayout>
  );
};

export default ActivitySearchPage;
