import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, FormField, InfoBadge, PageIntro, PageSection, SectionHeader } from '../../components/ui/primitives';
import { useAuth } from '../../context/AuthContext';
import { profileFallback } from '../../data/mockData';

const ProfilePage = () => {
  const { user, setUser, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const baseProfile = { ...profileFallback, ...(user ?? {}) };
  const [draftForm, setDraftForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedDestinations, setSavedDestinations] = useState([]);
  const form = draftForm ?? baseProfile;

  useEffect(() => {
    api.get('/users/me/saved-destinations')
      .then((res) => setSavedDestinations(res.data ?? []))
      .catch(() => {
        setSavedDestinations(profileFallback.saved_destinations ?? []);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSaved(false);
    setError(null);
    setDraftForm({ ...form, [name]: value });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put('/users/me', {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        city: form.city,
        country: form.country,
        language_pref: form.language_pref,
      });
      await refreshProfile();
      setSaved(true);
      setDraftForm(null);
    } catch {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all your trips.')) return;
    try {
      await api.delete('/users/me');
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to delete account.');
    }
  };

  const handleRemoveDestination = async (cityId) => {
    try {
      await api.delete(`/users/me/saved-destinations/${cityId}`);
      setSavedDestinations((current) => current.filter((c) => c.id !== cityId));
    } catch { /* ignore */ }
  };

  return (
    <AppLayout>
      <PageIntro
        badges={[<InfoBadge key="language">{form.language_pref?.toUpperCase?.() || 'EN'}</InfoBadge>]}
        description="Keep identity, preferences, and saved destinations current so the planning experience feels more personal and more useful."
        eyebrow="User profile"
        title="Personalize your planning workspace."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
        <PageSection>
          <SectionHeader eyebrow="User details" title="Edit your account details" />
          {error ? (
            <div className="mb-4 rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSave}>
            <FormField label="First name">
              <input name="first_name" onChange={handleChange} value={form.first_name ?? ''} />
            </FormField>
            <FormField label="Last name">
              <input name="last_name" onChange={handleChange} value={form.last_name ?? ''} />
            </FormField>
            <FormField className="md:col-span-2" label="Email address">
              <input name="email" value={form.email ?? ''} disabled className="opacity-50" />
            </FormField>
            <FormField label="Phone number">
              <input name="phone" onChange={handleChange} value={form.phone ?? ''} />
            </FormField>
            <FormField label="Language">
              <select name="language_pref" onChange={handleChange} value={form.language_pref ?? 'en'}>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="ja">Japanese</option>
              </select>
            </FormField>
            <FormField label="City">
              <input name="city" onChange={handleChange} value={form.city ?? ''} />
            </FormField>
            <FormField label="Country">
              <input name="country" onChange={handleChange} value={form.country ?? ''} />
            </FormField>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</Button>
              {saved ? <InfoBadge>Profile updated.</InfoBadge> : null}
            </div>
          </form>
        </PageSection>

        <div className="flex flex-col gap-6">
          <PageSection>
            <SectionHeader eyebrow="Saved destinations" title="Places you keep returning to" />
            {savedDestinations.length ? (
              <div className="space-y-4">
                {savedDestinations.map((city) => (
                  <div key={city.id} className="flex items-center gap-4 rounded-[24px] bg-slate-50/90 p-3">
                    {city.image_url && (
                      <img alt={city.name} className="h-20 w-20 rounded-[20px] object-cover" src={city.image_url} />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{city.name}</h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{city.country}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveDestination(city.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState description="No saved cities yet." title="Nothing saved" />
            )}
          </PageSection>

          <PageSection className="bg-[linear-gradient(180deg,rgba(255,241,242,0.96),rgba(255,255,255,0.92))]">
            <SectionHeader eyebrow="Danger zone" title="Delete account" />
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              Permanently deletes your account, all trips, sections, and associated data. This cannot be undone.
            </p>
            <div className="mt-5">
              <Button variant="danger" onClick={handleDeleteAccount}>Delete account</Button>
            </div>
          </PageSection>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
