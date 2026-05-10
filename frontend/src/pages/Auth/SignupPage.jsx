import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, UserPlus, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: ''
  });

  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-layout">
      <nav className="top-nav">
        <div className="logo">
          <Compass className="logo-icon" size={28} />
          <span>Traveloop</span>
        </div>
      </nav>

      <div className="auth-left" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
        <div className="auth-card" style={{ maxWidth: '540px', padding: '40px' }}>
          <div className="auth-header">
            <h1 className="auth-title">Start your journey</h1>
            <p className="auth-subtitle">Create an account to build epic itineraries.</p>
          </div>

          {error && <div style={{ color: 'var(--error)', marginBottom: '24px', textAlign: 'center', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>{error}</div>}

          <form onSubmit={handleSignup}>
            <div className="photo-upload">
              <ImageIcon size={24} />
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label className="input-label" htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="input-field"
                  placeholder="Rishita"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="input-field"
                  placeholder="Udawant"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-field"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label className="input-label" htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="input-field"
                  placeholder="Vadodara"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="input-field"
                  placeholder="Gujarat"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="phone">Phone (optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="input-field"
                placeholder="+91 1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              Create Account <UserPlus size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>

      <div className="auth-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')" }}>
      </div>
    </div>
  );
};

export default SignupPage;
