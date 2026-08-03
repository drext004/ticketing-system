import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export const Home = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await apiClient('/shows');
        setShows(data.shows || []);
      } catch (err) {
        console.error("Failed to fetch shows", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'var(--background-shows)', overflowX: 'hidden' }}>

      {/* Background decorations - simple CSS approximations of the ellipses */}
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
        <a style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', letterSpacing: '-1.12px', lineHeight: 'normal' }} href='/'>
          Tix
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ color: 'white', fontSize: '32px', fontWeight: '500', letterSpacing: '-0.64px', lineHeight: 'none' }}>
            Shows
          </div>
          <button className='log-Out-Button'
            onClick={() => { removeAuthToken(); navigate('/'); }}
          >
            Log Out
          </button>
        </div>
      </div>

      <div style={{ paddingTop: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'black', marginRight: '10px' }}>Screening</span>
          <span style={{ fontSize: '32px', fontFamily: 'var(--font-hahmlet)', fontWeight: 500, color: 'black' }}>Right Now</span>
        </div>

        {loading ? (
          <p style={{ color: '#000', marginTop: '1rem' }}>Loading shows...</p>
        ) : shows.length === 0 ? (
          <p style={{ color: '#000', marginTop: '1rem' }}>No upcoming shows available right now.</p>
        ) : (
          <div style={{
            display: 'flex',
            gap: '48px',
            padding: '20px 40px',
            maxWidth: '100%',
            overflowX: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {shows.map((show) => (
              <div key={show.showId} style={{
                position: 'relative',
                width: '320px',
                height: '512px',
                backgroundColor: 'var(--header-bg)',
                borderRadius: '32px',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}>
                <div style={{ position: 'absolute', width: '341px', height: '263px', left: '-138px', top: '184px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{
                  position: 'absolute',
                  top: '16px', left: '16px', width: '288px', height: '320px',
                  backgroundColor: '#d9d9d9',
                  borderRadius: '16px 16px 32px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  overflow: 'hidden'
                }}>
                  {show.thumbnail ? (
                    <img src={show.thumbnail} alt={show.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <p style={{ fontSize: '19.2px', fontWeight: 'bold', color: 'black', margin: 0, padding: '0 20px' }}>
                      {show.title}<br />thumbnail
                    </p>
                  )}
                </div>

                <div style={{ position: 'absolute', top: '358px', width: '100%', textAlign: 'center' }}>
                  <p style={{ fontSize: '19.2px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                    {show.title}
                  </p>
                  <p style={{ fontSize: '14px', color: '#ccc', margin: '4px 0 0 0' }}>
                    {show.screenName} • ${show.price}
                  </p>
                </div>

                <div style={{ position: 'absolute', top: '441px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Link to={`/booking/${show.showId}`} style={{
                    backgroundColor: 'var(--btn-book-now)',
                    width: '128px',
                    height: '44.8px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '19.2px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 12px rgba(255, 174, 0, 0.4)'
                  }}>
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
