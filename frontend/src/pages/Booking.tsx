import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SeatMap } from '../components/SeatMap';
import { apiClient, removeAuthToken } from '../api/client';
import { io } from 'socket.io-client';

export const Booking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    loadSeats();
    const socket = io('http://localhost:3000');
    socket.on('seatUpdate', () => {
      console.log('Backend says a seat changed! Reloading...');
      loadSeats();
    });

    return () => {
      socket.disconnect();
    };
  }, [showId]);

  useEffect(() => {
    if (!selectedSeat) return;

    const handleTabClose = () => {
      apiClient('/releaseSeat', {
        data: { seat: { seatId: selectedSeat } },
        keepalive: true
      }).catch(console.error); // Catch errors silently in the background
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      handleTabClose();
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [selectedSeat]);

  const loadSeats = async () => {
    try {
      const res = await apiClient(`/getSeats/shows/${showId}/seats`);
      setSeats(res.result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const handleHoldSeat = async () => {
    if (!selectedSeat) return;
    try {
      await apiClient('/chooseShow', { data: { seatId: selectedSeat, showId } });
      setStep(2); // Move to payment
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePaymentAndBooking = async () => {
    try {
      // 1. Payment
      await apiClient('/payment', { data: { seat: { id: selectedSeat }, show: { showId } } });
      // 2. Confirm Booking
      await apiClient('/booking', { data: { seatId: selectedSeat, showId } });
      setStep(3); // Success
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container flex-center min-h-screen">Loading...</div>;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', paddingBottom: '80px' }}>
      
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
        <div style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', letterSpacing: '-1.12px', lineHeight: 'normal', cursor: 'pointer' }} onClick={() => navigate('/')}>
          Tix
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ color: 'white', fontSize: '32px', fontWeight: '500', letterSpacing: '-0.64px', lineHeight: 'none' }}>
            Booking
          </div>
          <button 
            onClick={() => { removeAuthToken(); navigate('/'); }}
            style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
          >
            Log Out
          </button>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '1000px', marginTop: '120px', padding: '0 20px' }}>
        {error && <div style={{ color: 'white', padding: '1rem', background: '#dc2626', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {seats.length === 0 ? (
              <p style={{ fontSize: '1.2rem', color: '#8a8a8a' }}>No seats found. (Make sure you have seeded your database with a Show and some Seats!)</p>
            ) : (
              <>
                <SeatMap seats={seats} onSeatSelect={setSelectedSeat} selectedSeatId={selectedSeat} />
                <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <button 
                    className="btn btn-primary" 
                    disabled={!selectedSeat} 
                    onClick={handleHoldSeat}
                    style={{ fontSize: '24px', padding: '16px 48px', opacity: selectedSeat ? 1 : 0.5, cursor: selectedSeat ? 'pointer' : 'not-allowed' }}
                  >
                    Hold Selected Seat
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--header-bg)', borderRadius: '32px', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '32px', marginBottom: '16px' }}>Seat Held Successfully!</h3>
            <p style={{ fontSize: '18px', color: '#d9d9d9' }}>Please complete your payment within 10 minutes.</p>
            <div style={{ margin: '3rem auto', padding: '2rem', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '16px', maxWidth: '400px' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--btn-book-now)' }}>Total: $99.00</p>
            </div>
            <button className="btn btn-primary" style={{ fontSize: '24px', padding: '16px 48px' }} onClick={handlePaymentAndBooking}>
              Pay Now & Confirm
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--header-bg)', borderRadius: '32px', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h1 style={{ color: 'var(--btn-book-now)', fontSize: '48px', marginBottom: '24px' }}>🎉 Booking Confirmed!</h1>
            <p style={{ fontSize: '1.25rem', color: '#d9d9d9' }}>Your ticket has been booked successfully. Enjoy the show!</p>
            <button className="btn btn-primary" style={{ marginTop: '3rem', fontSize: '20px', padding: '12px 32px' }} onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
