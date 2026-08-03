import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, removeAuthToken } from '../api/client';
import './home.css';

interface Show {
  showId: string;
  title: string;
  screenName: string;
  price: number;
  status: string;
  bookingStarts: string | null;
  thumbnail?: string | null;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [screenName, setScreenName] = useState('Screen 1');
  const [price, setPrice] = useState('15');
  const [bookingStarts, setBookingStarts] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const fetchShows = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/shows');
      setShows(data.shows || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiClient('/admin/shows', {
        data: {
          title,
          screenName,
          price,
          bookingStarts: bookingStarts || null,
          thumbnail: thumbnail || null,
        }
      });
      setTitle('');
      setScreenName('Screen 1');
      setPrice('15');
      setBookingStarts('');
      setThumbnail('');
      await fetchShows();
    } catch (err: any) {
      setError(err.message || 'Failed to create show');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShow = async (showId: string) => {
    if (!window.confirm("Are you sure you want to delete this show and all its 100 seats?")) return;
    try {
      setLoading(true);
      await apiClient(`/admin/shows/${showId}`, { method: 'DELETE' });
      await fetchShows();
    } catch (err: any) {
      setError(err.message || 'Failed to delete show');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'var(--background-shows)', overflowX: 'hidden' }}>
      
      {/* Background decorations */}
      <div style={{ position: 'absolute', width: '1112px', height: '858px', left: '-400px', top: '-100px', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%)', transform: 'rotate(-19deg)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100px',
        backgroundColor: 'var(--header-bg)',
        borderBottomLeftRadius: '50px',
        borderBottomRightRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 47px',
        zIndex: 10
      }}>
        <a style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', letterSpacing: '-1.12px', lineHeight: 'normal', textDecoration: 'none' }} href='/'>
          Tix
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ color: 'white', fontSize: '32px', fontWeight: '500', letterSpacing: '-0.64px', lineHeight: 'none' }}>
            Admin Dashboard
          </div>
          <button className='log-Out-Button'
            onClick={() => { removeAuthToken(); navigate('/'); }}
          >
            Log Out
          </button>
        </div>
      </div>

      <div style={{ paddingTop: '150px', paddingLeft: '40px', paddingRight: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        
        {error && <div style={{ color: 'white', background: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', zIndex: 1 }}>{error}</div>}

        <div style={{ 
          backgroundColor: 'var(--header-bg)', 
          borderRadius: '32px', 
          padding: '2.5rem', 
          width: '100%', 
          maxWidth: '800px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          color: 'white',
          position: 'relative'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontFamily: 'var(--font-hahmlet)', fontSize: '32px', fontWeight: 500 }}>Create New Show</h2>
          <form onSubmit={handleCreateShow} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '18px', fontWeight: 500 }}>Movie Title</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '16px', border: 'none', outline: 'none', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.9)' }}
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '18px', fontWeight: 500 }}>Screen Name (100 seats will be generated)</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '16px', border: 'none', outline: 'none', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.9)' }}
                value={screenName} 
                onChange={e => setScreenName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '18px', fontWeight: 500 }}>Ticket Price ($)</label>
              <input 
                type="number" 
                style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '16px', border: 'none', outline: 'none', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.9)' }}
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                required 
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '18px', fontWeight: 500 }}>Booking Starts (optional)</label>
              <input 
                type="datetime-local" 
                style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '16px', border: 'none', outline: 'none', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.9)' }}
                value={bookingStarts} 
                onChange={e => setBookingStarts(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '18px', fontWeight: 500 }}>Movie Poster URL (optional)</label>
              <input 
                type="url" 
                placeholder="https://example.com/poster.jpg"
                style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '16px', border: 'none', outline: 'none', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.9)' }}
                value={thumbnail} 
                onChange={e => setThumbnail(e.target.value)} 
              />
            </div>
            <button type="submit" style={{ 
              marginTop: '1rem', 
              backgroundColor: 'var(--btn-book-now)', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '16px', 
              border: 'none', 
              fontSize: '19.2px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 174, 0, 0.4)',
              transition: 'transform 0.2s'
            }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Show'}
            </button>
          </form>
        </div>

        <div style={{ 
          backgroundColor: 'var(--header-bg)', 
          borderRadius: '32px', 
          padding: '2.5rem', 
          width: '100%', 
          maxWidth: '800px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          color: 'white',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontFamily: 'var(--font-hahmlet)', fontSize: '32px', fontWeight: 500 }}>Manage Shows</h2>
          {shows.length === 0 ? (
            <p style={{ marginTop: '1rem', color: '#ffae00' }}>No shows found. Create one above.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {shows.map(show => (
                <div key={show.showId} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1.5rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{show.title}</h3>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#e5e7eb', fontSize: '16px' }}>
                      {show.screenName} • ${show.price} • {show.status}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '14px', color: '#9ca3af' }}>ID: {show.showId}</p>
                  </div>
                  <button style={{ 
                    background: '#ef4444', 
                    color: 'white', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '12px', 
                    border: 'none', 
                    fontWeight: 'bold', 
                    fontSize: '16px',
                    cursor: 'pointer' 
                  }} onClick={() => handleDeleteShow(show.showId)} disabled={loading}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
