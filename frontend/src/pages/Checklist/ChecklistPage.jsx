import { RotateCcw, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { Button, EmptyState, FormField, InfoBadge, PageIntro, PageSection, SectionHeader } from '../../components/ui/primitives';
import { getChecklistProgress, getTripById } from '../../data/mockData';

const ChecklistPage = () => {
  const { id } = useParams();
  const trip = getTripById(id);
  const [items, setItems] = useState(trip?.checklist ?? []);
  const [category, setCategory] = useState('General');
  const [name, setName] = useState('');

  if (!trip) {
    return (
      <AppLayout>
        <EmptyState description="The checklist could not be loaded for this trip." title="Checklist unavailable" />
      </AppLayout>
    );
  }

  const grouped = items.reduce((accumulator, item) => {
    accumulator[item.category] = [...(accumulator[item.category] ?? []), item];
    return accumulator;
  }, {});
  const progress = getChecklistProgress(items);

  const handleAddItem = (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    setItems((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        name,
        category,
        is_packed: false,
      },
    ]);
    setName('');
  };

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
            <Button size="sm" variant="secondary" onClick={() => setItems((current) => current.map((item) => ({ ...item, is_packed: false })))}>
              <RotateCcw size={16} />
              Reset all
            </Button>
            <Button size="sm" variant="secondary">
              <Share2 size={16} />
              Share checklist
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
                <label key={item.id} className="flex items-center gap-3 rounded-[22px] bg-slate-50/90 px-4 py-3 text-sm text-slate-700">
                  <input
                    checked={item.is_packed}
                    type="checkbox"
                    onChange={() =>
                      setItems((current) =>
                        current.map((entry) => (entry.id === item.id ? { ...entry, is_packed: !entry.is_packed } : entry)),
                      )
                    }
                  />
                  <span>{item.name}</span>
                </label>
              ))}
            </div>
          </PageSection>
        ))}
      </div>
    </AppLayout>
  );
};

export default ChecklistPage;
