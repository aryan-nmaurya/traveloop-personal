import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-layout">
      {/* Top Nav inside auth */}
      <nav className="top-nav">
        <div className="logo">
          <Compass className="logo-icon" size={28} />
          <span>Traveloop</span>
        </div>
      </nav>

      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Log in to manage your epic journeys.</p>
          </div>

          {error && <div style={{ color: 'var(--error)', marginBottom: '24px', textAlign: 'center', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '15px', left: '16px' }} />
                <input 
                  type="email" 
                  id="email" 
                  className="input-field" 
                  placeholder="you@example.com"
                  style={{ paddingLeft: '44px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '15px', left: '16px' }} />
                <input 
                  type="password" 
                  id="password" 
                  className="input-field" 
                  placeholder="••••••••"
                  style={{ paddingLeft: '44px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <label className="checkbox-group" style={{ marginBottom: 0 }}>
                <input type="checkbox" />
                <span className="checkbox-label">Remember me</span>
              </label>
              <a href="#" style={{ fontSize: '0.875rem' }}>Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/signup">Create one</Link>
          </div>
        </div>
      </div>
      
      <div className="auth-right">
        {/* The background image handles the visual appeal */}
      </div>
    </div>
  );
};

export default LoginPage;
