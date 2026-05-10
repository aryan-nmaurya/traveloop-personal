import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { Button, EmptyState, FormField, InfoBadge, PageIntro, PageSection, SectionHeader } from '../../components/ui/primitives';
import { useAuth } from '../../context/AuthContext';
import { profileFallback } from '../../data/mockData';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const baseProfile = {
    ...profileFallback,
    ...(user ?? {}),
    saved_destinations: profileFallback.saved_destinations,
  };

  const [draftForm, setDraftForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const form = draftForm ?? baseProfile;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSaved(false);
    setDraftForm({ ...form, [name]: value });
  };

  const handleSave = (event) => {
    event.preventDefault();
    setUser((current) => ({ ...(current ?? {}), ...form }));
    setSaved(true);
    setDraftForm(null);
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
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSave}>
            <FormField label="First name">
              <input name="first_name" onChange={handleChange} value={form.first_name ?? ''} />
            </FormField>
            <FormField label="Last name">
              <input name="last_name" onChange={handleChange} value={form.last_name ?? ''} />
            </FormField>
            <FormField className="md:col-span-2" label="Email address">
              <input name="email" onChange={handleChange} value={form.email ?? ''} />
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
              <Button type="submit">Save profile</Button>
              {saved ? <InfoBadge>Profile updated locally.</InfoBadge> : null}
            </div>
          </form>
        </PageSection>

        <div className="flex flex-col gap-6">
          <PageSection>
            <SectionHeader eyebrow="Saved destinations" title="Places you keep returning to" />
            {profileFallback.saved_destinations.length ? (
              <div className="space-y-4">
                {profileFallback.saved_destinations.map((city) => (
                  <div key={city.id} className="flex items-center gap-4 rounded-[24px] bg-slate-50/90 p-3">
                    <img alt={city.name} className="h-20 w-20 rounded-[20px] object-cover" src={city.image_url} />
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{city.name}</h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{city.country}</p>
                    </div>
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
              This preview does not call a destructive backend flow yet, but the final control belongs here in the overall product structure.
            </p>
            <div className="mt-5">
              <Button variant="danger">Delete account</Button>
            </div>
          </PageSection>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
