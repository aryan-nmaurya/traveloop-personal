import { useEffect, useState } from 'react';
import { Activity, BarChart3, Globe2, MapPin, TrendingUp, Users as UsersIcon } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { PageIntro, PageSection, SectionHeader, TabButton } from '../../components/ui/primitives';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <article
    className="flex items-center gap-4 rounded-[24px] border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)]"
    style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
  >
    <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full', color)}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  </article>
);

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const isAdmin = user?.role === 'admin';

  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;

    const load = async () => {
      const [overviewRes, usersRes, citiesRes, activitiesRes, trendsRes] = await Promise.allSettled([
        api.get('/admin/analytics/overview'),
        api.get('/admin/users'),
        api.get('/admin/analytics/popular-cities'),
        api.get('/admin/analytics/popular-activities'),
        api.get('/admin/analytics/user-trends'),
      ]);

      if (overviewRes.status === 'fulfilled') setOverview(overviewRes.value.data);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data?.users ?? []);
      if (citiesRes.status === 'fulfilled') setCities(citiesRes.value.data?.cities ?? []);
      if (activitiesRes.status === 'fulfilled') setActivities(activitiesRes.value.data?.activities ?? []);
      if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value.data?.trends ?? []);
    };

    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <AppLayout>
        <PageIntro description="You do not have permission to access this page." eyebrow="Access denied" title="Admin access required" />
      </AppLayout>
    );
  }

  const maxCityScore = Math.max(...cities.map((c) => c.section_count || 0), 1);

  return (
    <AppLayout>
      <PageIntro
        description="Operational visibility across users, destinations, activities, and platform growth."
        eyebrow="Admin panel"
        title="Platform analytics & management"
      />

      {/* Overview stats */}
      {overview && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={UsersIcon} label="Total users" value={overview.total_users} color="bg-[linear-gradient(135deg,#0f766e,#0ea5e9)]" />
          <StatCard icon={MapPin} label="Total trips" value={overview.total_trips} color="bg-[linear-gradient(135deg,#7c3aed,#a855f7)]" />
          <StatCard icon={Globe2} label="Destinations" value={overview.total_cities} color="bg-[linear-gradient(135deg,#ea580c,#f59e0b)]" />
          <StatCard icon={Activity} label="Activities" value={overview.total_activities} color="bg-[linear-gradient(135deg,#dc2626,#f43f5e)]" />
        </div>
      )}

      {/* Tabs */}
      <PageSection>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'users', label: '👥 Manage users' },
            { value: 'cities', label: '🏙 Popular cities' },
            { value: 'activities', label: '🎯 Top activities' },
            { value: 'trends', label: '📈 User trends' },
          ].map((item) => (
            <TabButton key={item.value} active={tab === item.value} onClick={() => setTab(item.value)}>
              {item.label}
            </TabButton>
          ))}
        </div>
      </PageSection>

      {/* Users tab */}
      {tab === 'users' && (
        <PageSection>
          <SectionHeader eyebrow="Manage users" title="All registered users" />
          <div className="overflow-x-auto rounded-[20px] border" style={{ borderColor: 'var(--card-border)' }}>
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr style={{ background: 'var(--surface)' }}>
                  <th className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Name</th>
                  <th className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Email</th>
                  <th className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Role</th>
                  <th className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Location</th>
                  <th className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t transition hover:opacity-80" style={{ borderColor: 'var(--line)' }}>
                    <td className="px-4 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9)] text-xs font-bold text-white">
                          {(u.first_name?.[0] || '') + (u.last_name?.[0] || '') || 'U'}
                        </div>
                        {[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-4" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4" style={{ color: 'var(--text-muted)' }}>{[u.city, u.country].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-4 py-4" style={{ color: 'var(--text-muted)' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </PageSection>
      )}

      {/* Cities tab */}
      {tab === 'cities' && (
        <PageSection>
          <SectionHeader eyebrow="Popular cities" title="Destinations ranked by popularity" />
          <div className="space-y-3">
            {cities.map((city, i) => (
              <div
                key={city.city_id ?? i}
                className="grid gap-4 rounded-[20px] border p-4 md:grid-cols-[40px_200px_minmax(0,1fr)_80px] md:items-center"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                <span className="hidden text-lg font-bold md:block" style={{ color: 'var(--text-muted)' }}>#{i + 1}</span>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{city.city_name}</h3>
                <div className="h-3 overflow-hidden rounded-full" style={{ background: 'var(--surface)' }}>
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0ea5e9)] transition-all duration-700"
                    style={{ width: `${Math.max((city.section_count / maxCityScore) * 100, 4)}%` }}
                  />
                </div>
                <span className="text-right text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{city.section_count}</span>
              </div>
            ))}
            {cities.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No city data available.</p>}
          </div>
        </PageSection>
      )}

      {/* Activities tab */}
      {tab === 'activities' && (
        <PageSection>
          <SectionHeader eyebrow="Top activities" title="Most popular experiences" />
          <div className="overflow-x-auto rounded-[20px] border" style={{ borderColor: 'var(--card-border)' }}>
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr style={{ background: 'var(--surface)' }}>
                  <th className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-muted)' }}>#</th>
                  <th className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Activity</th>
                  <th className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Bookings</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, i) => (
                  <tr key={a.activity_id ?? i} className="border-t transition" style={{ borderColor: 'var(--line)' }}>
                    <td className="px-4 py-4 font-bold" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td className="px-4 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{a.activity_name}</td>
                    <td className="px-4 py-4" style={{ color: 'var(--text-secondary)' }}>{a.usage_count}</td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No activity data.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </PageSection>
      )}

      {/* Trends tab */}
      {tab === 'trends' && (
        <PageSection>
          <SectionHeader eyebrow="User trends" title="Signup momentum over time" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {trends.map((entry, i) => (
              <article
                key={entry.month ?? i}
                className="rounded-[24px] border p-5 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: 'var(--accent-primary)' }} />
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{entry.month}</h3>
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight" style={{ color: 'var(--accent-primary)' }}>{entry.new_users}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>new users</p>
              </article>
            ))}
            {trends.length === 0 && <p className="text-sm xl:col-span-4" style={{ color: 'var(--text-muted)' }}>No trend data available.</p>}
          </div>
        </PageSection>
      )}
    </AppLayout>
  );
};

export default AdminDashboardPage;
