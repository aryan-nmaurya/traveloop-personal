import React from 'react';
import { Compass, MessageSquare, Camera, Briefcase, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Compass className="logo-icon" size={28} />
            <span>Traveloop</span>
          </Link>
          <p className="footer-description">
            Your premium end-to-end travel planning platform. Dream, design, and organize multi-city trips effortlessly.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" title="Twitter"><MessageSquare size={18} /></a>
            <a href="#" className="social-icon" title="Instagram"><Camera size={18} /></a>
            <a href="#" className="social-icon" title="LinkedIn"><Briefcase size={18} /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Platform</h4>
          <Link to="/trips" className="footer-link">My Trips</Link>
          <Link to="/trips/new" className="footer-link">Plan a Trip</Link>
          <Link to="/search/cities" className="footer-link">Destinations</Link>
          <Link to="/community" className="footer-link">Community</Link>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Resources</h4>
          <a href="#" className="footer-link">Help Center</a>
          <a href="#" className="footer-link">Travel Guides</a>
          <a href="#" className="footer-link">Blog</a>
          <a href="#" className="footer-link">API Docs</a>
        </div>

        <div className="footer-newsletter">
          <h4 className="footer-title">Stay Inspired</h4>
          <p className="footer-subtitle">Subscribe to our newsletter for the latest travel tips.</p>
          <div className="newsletter-input-group">
            <Mail size={18} className="newsletter-icon" />
            <input type="email" placeholder="Enter your email" className="newsletter-input" />
            <button className="btn btn-primary btn-sm" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Traveloop Inc. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
