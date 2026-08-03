//import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { LandingPage } from './pages/LandingPage';
import { Booking } from './pages/Booking';
import { AdminDashboard } from './pages/AdminDashboard';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <>
    <Outlet />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<MainLayout />}>
            <Route path="/shows" element={<Home />} />
            <Route path="/booking/:showId" element={<Booking />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
