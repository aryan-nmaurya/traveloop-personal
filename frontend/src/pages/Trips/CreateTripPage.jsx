import { useMemo, useRef, useState } from 'react';
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

  const selectedCity = useMemo(
    () => cityDirectory.find((city) => city.name === formData.destination) || cityDirectory[0],
    [formData.destination],
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <PageSection className="order-2 xl:order-1">
          <SectionHeader
            eyebrow="Trip form"
            title="Set the trip structure first"
            description="Choose the place, dates, cover, group size, and target budget before you move into day-by-day sections."
          />

          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
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
                {cityDirectory.map((city) => (
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

            <FormField className="md:col-span-2" icon={Text} label="Trip brief" shellClassName="items-start">
              <textarea
                name="description"
                onChange={handleChange}
                placeholder="Describe the mood, pace, and must-have stops for the journey."
                rows="5"
                value={formData.description}
              />
            </FormField>

            <label className="md:col-span-2 flex items-center gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/90 px-4 py-4 text-sm text-slate-700">
              <input checked={formData.isPublic} name="isPublic" onChange={handleChange} type="checkbox" />
              Make this trip public in the community gallery once it is polished.
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit">{loading ? 'Creating...' : 'Create trip and continue'}</Button>
              <Button to="/trips" variant="secondary">
                Cancel
              </Button>
            </div>
          </form>
        </PageSection>

        <div className="order-1 flex flex-col gap-6 xl:order-2">
          <PageSection className="overflow-hidden p-0">
            <div className="relative h-80">
              <img alt="Trip preview" className="h-full w-full object-cover" src={formData.coverPhoto || coverFallback} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0.65))]" />
              <div className="absolute inset-x-5 bottom-5 space-y-3 text-white">
                <Eyebrow className="border-white/16 bg-white/16 text-white">Live preview</Eyebrow>
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em]">{formData.name || 'Your trip title'}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    {formData.description || 'A premium summary of the trip will appear here as you write it.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <InfoBadge className="border-white/20 bg-white/12 text-white">{selectedCity.name}</InfoBadge>
                  <InfoBadge className="border-white/20 bg-white/12 text-white">{formatCurrency(formData.budget)}</InfoBadge>
                  <InfoBadge className="border-white/20 bg-white/12 text-white">{formData.travelers} travelers</InfoBadge>
                </div>
              </div>
            </div>
          </PageSection>

          <PageSection>
            <SectionHeader
              action={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
                    onClick={() => moveSuggestions('prev')}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
                    onClick={() => moveSuggestions('next')}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              }
              eyebrow="Suggestions"
              title="Strong starting points"
              description="A horizontal inspiration carousel instead of a long vertical stack, matching the requested premium behavior."
            />
            <div className="hide-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2" ref={suggestionRail}>
              {cityDirectory.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  className="min-w-[260px] overflow-hidden rounded-[26px] border border-white/80 bg-white text-left shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      destination: city.name,
                      coverPhoto: city.image_url,
                    }))
                  }
                >
                  <img alt={city.name} className="h-40 w-full object-cover" src={city.image_url} />
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.04em] text-slate-950">{city.name}</h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {city.country} • {city.region}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">{city.description}</p>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                      <span>Cost index {city.cost_index}</span>
                      <span>{city.popularity_score}/100</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </PageSection>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateTripPage;
