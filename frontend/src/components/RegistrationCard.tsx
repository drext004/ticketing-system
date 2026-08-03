import React, { useState } from 'react';
import cardSwirl from '../assets/card-swirl.svg';
import { useNavigate } from 'react-router-dom';
import { apiClient, setAuthToken } from '../api/client';

interface RegistrationCardProps {
  isLogin: boolean;
  toggleMode: () => void;
}

export const RegistrationCard: React.FC<RegistrationCardProps> = ({ isLogin, toggleMode }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const res = await apiClient('/login', { data: { email, password } });
        setAuthToken(res.token);
        navigate('/shows');
      } else {
        await apiClient('/register', { data: { name: fullName, email, password } });
        // Automatically log them in after registration, or toggle mode
        const res = await apiClient('/login', { data: { email, password } });
        setAuthToken(res.token);
        navigate('/shows');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-card">
      <img src={cardSwirl} alt="" className="reg-card-bg" />
      
      <div className="reg-card-content">
        <button className="reg-card-toggle" onClick={toggleMode} type="button">
          {isLogin ? 'Register.' : 'Login.'}
        </button>
        
        <h2 className="reg-card-title">{isLogin ? 'Login.' : 'Register.'}</h2>
        
        {!isLogin && (
          <p className="reg-card-subtitle">Register to book your tix.</p>
        )}

        {error && <div style={{ color: '#ef4444', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

        <form className="reg-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="reg-input-group">
              <input 
                type="text" 
                className="reg-input" 
                placeholder="Full name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="reg-input-group">
            <input 
              type="email" 
              className="reg-input" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="reg-input-group">
            <input 
              type="password" 
              className="reg-input reg-input-bordered" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <p className="reg-terms">
              By registering you agree to our.
              <strong>Terms and Conditions</strong>
            </p>
          )}

          <div className="reg-submit-wrapper">
            <button type="submit" className="reg-submit" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
