import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Calendar, Check, ChevronRight, Globe2,
  MapPin, PiggyBank, Search, Sparkles, Text, Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { Button, FormField, InfoBadge, PageIntro, PageSection, SectionHeader } from '../../components/ui/primitives';
import api from '../../api/axiosInstance';
import { coverFallback, createLocalTrip } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { cn } from '../../utils/cn';

/* ── Step definitions ── */
const STEPS = [
  { id: 'country', label: 'Country', icon: Globe2 },
  { id: 'region', label: 'Region', icon: MapPin },
  { id: 'city', label: 'City', icon: MapPin },
  { id: 'details', label: 'Trip Details', icon: Sparkles },
];

const COUNTRY_FLAGS = {
  India: '🇮🇳', Spain: '🇪🇸', Maldives: '🇲🇻', Japan: '🇯🇵', France: '🇫🇷',
  Italy: '🇮🇹', Thailand: '🇹🇭', USA: '🇺🇸', Australia: '🇦🇺', Iceland: '🇮🇸',
  Portugal: '🇵🇹', Mexico: '🇲🇽', Greece: '🇬🇷', Turkey: '🇹🇷', Morocco: '🇲🇦',
};

const getFlag = (country) => COUNTRY_FLAGS[country] || '🌍';

/* ── Stepper bar ── */
const Stepper = ({ current, onStep, completedSteps }) => (
  <div className="flex items-center gap-1 overflow-x-auto pb-2">
    {STEPS.map((step, i) => {
      const done = completedSteps.includes(step.id);
      const active = current === step.id;
      const Icon = step.icon;
      return (
        <button
          key={step.id}
          type="button"
          disabled={!done && !active}
          onClick={() => done && onStep(step.id)}
          className={cn(
            'group flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-300',
            active
              ? 'border-teal-500/40 bg-teal-500/10 text-teal-600 shadow-[0_0_20px_rgba(20,184,166,0.12)]'
              : done
                ? 'border-emerald-300/40 bg-emerald-50 text-emerald-600 cursor-pointer hover:-translate-y-0.5'
                : 'border-slate-200/60 text-slate-400 cursor-not-allowed opacity-60',
          )}
        >
          {done && !active ? <Check size={13} /> : <Icon size={13} />}
          <span className="hidden sm:inline">{step.label}</span>
          {i < STEPS.length - 1 && <ChevronRight size={12} className="text-slate-300 ml-1" />}
        </button>
      );
    })}
  </div>
);

/* ── Selection card ── */
const SelectionCard = ({ image, title, subtitle, selected, onClick, badge }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'group relative flex flex-col overflow-hidden rounded-[24px] border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.15)]',
      selected
        ? 'border-teal-500/50 ring-2 ring-teal-500/20 shadow-[0_20px_60px_rgba(20,184,166,0.15)]'
        : 'border-slate-200/70',
    )}
  >
    <div className="relative h-36 overflow-hidden">
      <img
        src={image || coverFallback}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => { e.currentTarget.src = coverFallback; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      {selected && (
        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg">
          <Check size={14} />
        </div>
      )}
      {badge && (
        <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          {badge}
        </span>
      )}
    </div>
    <div className="p-4" style={{ background: 'var(--card-bg)' }}>
      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
      {subtitle && <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
  </button>
);

/* ── Search input ── */
const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      className="w-full rounded-full border py-3 pl-11 pr-4 text-sm outline-none transition"
      style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

/* ── Main page ── */
const CreateTripPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('country');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data from backend
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  // Selections
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Form data for step 4
  const [formData, setFormData] = useState({
    name: '', startDate: '', endDate: '', description: '',
    coverPhoto: '', budget: 2400, travelers: 2, isPublic: false,
  });

  const completedSteps = useMemo(() => {
    const done = [];
    if (selectedCountry) done.push('country');
    if (selectedRegion) done.push('region');
    if (selectedCity) done.push('city');
    return done;
  }, [selectedCountry, selectedRegion, selectedCity]);

  // Load countries on mount
  useEffect(() => {
    setLoading(true);
    api.get('/cities/countries')
      .then((res) => setCountries(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Load regions when country is selected
  useEffect(() => {
    if (!selectedCountry) return;
    setLoading(true);
    api.get(`/cities/regions?country=${encodeURIComponent(selectedCountry)}`)
      .then((res) => setRegions(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCountry]);

  // Load cities when region is selected
  useEffect(() => {
    if (!selectedCountry || !selectedRegion) return;
    setLoading(true);
    api.get(`/cities?country=${encodeURIComponent(selectedCountry)}&region=${encodeURIComponent(selectedRegion)}&limit=50`)
      .then((res) => setCities(res.data?.cities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCountry, selectedRegion]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
    setSelectedCity(null);
    setSearchQuery('');
    setStep('region');
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSelectedCity(null);
    setSearchQuery('');
    setStep('city');
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setFormData((d) => ({
      ...d,
      name: d.name || `Trip to ${city.name}`,
      coverPhoto: city.image_url || coverFallback,
    }));
    setSearchQuery('');
    setStep('details');
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((c) => ({ ...c, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const payload = {
      name: formData.name,
      description: formData.description,
      start_date: formData.startDate,
      end_date: formData.endDate,
      cover_photo_url: formData.coverPhoto || selectedCity?.image_url || coverFallback,
      budget: Number(formData.budget),
      is_public: formData.isPublic,
    };
    try {
      const response = await api.post('/trips', payload);
      navigate(`/trips/${response.data.id}/build`);
    } catch {
      const localTrip = createLocalTrip({ ...payload, destination: selectedCity?.name || '' });
      navigate(`/trips/${localTrip.id}/build`);
    } finally {
      setSubmitting(false);
    }
  };

  const filterBySearch = (items, keys) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => keys.some((k) => item[k]?.toLowerCase().includes(q)));
  };

  const heroImage = selectedCity?.image_url || selectedRegion?.image_url ||
    countries.find((c) => c.country === selectedCountry)?.image_url || coverFallback;

  return (
    <AppLayout>
      {/* Hero banner */}
      <div className="relative -mx-4 -mt-4 mb-8 overflow-hidden rounded-b-[36px] sm:-mx-6 lg:-mx-8" style={{ height: 280 }}>
        <img
          src={heroImage}
          alt="Trip destination"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
          onError={(e) => { e.currentTarget.src = coverFallback; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-6 bottom-8 text-white sm:inset-x-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-2">Create a new trip</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {selectedCity ? `${selectedCity.name}, ${selectedCity.country}` :
             selectedRegion ? `${selectedRegion}, ${selectedCountry}` :
             selectedCountry ? selectedCountry : 'Where do you want to go?'}
          </h1>
          {selectedCity?.description && (
            <p className="mt-2 max-w-xl text-sm text-white/70 line-clamp-2">{selectedCity.description}</p>
          )}
          {/* Breadcrumbs */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-white/50">
            {selectedCountry && <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">{getFlag(selectedCountry)} {selectedCountry}</span>}
            {selectedRegion && <><ChevronRight size={10} /><span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">{selectedRegion}</span></>}
            {selectedCity && <><ChevronRight size={10} /><span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">{selectedCity.name}</span></>}
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <Stepper current={step} onStep={setStep} completedSteps={completedSteps} />
      </div>

      {/* ── Step 1: Country ── */}
      {step === 'country' && (
        <PageSection>
          <SectionHeader eyebrow="Step 1" title="Choose your country" description="Where in the world are you headed?" />
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search countries…" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-52 animate-pulse rounded-[24px]" style={{ background: 'var(--surface)' }} />
              ))
            ) : (
              filterBySearch(countries, ['country']).map((c) => (
                <SelectionCard
                  key={c.country}
                  image={c.image_url}
                  title={`${getFlag(c.country)} ${c.country}`}
                  subtitle={`${c.city_count} destination${c.city_count > 1 ? 's' : ''}`}
                  selected={selectedCountry === c.country}
                  onClick={() => handleCountrySelect(c.country)}
                  badge={`${c.city_count} cities`}
                />
              ))
            )}
          </div>
        </PageSection>
      )}

      {/* ── Step 2: Region ── */}
      {step === 'region' && (
        <PageSection>
          <SectionHeader
            eyebrow="Step 2"
            title={`Regions in ${selectedCountry}`}
            description="Narrow down to the region you want to explore."
            action={<Button size="sm" variant="secondary" onClick={() => setStep('country')}><ArrowLeft size={14} /> Back</Button>}
          />
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search regions…" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-52 animate-pulse rounded-[24px]" style={{ background: 'var(--surface)' }} />
              ))
            ) : (
              filterBySearch(regions, ['region']).map((r) => (
                <SelectionCard
                  key={r.region}
                  image={r.image_url}
                  title={r.region}
                  subtitle={`${r.city_count} destination${r.city_count > 1 ? 's' : ''}`}
                  selected={selectedRegion === r.region}
                  onClick={() => handleRegionSelect(r.region)}
                  badge={`${r.city_count} cities`}
                />
              ))
            )}
          </div>
        </PageSection>
      )}

      {/* ── Step 3: City ── */}
      {step === 'city' && (
        <PageSection>
          <SectionHeader
            eyebrow="Step 3"
            title={`Cities in ${selectedRegion}`}
            description="Pick the exact destination for your trip."
            action={<Button size="sm" variant="secondary" onClick={() => setStep('region')}><ArrowLeft size={14} /> Back</Button>}
          />
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search cities…" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-52 animate-pulse rounded-[24px]" style={{ background: 'var(--surface)' }} />
              ))
            ) : (
              filterBySearch(cities, ['name', 'description']).map((city) => (
                <SelectionCard
                  key={city.id}
                  image={city.image_url}
                  title={city.name}
                  subtitle={city.description?.slice(0, 80)}
                  selected={selectedCity?.id === city.id}
                  onClick={() => handleCitySelect(city)}
                  badge={city.popularity_score ? `★ ${city.popularity_score}` : undefined}
                />
              ))
            )}
          </div>
        </PageSection>
      )}

      {/* ── Step 4: Trip Details ── */}
      {step === 'details' && (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <PageSection>
            <SectionHeader
              eyebrow="Step 4"
              title="Trip details"
              description="Set dates, budget, and describe your dream trip."
              action={<Button size="sm" variant="secondary" onClick={() => setStep('city')}><ArrowLeft size={14} /> Back</Button>}
            />
            <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
              <FormField className="md:col-span-2" icon={Sparkles} label="Trip title">
                <input name="name" onChange={handleChange} placeholder="My dream adventure…" required value={formData.name} />
              </FormField>
              <FormField icon={Calendar} label="Start date">
                <input name="startDate" onChange={handleChange} required type="date" value={formData.startDate} />
              </FormField>
              <FormField icon={Calendar} label="End date">
                <input name="endDate" onChange={handleChange} required type="date" value={formData.endDate} />
              </FormField>
              <FormField icon={Users} label="Travelers">
                <input min="1" name="travelers" onChange={handleChange} type="number" value={formData.travelers} />
              </FormField>
              <FormField icon={PiggyBank} label="Budget target">
                <input min="0" name="budget" onChange={handleChange} step="100" type="number" value={formData.budget} />
              </FormField>
              <FormField className="md:col-span-2" icon={Text} label="Trip brief" shellClassName="items-start rounded-[24px] py-1">
                <textarea
                  className="w-full bg-transparent border-0 outline-none"
                  name="description" onChange={handleChange}
                  placeholder="Describe the mood, pace, and must-have stops…"
                  rows="4" value={formData.description}
                />
              </FormField>
              <label className="md:col-span-2 flex items-center gap-3 rounded-[24px] border px-4 py-4 text-sm" style={{ background: 'var(--surface)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
                <input checked={formData.isPublic} name="isPublic" onChange={handleChange} type="checkbox" />
                Make this trip public in the community gallery.
              </label>
              <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                <Button size="lg" type="submit">{submitting ? 'Creating…' : 'Create trip & build itinerary'} <ArrowRight size={16} /></Button>
                <Button size="lg" to="/trips" variant="secondary">Cancel</Button>
              </div>
            </form>
          </PageSection>

          {/* Live Preview */}
          <div>
            <div className="sticky top-10">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>Live preview</p>
              </div>
              <article className="overflow-hidden rounded-[28px] border shadow-[0_24px_80px_rgba(15,23,42,0.1)]" style={{ borderColor: 'var(--card-border)' }}>
                <div className="relative h-[380px]">
                  <img
                    alt="Preview"
                    className="h-full w-full object-cover"
                    src={formData.coverPhoto || selectedCity?.image_url || coverFallback}
                    onError={(e) => { e.currentTarget.src = coverFallback; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-5 bottom-6 space-y-3 text-white">
                    <h2 className="text-2xl font-bold leading-tight">{formData.name || 'Your trip title'}</h2>
                    <p className="text-sm text-white/70 line-clamp-2">{formData.description || 'Your trip description…'}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">📍 {selectedCity?.name}</span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">💰 {formatCurrency(formData.budget)}</span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">👥 {formData.travelers}</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default CreateTripPage;
