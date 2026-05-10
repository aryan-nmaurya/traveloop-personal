import { PenSquare, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { Button, EmptyState, FormField, PageIntro, PageSection, SectionHeader, TabButton } from '../../components/ui/primitives';
import { getTripById } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';

const TripNotesPage = () => {
  const { id } = useParams();
  const trip = getTripById(id);
  const [notes, setNotes] = useState(trip?.notes ?? []);
  const [filter, setFilter] = useState('all');
  const [draft, setDraft] = useState({ title: '', body: '' });
  const [open, setOpen] = useState(false);

  if (!trip) {
    return (
      <AppLayout>
        <EmptyState description="The notes feed could not be loaded for this trip." title="Notes unavailable" />
      </AppLayout>
    );
  }

  const visibleNotes = notes.filter((note) => filter === 'all' || note.filter === filter);

  const handleSave = (event) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.body.trim()) return;

    setNotes((current) => [
      {
        id: `${Date.now()}`,
        filter,
        title: draft.title,
        body: draft.body,
        timestamp: new Date().toISOString(),
      },
      ...current,
    ]);
    setDraft({ title: '', body: '' });
    setOpen(false);
  };

  return (
    <AppLayout>
      <PageIntro
        actions={[
          <Button key="add" onClick={() => setOpen(true)}>
            <Plus size={16} />
            Add note
          </Button>,
        ]}
        description="A flexible journal space for stop notes, day notes, and planning scraps that should stay close to the itinerary."
        eyebrow="Trip notes"
        title={trip.name}
      />

      <PageSection>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All', value: 'all' },
            { label: 'By day', value: 'day' },
            { label: 'By stop', value: 'stop' },
          ].map((tab) => (
            <TabButton key={tab.value} active={filter === tab.value} onClick={() => setFilter(tab.value)}>
              {tab.label}
            </TabButton>
          ))}
        </div>
      </PageSection>

      {visibleNotes.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleNotes.map((note) => (
            <article
              key={note.id}
              className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {note.filter}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{note.title}</h3>
                </div>
                <PenSquare size={16} className="text-slate-400" />
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{note.body}</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{formatDate(note.timestamp)}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState description="Create the first note to start the journal feed." title="No notes yet" />
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/80 bg-white p-6 shadow-[0_34px_110px_rgba(15,23,42,0.18)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <SectionHeader eyebrow="New note" title="Capture it while it is fresh" />
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <form className="grid gap-5" onSubmit={handleSave}>
              <FormField label="Title">
                <input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
              </FormField>
              <FormField label="Body" shellClassName="items-start">
                <textarea
                  rows="5"
                  value={draft.body}
                  onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value }))}
                />
              </FormField>
              <div className="flex flex-wrap gap-3">
                <Button type="submit">Save note</Button>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
};

export default TripNotesPage;
