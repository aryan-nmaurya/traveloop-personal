import { RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, FormField, InfoBadge, PageIntro, PageSection, SectionHeader, SkeletonCard } from '../../components/ui/primitives';
import { getChecklistProgress } from '../../data/mockData';

const ChecklistPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState({ name: 'Trip' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('General');
  const [name, setName] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [tripRes, checklistRes] = await Promise.all([
          api.get(`/trips/${id}`),
          api.get(`/trips/${id}/checklist`),
        ]);
        if (cancelled) return;
        setTrip(tripRes.data ?? { name: 'Trip' });
        const apiItems = checklistRes.data?.items ?? checklistRes.data ?? [];
        setItems(Array.isArray(apiItems) ? apiItems : []);
      } catch {
        // show empty state — do not fall back to demo data
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const grouped = items.reduce((accumulator, item) => {
    accumulator[item.category] = [...(accumulator[item.category] ?? []), item];
    return accumulator;
  }, {});

  const progress = getChecklistProgress(items);

  const handleAddItem = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    const optimisticItem = {
      id: `local-${Date.now()}`,
      name,
      category,
      is_packed: false,
    };

    try {
      const res = await api.post(`/trips/${id}/checklist`, { name, category });
      setItems((current) => [...current, res.data]);
    } catch {
      setItems((current) => [...current, optimisticItem]);
    }
    setName('');
  };

  const handleToggle = async (item) => {
    const newValue = !item.is_packed;
    // Optimistic update
    setItems((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, is_packed: newValue } : entry))
    );
    if (!String(item.id).startsWith('local-')) {
      try {
        await api.put(`/trips/${id}/checklist/${item.id}`, { is_packed: newValue });
      } catch {
        // Revert on error
        setItems((current) =>
          current.map((entry) => (entry.id === item.id ? { ...entry, is_packed: item.is_packed } : entry))
        );
      }
    }
  };

  const handleDelete = async (item) => {
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    if (!String(item.id).startsWith('local-')) {
      try {
        await api.delete(`/trips/${id}/checklist/${item.id}`);
      } catch {
        // item is already removed optimistically — don't revert, keep UX clean
      }
    }
  };

  const handleResetAll = async () => {
    setItems((current) => current.map((item) => ({ ...item, is_packed: false })));
    try {
      await api.post(`/trips/${id}/checklist/reset`);
    } catch {
      // optimistic update already applied
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageIntro
        badges={[<InfoBadge key="progress">{progress.percent}% complete</InfoBadge>]}
        description="A polished packing checklist with progress, reset/share actions, and grouped sections for each item category."
        eyebrow="Packing checklist"
        title={trip.name}
      />

      <PageSection>
        <div className="space-y-4">
          <div className="h-3 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0ea5e9)]" style={{ width: `${progress.percent}%` }} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="secondary" onClick={handleResetAll}>
              <RotateCcw size={16} />
              Reset all
            </Button>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <form className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px_auto]" onSubmit={handleAddItem}>
          <FormField label="Add item">
            <input placeholder="Add item to checklist" value={name} onChange={(event) => setName(event.target.value)} />
          </FormField>
          <FormField label="Category">
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="General">General</option>
              <option value="Documents">Documents</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
            </select>
          </FormField>
          <div className="flex items-end">
            <Button className="w-full md:w-auto" type="submit">
              Add item
            </Button>
          </div>
        </form>
      </PageSection>

      <div className="grid gap-5 xl:grid-cols-3">
        {Object.entries(grouped).map(([groupName, groupItems]) => (
          <PageSection key={groupName}>
            <SectionHeader
              action={<span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{groupItems.filter((item) => item.is_packed).length}/{groupItems.length}</span>}
              eyebrow="Category"
              title={groupName}
            />
            <div className="space-y-3">
              {groupItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-[22px] bg-slate-50/90 px-4 py-3 text-sm text-slate-700">
                  <input
                    checked={item.is_packed}
                    type="checkbox"
                    onChange={() => handleToggle(item)}
                  />
                  <span className="flex-1">{item.name}</span>
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => handleDelete(item)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </PageSection>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="xl:col-span-3">
            <EmptyState description="Add your first item above to get started." title="No checklist items yet" />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ChecklistPage;
