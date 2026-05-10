import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { PageIntro, PageSection, SectionHeader, TabButton } from '../../components/ui/primitives';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const isAdmin = user?.role === 'admin';

  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;

    const load = async () => {
      const [usersRes, citiesRes, activitiesRes, trendsRes] = await Promise.allSettled([
        api.get('/admin/users'),
        api.get('/admin/analytics/popular-cities'),
        api.get('/admin/analytics/popular-activities'),
        api.get('/admin/analytics/user-trends'),
      ]);

      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value.data?.users ?? usersRes.value.data ?? []);
      }
      if (citiesRes.status === 'fulfilled') {
        setCities(citiesRes.value.data?.cities ?? citiesRes.value.data ?? []);
      }
      if (activitiesRes.status === 'fulfilled') {
        setActivities(activitiesRes.value.data?.activities ?? activitiesRes.value.data ?? []);
      }
      if (trendsRes.status === 'fulfilled') {
        setTrends(trendsRes.value.data?.trends ?? trendsRes.value.data ?? []);
      }
    };

    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <AppLayout>
        <PageIntro
          description="You do not have permission to access this page."
          eyebrow="Access denied"
          title="Admin access required"
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageIntro
        description="Operational visibility across users, cities, and booking momentum."
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
                  <th className="px-3 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userRow) => (
                  <tr key={userRow.id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-4 font-semibold text-slate-950">
                      {[userRow.first_name, userRow.last_name].filter(Boolean).join(' ') || userRow.name || '—'}
                    </td>
                    <td className="px-3 py-4">{userRow.email}</td>
                    <td className="px-3 py-4">{userRow.role}</td>
                    <td className="px-3 py-4">
                      {userRow.created_at ? new Date(userRow.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-400">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </PageSection>
      ) : null}

      {tab === 'cities' ? (
        <PageSection>
          <SectionHeader eyebrow="Popular cities" title="Cities with strong trip momentum" />
          <div className="space-y-4">
            {cities.map((city, i) => {
              const name = city.city_name ?? city.name ?? '—';
              const count = city.section_count ?? city.trips ?? 0;
              return (
                <div key={city.city_id ?? city.name ?? i} className="grid gap-4 rounded-[24px] bg-slate-50/90 p-4 md:grid-cols-[220px_minmax(0,1fr)_80px] md:items-center">
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{name}</h3>
                  </div>
                  <div className="h-3 rounded-full bg-white">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0ea5e9)]" style={{ width: `${Math.min(count / 2, 100)}%` }} />
                  </div>
                  <div className="text-right text-sm font-semibold text-slate-900">{count}</div>
                </div>
              );
            })}
            {cities.length === 0 && (
              <p className="text-sm text-slate-400">No data available.</p>
            )}
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
                  <th className="px-3 py-3 font-semibold">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, i) => (
                  <tr key={activity.activity_id ?? activity.name ?? i} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-4 font-semibold text-slate-950">
                      {activity.activity_name ?? activity.name ?? '—'}
                    </td>
                    <td className="px-3 py-4">{activity.usage_count ?? activity.bookings ?? '—'}</td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr><td colSpan={2} className="px-3 py-6 text-center text-sm text-slate-400">No data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </PageSection>
      ) : null}

      {tab === 'trends' ? (
        <PageSection>
          <SectionHeader eyebrow="User trends" title="Signup and trip momentum over time" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trends.map((entry, i) => {
              const newUsers = entry.new_users ?? entry.signups ?? 0;
              return (
                <article key={entry.month ?? i} className="rounded-[24px] bg-slate-50/90 p-4">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{entry.month}</h3>
                  <div className="mt-4 h-3 rounded-full bg-white">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0ea5e9)]" style={{ width: `${Math.min(newUsers / 3, 100)}%` }} />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
                    {newUsers} new users
                  </p>
                </article>
              );
            })}
            {trends.length === 0 && (
              <p className="text-sm text-slate-400 xl:col-span-4">No trend data available.</p>
            )}
          </div>
        </PageSection>
      ) : null}
    </AppLayout>
  );
};

export default AdminDashboardPage;
