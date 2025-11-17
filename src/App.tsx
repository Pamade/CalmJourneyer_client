import './App.scss'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home/Home'
import Resources from './pages/Resources/Resources'
import ResourcePost from './pages/Resources/ResourcePost'
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import LoggedRoute from './components/ProtectedRoute/LoggedRoute'

// Lazy load all routes except Home for faster initial load
const HomeLoggedUser = lazy(() => import('./pages/HomeLoggedUser/HomeLoggedUser'))
const Onboarding = lazy(() => import('./pages/Onboarding/Onboarding'))
const Login = lazy(() => import('./pages/Login/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail/VerifyEmail'))
const Session = lazy(() => import('./pages/Session/Session'))
const Pricing = lazy(() => import('./pages/Pricing/Pricing'))
const Preferences = lazy(() => import('./pages/Preferences/Preferences'))
const SubscriptionSuccess = lazy(() => import('./pages/Subscription/SubscriptionSuccess'))
const SubscriptionCanceled = lazy(() => import('./pages/Subscription/SubscriptionCanceled'))
const SessionHistory = lazy(() => import('./pages/SessionHistory/SessionHistory'))
const Account = lazy(() => import('./pages/Account/Account'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'))

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#3A3A3A'
  }}>
    Loading...
  </div>
);

function App() {

  return (
    <>
      <Toaster
        position="top-right"
        theme="light"
        richColors={true}
        visibleToasts={1}
      />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:slug" element={<ResourcePost />} />
            <Route path="/onboarding" element={<LoggedRoute><Onboarding /></LoggedRoute>} />
            <Route path="/pricing" element={<Pricing />} />

            <Route path="/login" element={<LoggedRoute> <Login /></LoggedRoute>} />
            <Route path="/forgot-password" element={<LoggedRoute> <ForgotPassword /></LoggedRoute>} />

            <Route path="/verify-email" element={<ProtectedRoute requireVerification={false}> <VerifyEmail /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute> <HomeLoggedUser /></ProtectedRoute>} />
            <Route path="/preferences" element={<ProtectedRoute> <Preferences /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute> <Account /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute> <SessionHistory /></ProtectedRoute>} />
            <Route path="/session" element={<Session />} />
            <Route path="/session/shared/:sessionId" element={<Session />} />
            <Route path="/session/:sessionId" element={<ProtectedRoute> <Session /></ProtectedRoute>} />
            <Route path="/subscription/success" element={<ProtectedRoute> <SubscriptionSuccess /></ProtectedRoute>} />
            <Route path="/subscription/canceled" element={<ProtectedRoute> <SubscriptionCanceled /></ProtectedRoute>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* 404 Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

    </>
  )
}

export default App
