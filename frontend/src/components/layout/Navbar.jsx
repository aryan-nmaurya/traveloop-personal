import React from 'react';
import { Compass, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { logout } = useAuth();
  return (
    <nav className="top-nav">
      <Link to="/" className="logo">
        <Compass className="logo-icon" size={28} />
        <span>Traveloop</span>
      </Link>
      <div className="nav-actions">
        <div className="user-avatar" title="Profile">
          <User size={20} />
        </div>
        <button className="btn btn-ghost" onClick={logout} style={{ padding: '8px', color: 'var(--text-secondary)' }} title="Log out">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
