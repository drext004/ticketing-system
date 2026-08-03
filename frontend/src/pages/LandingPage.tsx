import React, { useState } from 'react';
import './LandingPage.css';
import { RegistrationCard } from '../components/RegistrationCard';
import bgSwirl from '../assets/bg-swirl.svg';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="landing-container">
      {/* Top Header */}
      <header className="landing-header">
        <div className="landing-logo">Tix</div>
        {/* We can use a Link if there's a shows route, else just text for now */}
        <Link to="/shows" className="landing-nav-links">Shows</Link>
      </header>

      {/* Decorative Background SVG */}
      <div className="landing-bg-overlay">
        <img src={bgSwirl} alt="" className="landing-bg-swirl" />
      </div>

      {/* Main Content Area */}
      <main className="landing-content">
        {/* Typography Section */}
        <div className="landing-text-section">
          <h1 className="landing-heading">
            Your one stop solution <br />
            for <br />
            <span className="font-hahmlet">Movie,</span> <br />
            <span className="font-hahmlet">Music,</span> <br />
            <span className="font-hahmlet">Comedy show</span>
          </h1>
          <span className="tix-highlight">Tix.</span>
          <p className="landing-subheading">
            Get yours <span className="underline">today</span>!
          </p>
        </div>

        {/* Form Card Section */}
        <div className="landing-card-section">
          <RegistrationCard isLogin={isLogin} toggleMode={() => setIsLogin(!isLogin)} />
        </div>
      </main>
    </div>
  );
};
