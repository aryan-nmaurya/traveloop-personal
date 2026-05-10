import { Calendar, ListPlus, MapPin, PiggyBank, Route, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, FormField, InfoBadge, PageIntro, PageSection, SectionHeader } from '../../components/ui/primitives';
import { cityDirectory, getTripById, hydrateTrip, profileFallback } from '../../data/mockData';
import { formatCurrency, formatDateRange } from '../../utils/formatters';

const defaultDraft = (trip, cities) => ({
  type: 'stay',
  city_id: cities?.[0]?.id ?? '',
  title: '',
  description: '',
  start_date: trip?.start_date ?? '',
  end_date: trip?.end_date ?? '',
  budget: 400,
});

const ItineraryBuilderPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [sections, setSections] = useState([]);
  const [cities, setCities] = useState(cityDirectory);
  const [draftSection, setDraftSection] = useState(defaultDraft(null, cityDirectory));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      api.get('/cities?limit=100').then((res) => {
        if (!cancelled && res.data.cities?.length) {
          setCities(res.data.cities);
          setDraftSection((d) => ({ ...d, city_id: d.city_id || res.data.cities[0]?.id || '' }));
        }
      }).catch(() => {});

      try {
        const [tripRes, sectionsRes] = await Promise.all([
          api.get(`/trips/${id}`),
          api.get(`/trips/${id}/sections`),
        ]);
        if (cancelled) return;

        const fallback = getTripById(id);
        const hydrated = hydrateTrip({
          ...(fallback ?? {}),
          ...tripRes.data,
          sections: [],
          checklist: fallback?.checklist ?? [],
          notes: fallback?.notes ?? [],
          traveler: fallback?.traveler ?? profileFallback,
        });
        setTrip(hydrated);
        setSections(sectionsRes.data ?? []);
        setDraftSection(defaultDraft(tripRes.data, cities));
      } catch {
        const fallback = getTripById(id);
        if (!cancelled && fallback) {
          setTrip(fallback);
          setSections(fallback.sections ?? []);
          setDraftSection(defaultDraft(fallback, cities));
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleDraftChange = (event) => {
    const { name, value } = event.target;
    setDraftSection((current) => ({ ...current, [name]: value }));
  };

  const handleAddSection = async (event) => {
    event.preventDefault();
    if (!draftSection.title.trim()) return;

    const cityId = draftSection.city_id ? Number(draftSection.city_id) : null;
    const cityName = cities.find((c) => c.id === cityId)?.name ?? '';
    const payload = {
      type: draftSection.type,
      description: draftSection.title + (draftSection.description ? ' — ' + draftSection.description : ''),
      start_date: draftSection.start_date || null,
      end_date: draftSection.end_date || null,
      budget: Number(draftSection.budget),
      city_id: cityId,
      order_index: sections.length,
      // for local display only
      _cityName: cityName,
    };

    setSaving(true);
    try {
      const res = await api.post(`/trips/${id}/sections`, payload);
      setSections((current) => [...current, res.data]);
      setDraftSection(defaultDraft(trip, cities));
    } catch {
      // fallback: add locally so the UI doesn't break
      setSections((current) => [...current, { ...payload, id: `local-${Date.now()}` }]);
      setDraftSection(defaultDraft(trip, cities));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (section) => {
    if (String(section.id).startsWith('local-')) {
      setSections((current) => current.filter((s) => s.id !== section.id));
      return;
    }
    try {
      await api.delete(`/trips/${id}/sections/${section.id}`);
      setSections((current) => current.filter((s) => s.id !== section.id));
    } catch {
      setSections((current) => current.filter((s) => s.id !== section.id));
    }
  };

  if (!trip) {
    return (
      <AppLayout>
        <EmptyState description="We could not find that trip." title="Trip not found" />
      </AppLayout>
    );
  }

  const totalBudget = sections.reduce((sum, s) => sum + Number(s.budget ?? 0), 0);

  return (
    <AppLayout>
      <PageIntro
        badges={[
          <InfoBadge key="range">{trip.date_range}</InfoBadge>,
          <InfoBadge key="status">{trip.status}</InfoBadge>,
          <InfoBadge key="budget" className={totalBudget > (trip.budget || Infinity) ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}>
            Spent: {formatCurrency(totalBudget)} {trip.budget ? ` / Limit: ${formatCurrency(trip.budget)}` : ''}
          </InfoBadge>,
        ]}
        description="The SVG shows a section-first builder. This version keeps that structure while turning each segment into a clearer, more flexible card workflow."
        eyebrow="Build itinerary"
        title={trip.name}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        <PageSection>
          <SectionHeader
            eyebrow="Section 1"
            title="Add a trip segment"
            description="Every section can be a stay, transfer, or experience. Build the flow from first stop to final return."
          />
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleAddSection}>
            <FormField icon={Route} label="Section type">
              <select name="type" value={draftSection.type} onChange={handleDraftChange}>
                <option value="stay">Stay</option>
                <option value="transfer">Transfer</option>
                <option value="experience">Experience</option>
                <option value="wellness">Wellness</option>
              </select>
            </FormField>
            <FormField icon={MapPin} label="City">
              <select name="city_id" value={draftSection.city_id} onChange={handleDraftChange}>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}{city.country ? `, ${city.country}` : ''}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField className="md:col-span-2" icon={ListPlus} label="Section title">
              <input name="title" value={draftSection.title} onChange={handleDraftChange} placeholder="Cliffside villa stay" />
            </FormField>
            <FormField className="md:col-span-2" icon={ListPlus} label="Section brief" shellClassName="items-start rounded-[24px] py-1">
              <textarea
                className="w-full bg-transparent border-0 outline-none"
                name="description"
                rows="4"
                value={draftSection.description}
                onChange={handleDraftChange}
                placeholder="Describe the hotel, transfer details, or activity specifics."
              />
            </FormField>
            <FormField icon={Calendar} label="Start date">
              <input name="start_date" type="date" value={draftSection.start_date} onChange={handleDraftChange} />
            </FormField>
            <FormField icon={Calendar} label="End date">
              <input name="end_date" type="date" value={draftSection.end_date} onChange={handleDraftChange} />
            </FormField>
            <FormField icon={PiggyBank} label="Budget of this section">
              <input name="budget" min="0" type="number" value={draftSection.budget} onChange={handleDraftChange} />
            </FormField>
            <div className="md:col-span-2">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add another section'}</Button>
            </div>
          </form>
        </PageSection>

        <div className="flex flex-col gap-6">
          <PageSection>
            <SectionHeader eyebrow="Trip overview" title="At a glance" />
            <div className="space-y-4">
              <div className="rounded-[24px] bg-slate-50/90 p-4">
                <p className="text-sm text-[var(--text-secondary)]">Total sections</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{sections.length}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50/90 p-4">
                <p className="text-sm text-[var(--text-secondary)]">Current budget</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" to={`/trips/${trip.id}/view`} variant="secondary">
                  Preview itinerary
                </Button>
                <Button size="sm" to="/search/activities" variant="secondary">
                  Search activities
                </Button>
              </div>
            </div>
          </PageSection>
        </div>
      </div>

      <PageSection>
        <SectionHeader eyebrow="Ordered sections" title="Current trip flow" />
        {sections.length ? (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <article
                key={section.id}
                className="grid gap-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:grid-cols-[130px_minmax(0,1fr)_auto]"
              >
                <div className="rounded-[22px] bg-[linear-gradient(180deg,#ecfeff,#f8fafc)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Section {index + 1}</p>
                  <p className="mt-3 text-sm font-semibold capitalize text-slate-900">{section.type}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{section.description || section.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(section._cityName || cities.find((c) => c.id === section.city_id)?.name) && (
                      <InfoBadge>📍 {section._cityName || cities.find((c) => c.id === section.city_id)?.name}</InfoBadge>
                    )}
                    <InfoBadge>{formatDateRange(section.start_date, section.end_date)}</InfoBadge>
                    <InfoBadge>{formatCurrency(section.budget)}</InfoBadge>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600"
                  onClick={() => handleDelete(section)}
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState description="Start by adding the first section above." title="No sections yet" />
        )}
      </PageSection>
    </AppLayout>
  );
};

export default ItineraryBuilderPage;
