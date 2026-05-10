import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Globe2,
  MapPin,
  PiggyBank,
  Sparkles,
  Text,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { Button, Eyebrow, FormField, InfoBadge, PageIntro, PageSection, SectionHeader } from '../../components/ui/primitives';
import api from '../../api/axiosInstance';
import { cityDirectory, coverFallback, createLocalTrip } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState(cityDirectory);
  const suggestionRail = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    destination: cityDirectory[0].name,
    startDate: '',
    endDate: '',
    description: '',
    coverPhoto: coverFallback,
    budget: 2400,
    travelers: 2,
    isPublic: false,
  });

  useEffect(() => {
    api.get('/cities?limit=100')
      .then((res) => { if (res.data.cities?.length) setCities(res.data.cities); })
      .catch(() => {});
  }, []);

  const selectedCity = useMemo(
    () => cities.find((city) => city.name === formData.destination) || cities[0] || cityDirectory[0],
    [formData.destination, cities],
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      start_date: formData.startDate,
      end_date: formData.endDate,
      cover_photo_url: formData.coverPhoto,
      budget: Number(formData.budget),
      is_public: formData.isPublic,
    };

    try {
      const response = await api.post('/trips', payload);
      navigate(`/trips/${response.data.id}/build`);
      return;
    } catch {
      const localTrip = createLocalTrip({
        ...payload,
        destination: formData.destination,
      });
      navigate(`/trips/${localTrip.id}/build`);
    } finally {
      setLoading(false);
    }
  };

  const moveSuggestions = (direction) => {
    if (!suggestionRail.current) return;

    suggestionRail.current.scrollBy({
      left: direction === 'next' ? 320 : -320,
      behavior: 'smooth',
    });
  };

  return (
    <AppLayout>
      <PageIntro
        actions={[
          <Button key="cancel" to="/trips" variant="secondary">
            Back to trips
          </Button>,
        ]}
        badges={[
          <InfoBadge key="budget">{formatCurrency(formData.budget)}</InfoBadge>,
          <InfoBadge key="travelers">{formData.travelers} travelers</InfoBadge>,
        ]}
        description="Use the wireframe’s core form hierarchy, then elevate it with better spacing, preview feedback, and horizontal inspiration browsing."
        eyebrow="Create a new trip"
        title="Plan a new trip"
      />

      <div className="flex flex-col gap-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          {/* ── Trip Form ── */}
          <PageSection className="order-2 xl:order-1">
            <SectionHeader
              eyebrow="Trip details"
              title="Set the trip structure"
              description="Choose the place, dates, cover, group size, and target budget before you move into day-by-day sections."
            />

            <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
              <FormField className="md:col-span-2" icon={Sparkles} label="Trip title">
                <input
                  name="name"
                  onChange={handleChange}
                  placeholder="Mediterranean Summer Circuit"
                  required
                  value={formData.name}
                />
              </FormField>

              <FormField icon={MapPin} label="Select a place">
                <select name="destination" onChange={handleChange} value={formData.destination}>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}, {city.country}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField hint="Touch friendly" icon={Users} label="Travelers">
                <input min="1" name="travelers" onChange={handleChange} type="number" value={formData.travelers} />
              </FormField>

              <FormField icon={Calendar} label="Start date">
                <input name="startDate" onChange={handleChange} required type="date" value={formData.startDate} />
              </FormField>

              <FormField icon={Calendar} label="End date">
                <input name="endDate" onChange={handleChange} required type="date" value={formData.endDate} />
              </FormField>

              <FormField icon={PiggyBank} label="Budget target">
                <input min="0" name="budget" onChange={handleChange} step="100" type="number" value={formData.budget} />
              </FormField>

              <FormField icon={Globe2} label="Cover image URL">
                <input name="coverPhoto" onChange={handleChange} type="url" value={formData.coverPhoto} />
              </FormField>

              <FormField className="md:col-span-2" icon={Text} label="Trip brief" shellClassName="items-start rounded-[24px] py-1">
                <textarea
                  className="w-full bg-transparent border-0 outline-none"
                  name="description"
                  onChange={handleChange}
                  placeholder="Describe the mood, pace, and must-have stops for the journey."
                  rows="5"
                  value={formData.description}
                />
              </FormField>

              <label className="md:col-span-2 flex items-center gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/90 px-4 py-4 text-sm text-slate-700 dark:bg-slate-800/50 dark:border-slate-700/60 dark:text-slate-300">
                <input checked={formData.isPublic} name="isPublic" onChange={handleChange} type="checkbox" />
                Make this trip public in the community gallery once it is polished.
              </label>

              <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                <Button size="lg" type="submit">{loading ? 'Creating...' : 'Create trip and continue'}</Button>
                <Button size="lg" to="/trips" variant="secondary">
                  Cancel
                </Button>
              </div>
            </form>
          </PageSection>

          {/* ── Live Preview ── */}
          <div className="order-1 xl:order-2">
            <div className="sticky top-10">
              <article className="surface-card overflow-hidden">
                <div className="relative h-[480px]">
                  <img alt="Trip preview" className="h-full w-full object-cover transition-opacity duration-500" src={formData.coverPhoto || coverFallback} onError={(e) => { e.currentTarget.src = coverFallback; }} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.92))]" />
                  <div className="absolute inset-x-7 bottom-8 space-y-5 text-white">
                    <Eyebrow className="border-white/25 bg-black/30 text-white backdrop-blur-md shadow-lg">Live preview</Eyebrow>
                    <div className="space-y-3">
                      <h2 className="text-4xl font-semibold tracking-[-0.04em] leading-[1.1]">{formData.name || 'Your trip title'}</h2>
                      <p className="text-base leading-7 text-white/80 line-clamp-4">
                        {formData.description || 'A premium summary of the trip will appear here as you write it.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <InfoBadge className="border-white/20 bg-white/12 text-white">{selectedCity.name}</InfoBadge>
                      <InfoBadge className="border-white/20 bg-white/12 text-white">{formatCurrency(formData.budget)}</InfoBadge>
                      <InfoBadge className="border-white/20 bg-white/12 text-white">{formData.travelers} travelers</InfoBadge>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>

        {/* ── Suggestions Section ── */}
        <PageSection className="w-full">
          <SectionHeader
            action={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  onClick={() => moveSuggestions('prev')}
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  onClick={() => moveSuggestions('next')}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            }
            eyebrow="Suggestions"
            title="Strong starting points"
            description="A horizontal inspiration carousel to help you choose the right base for your next itinerary."
          />
          <div className="hide-scrollbar -mx-1 flex gap-5 overflow-x-auto px-1 pb-4" ref={suggestionRail}>
            {cities.map((city) => (
              <button
                key={city.id}
                type="button"
                className="min-w-[300px] group overflow-hidden rounded-[30px] border border-white/80 bg-white text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 dark:bg-slate-800/90 dark:border-slate-700/60"
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    destination: city.name,
                    coverPhoto: city.image_url || coverFallback,
                  }))
                }
              >
                <div className="relative h-44 overflow-hidden">
                  <img alt={city.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" src={city.image_url || coverFallback} onError={(e) => { e.currentTarget.src = coverFallback; }} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300" />
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">{city.name}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {city.country} • {city.region}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600 line-clamp-2 dark:text-slate-400">{city.description}</p>
                  <div className="flex items-center justify-between pt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <PiggyBank size={14} className="text-teal-600" />
                      Cost {city.cost_index}
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <Sparkles size={14} />
                      {city.popularity_score}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </PageSection>
      </div>
    </AppLayout>
  );
};

export default CreateTripPage;
