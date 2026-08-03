import React from 'react';

interface Seat {
  id: string;
  status: 'AVAILABLE' | 'HELD' | 'BOOKED';
}

interface SeatMapProps {
  seats: Seat[];
  onSeatSelect: (seatId: string) => void;
  selectedSeatId: string | null;
}

export const SeatMap: React.FC<SeatMapProps> = ({ seats, onSeatSelect, selectedSeatId }) => {
  const getSeatClass = (status: string, id: string) => {
    if (id === selectedSeatId) return 'seat seat-selected';
    if (status === 'AVAILABLE' || !status) return 'seat seat-available';
    if (status === 'HELD') return 'seat seat-held';
    if (status === 'BOOKED') return 'seat seat-booked';
    return 'seat seat-available';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(10, minmax(40px, 60px))', 
        gap: '20px', 
        marginTop: '2rem',
        width: '100%',
        maxWidth: '800px',
        justifyContent: 'center'
      }}>
        {seats.map((seat, index) => (
          <button
            key={seat.id}
            disabled={seat.status === 'HELD' || seat.status === 'BOOKED'}
            onClick={() => onSeatSelect(seat.id)}
            className={getSeatClass(seat.status, seat.id)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontFamily: 'var(--font-space-mono)', color: '#8a8a8a', fontSize: '32px', margin: '0 0 16px 0' }}>
          eyes this side
        </p>
        <svg width="800" height="40" viewBox="0 0 800 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40C200 -13.3333 600 -13.3333 800 40" stroke="#8a8a8a" strokeWidth="4"/>
        </svg>
      </div>
    </div>
  );
};

