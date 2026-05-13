import { PenSquare, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, FormField, PageIntro, PageSection, SectionHeader, TabButton } from '../../components/ui/primitives';
import { formatDate } from '../../utils/formatters';

const TripNotesPage = () => {
  const { id } = useParams();
  const [tripName, setTripName] = useState('Trip');
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [draft, setDraft] = useState({ title: '', body: '' });
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);

  const filterParam = filter === 'all' ? '' : `?filter=${filter}`;

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/trips/${id}/notes${filterParam}`);
      setNotes(res.data ?? []);
    } catch {
      // keep existing state
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const tripRes = await api.get(`/trips/${id}`);
        if (!cancelled) setTripName(tripRes.data.name ?? tripName);
      } catch { /* trip name stays as default */ }
      if (!cancelled) fetchNotes();
    };
    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchNotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!draft.title.trim() && !draft.body.trim()) return;
    setSaving(true);
    try {
      if (editingNote) {
        await api.put(`/trips/${id}/notes/${editingNote.id}`, { title: draft.title, body: draft.body });
      } else {
        await api.post(`/trips/${id}/notes`, { title: draft.title, body: draft.body });
      }
      await fetchNotes();
      setDraft({ title: '', body: '' });
      setEditingNote(null);
      setOpen(false);
    } catch {
      // keep modal open
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setDraft({ title: note.title ?? '', body: note.body ?? '' });
    setOpen(true);
  };

  const handleDelete = async (note) => {
    try {
      await api.delete(`/trips/${id}/notes/${note.id}`);
      setNotes((current) => current.filter((n) => n.id !== note.id));
    } catch { /* ignore */ }
  };

  const handleOpenNew = () => {
    setEditingNote(null);
    setDraft({ title: '', body: '' });
    setOpen(true);
  };

  return (
    <AppLayout>
      <PageIntro
        actions={[
          <Button key="add" onClick={handleOpenNew}>
            <Plus size={16} />
            Add note
          </Button>,
        ]}
        description="A flexible journal space for stop notes, day notes, and planning scraps that should stay close to the itinerary."
        eyebrow="Trip notes"
        title={tripName}
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

      {notes.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {note.section_id && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      stop
                    </span>
                  )}
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{note.title}</h3>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => handleEdit(note)} className="text-slate-400 hover:text-slate-600">
                    <PenSquare size={16} />
                  </button>
                  <button type="button" onClick={() => handleDelete(note)} className="text-rose-400 hover:text-rose-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{note.body}</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                {formatDate(note.updated_at ?? note.created_at)}
              </p>
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
              <SectionHeader
                eyebrow={editingNote ? 'Edit note' : 'New note'}
                title={editingNote ? 'Update this note' : 'Capture it while it is fresh'}
              />
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
                <input value={draft.title} onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))} />
              </FormField>
              <FormField label="Body" shellClassName="items-start">
                <textarea
                  rows="5"
                  value={draft.body}
                  onChange={(e) => setDraft((c) => ({ ...c, body: e.target.value }))}
                />
              </FormField>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save note'}</Button>
                <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
};

export default TripNotesPage;
