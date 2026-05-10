import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import { Camera, MapPin, Calendar, AlignLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import '../Dashboard/Dashboard.css';

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call would go here
      // const res = await api.post('/trips', formData);
      // navigate(`/trips/${res.data.id}/build`);
      setTimeout(() => {
        navigate('/trips');
      }, 1000); // Simulate network request
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-main" style={{ maxWidth: '800px' }}>
        <div className="section-header">
          <h1 className="banner-title" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Plan a New Trip</h1>
        </div>

        <form onSubmit={handleSubmit} className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Cover Photo Upload (Mock) */}
          <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '2px dashed var(--input-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.backgroundColor = 'var(--accent-light)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--input-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; }}
          >
            <Camera size={32} style={{ marginBottom: '12px' }} />
            <p style={{ fontWeight: '500' }}>Upload Cover Photo</p>
            <p style={{ fontSize: '0.875rem' }}>Optional</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="input-group">
              <label className="input-label">Trip Name</label>
              <div className="input-with-icon">
                <Info size={18} className="input-icon" />
                <input 
                  type="text" 
                  name="name"
                  className="auth-input" 
                  placeholder="e.g. Summer Backpacking in Europe" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Primary Destination</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input 
                  type="text" 
                  name="destination"
                  className="auth-input" 
                  placeholder="e.g. Paris, France" 
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="input-group">
                <label className="input-label">Start Date</label>
                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <input 
                    type="date" 
                    name="startDate"
                    className="auth-input" 
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">End Date</label>
                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <input 
                    type="date" 
                    name="endDate"
                    className="auth-input" 
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Description (Optional)</label>
              <div className="input-with-icon" style={{ alignItems: 'flex-start' }}>
                <AlignLeft size={18} className="input-icon" style={{ marginTop: '14px' }} />
                <textarea 
                  name="description"
                  className="auth-input" 
                  placeholder="What's the goal of this trip?" 
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ resize: 'vertical', paddingTop: '12px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--card-border)' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>

      </main>
    </div>
  );
};

export default CreateTripPage;
