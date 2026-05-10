import React from 'react';

const DestinationCard = ({ destination }) => {
  return (
    <div className="destination-card">
      <img src={destination.image_url} alt={destination.name} className="destination-image" />
      <div className="destination-overlay">
        <h4 className="destination-name">{destination.name}</h4>
        <p className="destination-country">{destination.country}</p>
      </div>
    </div>
  );
};

export default DestinationCard;
