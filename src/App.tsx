import './App.scss'
import HomeLoggedUser from './pages/HomeLoggedUser/HomeLoggedUser'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home/Home'
import Onboarding from './pages/Onboarding/Onboarding'
import Login from './pages/Login/Login'
import { Toaster } from 'sonner';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import LoggedRoute from './components/ProtectedRoute/LoggedRoute'
import Session from './pages/Session/Session'
import Pricing from './pages/Pricing/Pricing'
import Preferences from './pages/Preferences/Preferences'
import SubscriptionSuccess from './pages/Subscription/SubscriptionSuccess'
import SubscriptionCanceled from './pages/Subscription/SubscriptionCanceled'
import SessionHistory from './pages/SessionHistory/SessionHistory'
import Account from './pages/Account/Account'
import NotFound from './pages/NotFound/NotFound'
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
        <Routes>
          <Route path="/" element={<Home />} />
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

          {/* 404 Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
