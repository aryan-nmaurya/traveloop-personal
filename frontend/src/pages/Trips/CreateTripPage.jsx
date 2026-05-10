import React, { useState, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Camera, MapPin, Calendar, AlignLeft, Info, Users, Briefcase, Plus, ChevronRight, ChevronDown, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard/Dashboard.css';
import './CreateTripPage.css';

const MOCK_SUGGESTIONS = [
  { id: 1, name: 'Amalfi Coast', country: 'Italy', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800', budget: 'Est. $2,500', tags: ['Coastal', 'Romantic'], description: 'Breathtaking cliffs, pastel-colored villages, and Mediterranean charm.' },
  { id: 2, name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800', budget: 'Est. $1,800', tags: ['Culture', 'Nature'], description: 'Ancient temples, sublime gardens, and traditional teahouses.' },
  { id: 3, name: 'Swiss Alps', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800', budget: 'Est. $3,200', tags: ['Adventure', 'Mountains'], description: 'World-class skiing, scenic trains, and alpine luxury.' },
  { id: 4, name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800', budget: 'Est. $1,200', tags: ['Tropical', 'Relaxation'], description: 'Lush rice terraces, spiritual retreats, and pristine beaches.' },
  { id: 5, name: 'Banff National Park', country: 'Canada', image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=800', budget: 'Est. $1,500', tags: ['Nature', 'Hiking'], description: 'Turquoise glacial lakes and towering Rocky Mountain peaks.' },
];

const CreateTripPage = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    travelType: 'Leisure',
    travelers: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSuggestionClick = (destinationName) => {
    setFormData(prev => ({ ...prev, destination: destinationName }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setTimeout(() => {
        navigate('/trips');
      }, 1000); // Simulate network request
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="dashboard-layout page-bg">
      <Navbar />
      
      <main className="dashboard-main create-trip-main">
        {/* Hero Section */}
        <div className="create-trip-hero">
          <div className="hero-content">
            <span className="hero-badge">Trip Planner</span>
            <h1 className="hero-title">Design Your Next Adventure</h1>
            <p className="hero-subtitle">Craft the perfect itinerary. Organize flights, hotels, and activities all in one beautiful workspace.</p>
          </div>
        </div>

        <div className="create-trip-container">
          {/* Trip Creation Form */}
          <form onSubmit={handleSubmit} className="premium-form-card">
            
            <div className="form-section">
              <h3 className="form-section-title">Trip Essentials</h3>
              <p className="form-section-subtitle">Start with the basic details of your journey.</p>
              
              {/* Cover Photo Dropzone */}
              <div className="cover-photo-dropzone">
                <div className="dropzone-icon-wrapper">
                  <Camera size={28} />
                </div>
                <div>
                  <p className="dropzone-title">Upload Cover Photo</p>
                  <p className="dropzone-subtitle">Drag & drop an inspiring image, or click to browse</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="input-group full-width">
                  <label className="input-label">Trip Title</label>
                  <div className="input-with-icon">
                    <Info size={20} className="input-icon" />
                    <input 
                      type="text" 
                      name="name"
                      className="premium-input"
                      placeholder="e.g., Summer Eurotrip 2026" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group full-width">
                  <label className="input-label">Primary Destination</label>
                  <div className="input-with-icon">
                    <MapPin size={20} className="input-icon" />
                    <input 
                      type="text" 
                      name="destination"
                      className="premium-input"
                      placeholder="Search for a city, country, or region..." 
                      value={formData.destination}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section divider">
              <h3 className="form-section-title">Dates & Details</h3>
              <p className="form-section-subtitle">When are you going and who is coming along?</p>

              <div className="form-grid">
                <div className="input-group half-width">
                  <label className="input-label">Start Date</label>
                  <div className="input-with-icon">
                    <Calendar size={20} className="input-icon" />
                    <input 
                      type="date" 
                      name="startDate"
                      className="premium-input date-input"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="input-group half-width">
                  <label className="input-label">End Date</label>
                  <div className="input-with-icon">
                    <Calendar size={20} className="input-icon" />
                    <input 
                      type="date" 
                      name="endDate"
                      className="premium-input date-input"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group half-width">
                  <label className="input-label">Travel Type</label>
                  <div className="input-with-icon">
                    <Briefcase size={20} className="input-icon" />
                    <select 
                      name="travelType"
                      className="premium-input select-input"
                      value={formData.travelType}
                      onChange={handleChange}
                    >
                      <option value="Leisure">Leisure</option>
                      <option value="Business">Business</option>
                      <option value="Backpacking">Backpacking</option>
                      <option value="Family">Family</option>
                    </select>
                    <ChevronDown size={18} className="select-chevron" />
                  </div>
                </div>

                <div className="input-group half-width">
                  <label className="input-label">Travelers</label>
                  <div className="input-with-icon">
                    <Users size={20} className="input-icon" />
                    <input 
                      type="number" 
                      min="1"
                      name="travelers"
                      className="premium-input"
                      value={formData.travelers}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-group full-width">
                  <label className="input-label">Notes & Objectives (Optional)</label>
                  <div className="input-with-icon textarea-icon-wrapper">
                    <AlignLeft size={20} className="input-icon textarea-icon" />
                    <textarea 
                      name="description"
                      className="premium-input premium-textarea"
                      placeholder="What do you want to achieve on this trip? Any must-see spots?" 
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost premium-cancel-btn" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary premium-submit-btn" disabled={loading}>
                {loading ? 'Setting up...' : 'Create Trip'}
              </button>
            </div>
          </form>

          {/* Smart Destination Suggestions - Horizontal Carousel */}
          <section className="inspiration-section">
            <div className="inspiration-header">
              <div>
                <h2 className="inspiration-title">Need Inspiration?</h2>
                <p className="inspiration-subtitle">Trending destinations curated just for you.</p>
              </div>
              <div className="carousel-controls">
                <button type="button" className="carousel-btn" onClick={() => scrollCarousel('left')}>
                  <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <button type="button" className="carousel-btn" onClick={() => scrollCarousel('right')}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="inspiration-carousel" ref={carouselRef}>
              {MOCK_SUGGESTIONS.map(suggestion => (
                <div key={suggestion.id} className="inspiration-card group">
                  <div className="inspiration-image-wrapper">
                    <img src={suggestion.image} alt={suggestion.name} className="inspiration-image" />
                    <div className="trending-badge">
                      <TrendingUp size={14} /> Trending
                    </div>
                    <div className="inspiration-overlay">
                      <button 
                        type="button" 
                        className="btn btn-primary add-to-trip-btn"
                        onClick={() => handleSuggestionClick(suggestion.name)}
                      >
                        <Plus size={16} /> Add Destination
                      </button>
                    </div>
                  </div>
                  <div className="inspiration-content">
                    <div className="inspiration-content-header">
                      <div>
                        <h3 className="inspiration-name">{suggestion.name}</h3>
                        <p className="inspiration-country">{suggestion.country}</p>
                      </div>
                      <span className="inspiration-budget">{suggestion.budget}</span>
                    </div>
                    <p className="inspiration-description">{suggestion.description}</p>
                    <div className="inspiration-tags">
                      {suggestion.tags.map(tag => (
                        <span key={tag} className="inspiration-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateTripPage;
