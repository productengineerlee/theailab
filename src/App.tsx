import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// 공개 페이지
const About = lazy(() => import('./pages/About'));
const History = lazy(() => import('./pages/History'));
const Culture = lazy(() => import('./pages/Culture'));
const Product = lazy(() => import('./pages/Product'));
const News = lazy(() => import('./pages/News'));
const Partner = lazy(() => import('./pages/Partner'));
const Career = lazy(() => import('./pages/Career'));
const IR = lazy(() => import('./pages/IR'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin 페이지
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AboutManage = lazy(() => import('./pages/admin/AboutManage'));
const CultureManage = lazy(() => import('./pages/admin/CultureManage'));
const HistoryManage = lazy(() => import('./pages/admin/HistoryManage'));
const ProductManage = lazy(() => import('./pages/admin/ProductManage'));
const PartnerManage = lazy(() => import('./pages/admin/PartnerManage'));
const CareerManage = lazy(() => import('./pages/admin/CareerManage'));
const NewsManage = lazy(() => import('./pages/admin/NewsManage'));

// 로딩 컴포넌트
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* 공개 페이지 */}
              <Route path="/" element={<Layout><About /></Layout>} />
              <Route path="/history" element={<Layout><History /></Layout>} />
              <Route path="/culture" element={<Layout><Culture /></Layout>} />
              <Route path="/product" element={<Layout><Product /></Layout>} />
              <Route path="/news" element={<Layout><News /></Layout>} />
              <Route path="/partner" element={<Layout><Partner /></Layout>} />
              <Route path="/career" element={<Layout><Career /></Layout>} />
              <Route path="/ir" element={<Layout><IR /></Layout>} />

              {/* Admin 로그인 */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin 페이지 (보호된 라우트) */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="about" element={<AboutManage />} />
                <Route path="culture" element={<CultureManage />} />
                <Route path="history" element={<HistoryManage />} />
                <Route path="product" element={<ProductManage />} />
                <Route path="partner" element={<PartnerManage />} />
                <Route path="career" element={<CareerManage />} />
                <Route path="news" element={<NewsManage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App
