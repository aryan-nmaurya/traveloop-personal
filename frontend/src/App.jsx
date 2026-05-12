import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import TripsListPage from './pages/Trips/TripsListPage';
import CreateTripPage from './pages/Trips/CreateTripPage';
import ItineraryBuilderPage from './pages/Itinerary/ItineraryBuilderPage';
import ItineraryViewPage from './pages/Itinerary/ItineraryViewPage';
import TripInvoicePage from './pages/Itinerary/TripInvoicePage';
import CitySearchPage from './pages/Search/CitySearchPage';
import ActivitySearchPage from './pages/Search/ActivitySearchPage';
import CommunityPage from './pages/Community/CommunityPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';
import TripNotesPage from './pages/Notes/TripNotesPage';
import ProfilePage from './pages/Profile/ProfilePage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import MovieItineraryPage from './pages/MovieItinerary/MovieItineraryPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ChatBot from './components/layout/ChatBot';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const AdminRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

const NotFoundPage = () => (
  <div
    className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center"
    style={{ background: 'var(--background)', color: 'var(--text-primary)' }}
  >
    <p className="text-8xl font-bold tracking-tight opacity-20">404</p>
    <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
    <p style={{ color: 'var(--text-secondary)' }}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
      style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)' }}
    >
      Back to dashboard
    </Link>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <ChatBot />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/trips" element={<TripsListPage />} />
              <Route path="/trips/new" element={<CreateTripPage />} />
              <Route path="/trips/:id/build" element={<ItineraryBuilderPage />} />
              <Route path="/trips/:id/view" element={<ItineraryViewPage />} />
              <Route path="/trips/:id/invoice" element={<TripInvoicePage />} />
              <Route path="/trips/:id/checklist" element={<ChecklistPage />} />
              <Route path="/trips/:id/notes" element={<TripNotesPage />} />
              <Route path="/search/cities" element={<CitySearchPage />} />
              <Route path="/search/activities" element={<ActivitySearchPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/movie-itinerary" element={<MovieItineraryPage />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
