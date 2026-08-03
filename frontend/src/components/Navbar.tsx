import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Ticket } from 'lucide-react';
import { getAuthToken, removeAuthToken } from '../api/client';

export const Navbar = () => {
  const navigate = useNavigate();
  const token = getAuthToken();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/');
  };

  return (
    <nav className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" className="flex-center" style={{ gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-hover)' }}>
        <Ticket size={32} />
        <span>VibeTix</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        {token ? (
          <button className="btn btn-secondary" onClick={handleLogout} style={{ gap: '0.5rem' }}>
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <>
            <Link to="/" className="btn btn-secondary">Login / Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};
