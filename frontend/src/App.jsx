import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

// Pages
import Landing from './pages/Landing';
import DashboardOverview from './pages/DashboardOverview';
import Tenants from './pages/Tenants';
import Analytics from './pages/Analytics';
import Subscriptions from './pages/Subscriptions';
import GlobalSettings from './pages/GlobalSettings';
import Builder from './pages/Builder';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ToolDetail from './pages/ToolDetail';
import TemplateGallery from './pages/TemplateGallery';
import PublicApp from './pages/PublicApp';

// Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import UserLayout from './components/layout/UserLayout';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Inner component to access useLocation
const AppContent = () => {
  const location = useLocation();
  const lenisRef = useRef(null);

  const isDashboard = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/tenants') ||
    location.pathname.startsWith('/analytics') ||
    location.pathname.startsWith('/subscriptions') ||
    location.pathname.startsWith('/settings') ||
    location.pathname.startsWith('/marketplace') ||
    location.pathname.startsWith('/builder');

  // Initialize/Destroy Lenis based on route
  useEffect(() => {
    if (isDashboard) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    if (!lenisRef.current) {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      const raf = (time) => {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);
    }

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [isDashboard]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30">
      {!isDashboard && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard Section */}
          <Route
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<ToolDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/settings" element={<GlobalSettings />} />
          </Route>

          <Route
            path="/builder/:id"
            element={
              <ProtectedRoute>
                <Builder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builder/:templateName/:emailPrefix/minisaas.in"
            element={
              <ProtectedRoute>
                <Builder />
              </ProtectedRoute>
            }
          />
          <Route path="/templateSites" element={<TemplateGallery />} />
          <Route path="/site/:templateName/:emailPrefix" element={<PublicApp />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
