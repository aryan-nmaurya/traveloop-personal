import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import TripCard from '../../components/features/TripCard';
import DestinationCard from '../../components/features/DestinationCard';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

// Mock data for initial render or fallback when API is not ready
const MOCK_TRIPS = [
  { id: 1, name: 'Summer in Europe', date_range: 'Jun 12 - Jul 05', destinations_count: 4, status: 'Upcoming', cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Japan Cherry Blossom', date_range: 'Apr 02 - Apr 15', destinations_count: 3, status: 'Completed', cover_photo_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800' },
];

const MOCK_DESTINATIONS = [
  { id: 1, name: 'Kyoto', country: 'Japan', image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Santorini', country: 'Greece', image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Swiss Alps', country: 'Switzerland', image_url: 'https://images.unsplash.com/photo-1531366936337-7785a374c4ed?auto=format&fit=crop&q=80&w=600' },
  { id: 4, name: 'Bali', country: 'Indonesia', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Try fetching recent trips from API
        const tripsRes = await api.get('/trips?limit=3');
        setTrips(tripsRes.data.trips || tripsRes.data || MOCK_TRIPS);
        // Using mock destinations for now until /cities endpoint is integrated
        setDestinations(MOCK_DESTINATIONS);
      } catch (err) {
        console.warn("API might not be fully ready. Using mock data for dashboard.");
        setTrips(MOCK_TRIPS);
        setDestinations(MOCK_DESTINATIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-main">
        {/* Banner Section */}
        <div className="dashboard-banner glass-panel">
          <div className="banner-content">
            <h1 className="banner-title">Where to next, {user?.firstName || 'Traveler'}?</h1>
            <p className="banner-subtitle">Design your perfect multi-city itinerary effortlessly.</p>
            <button className="btn btn-primary banner-btn" onClick={() => navigate('/trips/new')}>
              <Plus size={18} /> Plan a New Trip
            </button>
          </div>
        </div>

        {/* Recent Trips Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Your Recent Trips</h2>
            <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.875rem' }} onClick={() => navigate('/trips')}>
              View All
            </button>
          </div>
          
          {loading ? (
            <div className="empty-state">Loading your journeys...</div>
          ) : trips.length > 0 ? (
            <div className="trips-grid">
              {trips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel">
              <p style={{ marginBottom: '16px' }}>You haven't planned any trips yet.</p>
              <button className="btn btn-primary" onClick={() => navigate('/trips/new')}>
                Start Planning
              </button>
            </div>
          )}
        </section>

        {/* Inspiration Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Inspiration for your next journey</h2>
            <div className="section-controls">
              <div className="search-bar">
                <Search size={16} />
                <input type="text" placeholder="Search cities..." />
              </div>
              <button className="btn btn-ghost" style={{ padding: '8px' }} title="Filter options">
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <div className="destinations-grid">
            {destinations.map(dest => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
