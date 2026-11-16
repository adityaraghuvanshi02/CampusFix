import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DemoBanner } from '@/components/DemoBanner';
import { LandingPage } from '@/pages/LandingPage';
import { ReportPage } from '@/pages/ReportPage';
import { TrackPage } from '@/pages/TrackPage';
import { QrCodesPage } from '@/pages/QrCodesPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/admin/dashboard"
          element={<AdminDashboardPage />}
        />
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen flex-col">
              <DemoBanner />
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/report" element={<ReportPage />} />
                  <Route path="/track" element={<TrackPage />} />
                  <Route path="/qr-codes" element={<QrCodesPage />} />
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}
