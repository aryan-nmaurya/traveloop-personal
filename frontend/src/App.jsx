import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
