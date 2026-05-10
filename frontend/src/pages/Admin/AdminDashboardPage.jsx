import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { PageIntro, PageSection, SectionHeader, TabButton } from '../../components/ui/primitives';
import { useAuth } from '../../context/AuthContext';
import { adminInsights } from '../../data/mockData';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const isAdmin = user?.role === 'admin';

  return (
    <AppLayout>
      <PageIntro
        description={isAdmin ? 'Operational visibility across users, cities, and booking momentum.' : 'This preview represents the admin-only analytics surface from the wireframe set.'}
        eyebrow="Admin panel"
        title="Operational visibility across the platform."
      />

      <PageSection>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'users', label: 'Manage users' },
            { value: 'cities', label: 'Popular cities' },
            { value: 'activities', label: 'Popular activities' },
            { value: 'trends', label: 'User trends' },
          ].map((item) => (
            <TabButton key={item.value} active={tab === item.value} onClick={() => setTab(item.value)}>
              {item.label}
            </TabButton>
          ))}
        </div>
      </PageSection>

      {tab === 'users' ? (
        <PageSection>
          <SectionHeader eyebrow="Manage users" title="User details with moderation context" />
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-semibold">Name</th>
                  <th className="px-3 py-3 font-semibold">Email</th>
                  <th className="px-3 py-3 font-semibold">Role</th>
                  <th className="px-3 py-3 font-semibold">Trips</th>
                  <th className="px-3 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {adminInsights.users.map((userRow) => (
                  <tr key={userRow.id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-4 font-semibold text-slate-950">{userRow.name}</td>
                    <td className="px-3 py-4">{userRow.email}</td>
                    <td className="px-3 py-4">{userRow.role}</td>
                    <td className="px-3 py-4">{userRow.trips}</td>
                    <td className="px-3 py-4">{userRow.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageSection>
      ) : null}

      {tab === 'cities' ? (
        <PageSection>
          <SectionHeader eyebrow="Popular cities" title="Cities with strong trip momentum" />
          <div className="space-y-4">
            {adminInsights.cities.map((city) => (
              <div key={city.name} className="grid gap-4 rounded-[24px] bg-slate-50/90 p-4 md:grid-cols-[220px_minmax(0,1fr)_80px] md:items-center">
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{city.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{city.growth} growth</p>
                </div>
                <div className="h-3 rounded-full bg-white">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0ea5e9)]" style={{ width: `${Math.min(city.trips / 2, 100)}%` }} />
                </div>
                <div className="text-right text-sm font-semibold text-slate-900">{city.trips}</div>
              </div>
            ))}
          </div>
        </PageSection>
      ) : null}

      {tab === 'activities' ? (
        <PageSection>
          <SectionHeader eyebrow="Popular activities" title="Experiences users keep booking" />
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-semibold">Activity</th>
                  <th className="px-3 py-3 font-semibold">Type</th>
                  <th className="px-3 py-3 font-semibold">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {adminInsights.activities.map((activity) => (
                  <tr key={activity.name} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-4 font-semibold text-slate-950">{activity.name}</td>
                    <td className="px-3 py-4">{activity.type}</td>
                    <td className="px-3 py-4">{activity.bookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageSection>
      ) : null}

      {tab === 'trends' ? (
        <PageSection>
          <SectionHeader eyebrow="User trends" title="Signup and trip momentum over time" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {adminInsights.userTrends.map((entry) => (
              <article key={entry.month} className="rounded-[24px] bg-slate-50/90 p-4">
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{entry.month}</h3>
                <div className="mt-4 h-3 rounded-full bg-white">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0ea5e9)]" style={{ width: `${entry.signups / 3}%` }} />
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
                  {entry.signups} signups • {entry.trips} trips
                </p>
              </article>
            ))}
          </div>
        </PageSection>
      ) : null}
    </AppLayout>
  );
};

export default AdminDashboardPage;
