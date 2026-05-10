import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const TripCard = ({ trip }) => {
  return (
    <div className="trip-card">
      <div 
        className="trip-card-image" 
        style={{ backgroundImage: `url(${trip.cover_photo_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'})` }}
      >
        <div className="trip-status-badge">{trip.status || 'Upcoming'}</div>
      </div>
      <div className="trip-card-content">
        <h3 className="trip-title">{trip.name}</h3>
        <div className="trip-meta">
          <span className="meta-item"><Calendar size={14} /> {trip.date_range || 'TBD'}</span>
          <span className="meta-item"><MapPin size={14} /> {trip.destinations_count || 1} stops</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
