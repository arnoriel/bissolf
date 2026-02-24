import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { LandingPage } from './pages/LandingPage';
import { SignIn } from './pages/SignIn';
import { CreateProfile } from './pages/CreateProfile';
import { DashboardLayout } from './layout/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ProfileSettings } from './pages/ProfileSettings';

// Protected Route Component
const ProtectedRoute = ({ children, requireProfile = true }: { children: React.ReactNode, requireProfile?: boolean }) => {
  const { isAuthenticated, hasProfile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requireProfile && !hasProfile) {
    return <Navigate to="/create-profile" replace />;
  }

  return <>{children}</>;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, hasProfile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (!hasProfile) {
      return <Navigate to="/create-profile" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
            
            {/* Profile Creation - Protected but doesn't require existing profile */}
            <Route path="/create-profile" element={
              <ProtectedRoute requireProfile={false}>
                <CreateProfile />
              </ProtectedRoute>
            } />

            {/* Admin Routes - Protected & Require Profile */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="analyzer" element={<AnalyzerPage />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;