import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';

// Public pages
import Landing from './pages/Landing';
import Login   from './pages/Login';
import Signup  from './pages/Signup';

// App pages
import Dashboard    from './pages/Home';
import Practice     from './pages/Practice';
import ProgressPage from './pages/Progress';
import Lessons      from './pages/Lessons';
import Profile      from './pages/Profile';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"       element={<Landing />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Authenticated app — sidebar layout */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index            element={<Dashboard />} />
        <Route path="practice"  element={<Lessons />} />
        <Route path="practice/:targetId" element={<Practice />} />

        <Route path="progress"  element={<ProgressPage />} />
        <Route path="profile"   element={<Profile />} />
        <Route path="*"         element={<Navigate to="/app" replace />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="/progress"          element={<Navigate to="/app/progress" replace />} />
      <Route path="/practice/:id"      element={<Navigate to="/app" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
