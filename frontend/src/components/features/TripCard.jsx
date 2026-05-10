import React from 'react';
import { Calendar, MapPin, ArrowRight, Clock, Wallet } from 'lucide-react';
import './TripCard.css';

const TripCard = ({ trip }) => {
  // Determine if trip is ongoing, upcoming, or completed for dynamic styling
  const statusColors = {
    Ongoing: 'var(--success-color, #10b981)',
    Upcoming: 'var(--accent-primary)',
    Completed: 'var(--text-muted)'
  };
  
  const statusColor = statusColors[trip.status] || statusColors.Upcoming;

  return (
    <div className="trip-card group">
      <div className="trip-card-image-wrapper">
        <div 
          className="trip-card-image" 
          style={{ backgroundImage: `url(${trip.cover_photo_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'})` }}
        />
        
        {/* Elegant overlay on hover */}
        <div className="trip-card-overlay">
          <button className="btn btn-primary view-trip-btn">
            View Itinerary <ArrowRight size={16} />
          </button>
        </div>

        <div className="trip-status-badge" style={{ backgroundColor: statusColor, color: 'white' }}>
          {trip.status || 'Upcoming'}
        </div>
      </div>
      
      <div className="trip-card-content">
        <div className="trip-header">
          <h3 className="trip-title">{trip.name}</h3>
        </div>
        
        <div className="trip-meta-grid">
          <div className="meta-item">
            <Calendar size={14} className="meta-icon" />
            <span>{trip.date_range || 'TBD'}</span>
          </div>
          <div className="meta-item">
            <MapPin size={14} className="meta-icon" />
            <span>{trip.destinations_count || 1} {trip.destinations_count === 1 ? 'Destination' : 'Destinations'}</span>
          </div>
          <div className="meta-item">
            <Clock size={14} className="meta-icon" />
            <span>{trip.duration || '5 Days'}</span>
          </div>
          <div className="meta-item">
            <Wallet size={14} className="meta-icon" />
            <span>{trip.budget || 'Est. $1,200'}</span>
          </div>
        </div>

        {/* Progress bar for Ongoing/Upcoming trips */}
        {trip.status !== 'Completed' && (
          <div className="trip-progress-container">
            <div className="trip-progress-labels">
              <span className="progress-label">Planning Progress</span>
              <span className="progress-value">60%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '60%', backgroundColor: statusColor }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCard;
