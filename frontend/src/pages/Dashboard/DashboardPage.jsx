import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import TripCard from '../../components/features/TripCard';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import './Dashboard.css';

const BANNER_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
    title: 'Discover Your Next Adventure',
    subtitle: 'Explore breathtaking landscapes and vibrant cultures'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=1200&q=80',
    title: 'Plan the Perfect Getaway',
    subtitle: 'From serene beaches to bustling cities'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
    title: 'Experience Local Magic',
    subtitle: 'Immerse yourself in new traditions'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
    title: 'Find Your Sanctuary',
    subtitle: 'Unwind in the worlds most peaceful destinations'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    title: 'Roadtrip of a Lifetime',
    subtitle: 'Hit the open road and see where it takes you'
  }
];

const REGIONS = [
  { id: 1, name: 'Europe', desc: 'Historic cities & culture', image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80' },
  { id: 2, name: 'Asia', desc: 'Vibrant cultures & food', image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' },
  { id: 3, name: 'Middle East', desc: 'Deserts & luxury', image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400&q=80' },
  { id: 4, name: 'Beaches', desc: 'Sun, sand & relaxation', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
  { id: 5, name: 'Mountains', desc: 'Adventure & nature', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
];

const MOCK_TRIPS = [
  { id: 1, name: 'Summer in Europe', date_range: 'Jun 12 - Jul 05', destinations_count: 4, status: 'Upcoming', cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Japan Cherry Blossom', date_range: 'Apr 02 - Apr 15', destinations_count: 3, status: 'Completed', cover_photo_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Bali Retreat', date_range: 'Sep 10 - Sep 20', destinations_count: 1, status: 'Draft', cover_photo_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const tripsRes = await api.get('/trips?limit=3');
        setTrips(tripsRes.data.trips || tripsRes.data || MOCK_TRIPS);
      } catch (err) {
        console.warn("API might not be fully ready. Using mock data for dashboard.");
        setTrips(MOCK_TRIPS);
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
        {/* Banner Carousel Section */}
        <div className="carousel-container">
          {BANNER_SLIDES.map((slide, index) => (
            <div 
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${slide.image})` }}
            >
              <div className="carousel-content">
                <h1 className="carousel-title">{slide.title}</h1>
                <p className="carousel-subtitle">{slide.subtitle}</p>
                <button className="btn btn-primary" onClick={() => navigate('/trips/new')}>
                  Explore Now
                </button>
              </div>
            </div>
          ))}
          
          <button className="carousel-control prev" onClick={prevSlide}><ChevronLeft size={24} /></button>
          <button className="carousel-control next" onClick={nextSlide}><ChevronRight size={24} /></button>
          
          <div className="carousel-indicators">
            {BANNER_SLIDES.map((_, index) => (
              <button 
                key={index} 
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="search-filter-section">
          <div className="search-bar-expanded">
            <Search size={20} className="search-icon" />
            <input type="text" placeholder="Search destinations, trips, or activities..." className="search-input" />
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

        {/* Top Regional Selections */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Top Regional Selections</h2>
          </div>
          <div className="regions-grid">
            {REGIONS.map(region => (
              <div key={region.id} className="region-card">
                <div className="region-image" style={{ backgroundImage: `url(${region.image_url})` }} />
                <div className="region-content">
                  <h3 className="region-name">{region.name}</h3>
                  <p className="region-desc">{region.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Trips Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Previous Trips</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/trips')}>
              View All
            </button>
          </div>
          
          {loading ? (
            <div className="empty-state">Loading your journeys...</div>
          ) : trips.length > 0 ? (
            <div className="trips-grid-vertical">
              {trips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="empty-state auth-card">
              <p style={{ marginBottom: '16px' }}>You haven't planned any trips yet.</p>
              <button className="btn btn-primary" onClick={() => navigate('/trips/new')}>
                Start Planning
              </button>
            </div>
          )}
        </section>
        
      </main>

      {/* Floating CTA */}
      <button className="floating-cta" onClick={() => navigate('/trips/new')} title="Plan a trip">
        <Plus size={24} /> <span className="cta-text">Plan a trip</span>
      </button>
    </div>
  );
};

export default DashboardPage;
