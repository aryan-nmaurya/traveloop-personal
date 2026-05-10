import { MapPinned, Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, PageIntro, PageSection, SearchField, Toolbar } from '../../components/ui/primitives';
import { cityDirectory, coverFallback } from '../../data/mockData';

const resolveImage = (url) => url || coverFallback;

const CitySearchPage = () => {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');
  const [cities, setCities] = useState(cityDirectory);
  const [regions, setRegions] = useState(['All', ...new Set(cityDirectory.map((c) => c.region).filter(Boolean))]);
  const [addedCity, setAddedCity] = useState(null);
  const debounceRef = useRef(null);

  const fetchCities = useCallback(async (q, reg) => {
    try {
      const params = new URLSearchParams({ page: 1, limit: 50 });
      if (q) params.set('q', q);
      if (reg && reg !== 'All') params.set('region', reg);
      const res = await api.get(`/cities?${params}`);
      const data = res.data.cities ?? [];
      setCities(data);
      if (!q && reg === 'All') {
        setRegions(['All', ...new Set(data.map((c) => c.region).filter(Boolean))]);
      }
    } catch {
      // keep existing state
    }
  }, []);

  useEffect(() => {
    fetchCities('', 'All');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCities(query, region);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const handleQueryChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchCities(value, region), 300);
  };

  const handleSaveDestination = async (city) => {
    try {
      await api.post(`/users/me/saved-destinations/${city.id}`);
    } catch { /* ignore */ }
    setAddedCity(city.name);
    setTimeout(() => setAddedCity(null), 3000);
  };

  return (
    <AppLayout>
      <PageIntro
        description="Compare region, country, cost profile, and popularity through a cleaner search surface before pulling a city into trip creation."
        eyebrow="City search"
        title="Search destinations with context, not just names."
      />

      <PageSection>
        <Toolbar>
          <SearchField className="min-w-0 lg:min-w-[340px] lg:flex-1" icon={Search}>
            <input placeholder="Search cities or countries" value={query} onChange={handleQueryChange} />
          </SearchField>
          <label className="field-shell min-h-14 rounded-full lg:min-w-[240px]">
            <MapPinned className="h-4.5 w-4.5 text-slate-400" />
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </Toolbar>
      </PageSection>

      {cities.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cities.map((city) => (
            <article
              key={city.id}
              className="overflow-hidden rounded-[30px] border border-white/80 bg-white/92 shadow-[0_22px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
            >
              <img
                alt={city.name}
                className="h-64 w-full object-cover"
                src={resolveImage(city.image_url)}
                loading="lazy"
                onError={(e) => { e.currentTarget.src = coverFallback; }}
              />
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{city.name}</h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {city.country} • {city.region}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {city.popularity_score}/100
                  </span>
                </div>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">{city.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-900">Cost index {city.cost_index}</span>
                  <Button size="sm" variant="secondary" onClick={() => handleSaveDestination(city)}>
                    <Plus size={15} />
                    Save destination
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="No destinations match the current search filters."
          title="No cities found"
        />
      )}

      {addedCity ? (
        <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/80 bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_rgba(15,23,42,0.24)]">
          {addedCity} saved to your destinations.
        </div>
      ) : null}
    </AppLayout>
  );
};

export default CitySearchPage;
