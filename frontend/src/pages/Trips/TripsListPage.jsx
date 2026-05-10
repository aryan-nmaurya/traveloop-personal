import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import TripCard from '../../components/features/TripCard';
import { Search, Plus, Filter, ArrowUpDown, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import '../Dashboard/Dashboard.css'; // Reusing dashboard styles for search bar and grid

const MOCK_TRIPS = [
  { id: 1, name: 'Summer in Europe', date_range: 'Jun 12 - Jul 05', destinations_count: 4, status: 'Upcoming', cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Japan Cherry Blossom', date_range: 'Apr 02 - Apr 15', destinations_count: 3, status: 'Completed', cover_photo_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Bali Retreat', date_range: 'Sep 10 - Sep 20', destinations_count: 1, status: 'Ongoing', cover_photo_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
  { id: 4, name: 'New York Weekend', date_range: 'Dec 10 - Dec 12', destinations_count: 1, status: 'Upcoming', cover_photo_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800' },
];

const TripsListPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips');
        setTrips(res.data.trips || res.data || MOCK_TRIPS);
      } catch (err) {
        setTrips(MOCK_TRIPS);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const tabs = ['All', 'Ongoing', 'Upcoming', 'Completed'];
  
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || trip.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-main">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h1 className="banner-title" style={{ fontSize: '2.5rem', marginBottom: 0 }}>My Trips</h1>
          <button className="btn btn-primary" onClick={() => navigate('/trips/new')}>
            <Plus size={18} /> Plan a New Trip
          </button>
        </div>

        {/* Search & Filter Section */}
        <div className="search-filter-section">
          <div className="search-bar-expanded">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search your trips..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <button className="filter-btn">
              <LayoutGrid size={16} /> Group by
            </button>
            <button className="filter-btn">
              <Filter size={16} /> Filter
            </button>
            <button className="filter-btn">
              <ArrowUpDown size={16} /> Sort by
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1rem',
                fontWeight: activeTab === tab ? '600' : '500',
                color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                position: 'relative',
                padding: '8px 4px'
              }}
            >
              {tab}
              {activeTab === tab && (
                <div style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', background: 'var(--accent-primary)', borderRadius: '2px' }} />
              )}
            </button>
          ))}
        </div>

        {/* Trips Grid */}
        <section className="dashboard-section" style={{ animationDelay: '0.1s' }}>
          {loading ? (
            <div className="empty-state stitch-card">Loading your journeys...</div>
          ) : filteredTrips.length > 0 ? (
            <div className="trips-grid-vertical">
              {filteredTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="empty-state stitch-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>No trips found</h3>
              <p style={{ marginBottom: '24px' }}>Get started by planning your next amazing adventure.</p>
              <button className="btn btn-primary" onClick={() => navigate('/trips/new')}>
                Start Planning
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TripsListPage;
