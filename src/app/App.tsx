// src/app/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { SpaceDetailPage } from './pages/SpaceDetailPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ReservationPage } from './pages/ReservationPage';
import { ReservationDetailsPage } from './pages/ReservationDetails';
import { CreateSpace } from './pages/CreateSpace';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Chatbot } from './components/Chatbot';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                {/* Routes publiques */}
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="space/:id" element={<SpaceDetailPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="reservation/:id" element={<ReservationPage />} />

                {/* Routes protégées (nécessite authentification) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard/user" element={<UserDashboard />} />
                  <Route path="dashboard/owner" element={<OwnerDashboard />} />
                  <Route path="dashboard/admin" element={<AdminDashboard />} />
                  <Route path="spaces/create" element={<CreateSpace />} />
                  <Route path="spaces/:id/edit" element={<CreateSpace />} />
                  <Route path="reservations/:id" element={<ReservationDetailsPage/>} />
                </Route>

                {/* Route 404 - Page non trouvée */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            <Chatbot />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;