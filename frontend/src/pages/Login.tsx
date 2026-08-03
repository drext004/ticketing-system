import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient, setAuthToken } from '../api/client';

export const Login = ({ isRegister = false }: { isRegister?: boolean }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await apiClient('/register', { data: { name, email, password } });
        // Auto login after register (simulated by redirecting to login or handling it here)
        navigate('/login');
      } else {
        const res = await apiClient('/login', { data: { email, password } });
        setAuthToken(res.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isRegister && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="input" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="input" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#a1a1aa' }}>
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <Link to={isRegister ? "/login" : "/register"} style={{ color: 'var(--primary-hover)' }}>
            {isRegister ? "Log In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};
