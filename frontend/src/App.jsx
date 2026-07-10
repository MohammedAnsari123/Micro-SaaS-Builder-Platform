import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

// Loading fallback component
const PageLoader = () => (
  <div style={{
    height: '100vh', width: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#fff'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '50%',
      border: '3px solid rgba(59, 130, 246, 0.2)', borderTopColor: '#3b82f6',
      animation: 'spin 1s linear infinite', marginBottom: '16px'
    }}></div>
    <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Loading Page</h2>
    <p style={{ color: '#94a3b8', marginTop: '8px' }}>Please wait...</p>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Lazy Loaded Pages
const Landing = lazy(() => import('./pages/Landing'));
const DashboardOverview = lazy(() => import('./pages/DashboardOverview'));
const Tenants = lazy(() => import('./pages/Tenants'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const GlobalSettings = lazy(() => import('./pages/GlobalSettings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const TemplateGallery = lazy(() => import('./pages/TemplateGallery'));
const TemplatePreview = lazy(() => import('./pages/TemplatePreview'));
const PublicApp = lazy(() => import('./pages/PublicApp'));
const TenantAdminLayout = lazy(() => import('./pages/admin/TenantAdminLayout'));

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

  // Disable Lenis on dashboard routes AND the landing page (/ uses GSAP ScrollTrigger pinning)
  const isLandingPage = location.pathname === '/';
  const isDashboard = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/sites') ||
    location.pathname.startsWith('/analytics') ||
    location.pathname.startsWith('/subscriptions') ||
    location.pathname.startsWith('/settings') ||
    location.pathname.startsWith('/templatePreview') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/site');
  const disableLenis = isDashboard || isLandingPage;

  // Initialize/Destroy Lenis based on route
  useEffect(() => {
    if (disableLenis) {
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
  }, [disableLenis]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30">
      {!isDashboard && <Navbar />}
      <main>
        <Suspense fallback={<PageLoader />}>
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
              <Route path="/sites" element={<Tenants />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/settings" element={<GlobalSettings />} />
            </Route>

            <Route path="/templates" element={<TemplateGallery />} />
            <Route path="/templatePreview/:slug" element={<TemplatePreview />} />
            <Route path="/site/:templateName/:emailPrefix/:cloneId?" element={<PublicApp />} />

            {/* CMS Site Management (Tenant Admin) */}
            <Route
              path="/admin/manage/:cloneId?"
              element={
                <ProtectedRoute>
                  <TenantAdminLayout token={localStorage.getItem('token')} onLogout={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
