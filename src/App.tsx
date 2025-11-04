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
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route path="/login" element={<LoggedRoute> <Login /></LoggedRoute>} />
          <Route path="/forgot-password" element={<LoggedRoute> <ForgotPassword /></LoggedRoute>} />

          <Route path="/verify-email" element={<ProtectedRoute> <VerifyEmail /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute> <HomeLoggedUser /></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute> <Preferences /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute> <SessionHistory /></ProtectedRoute>} />
          <Route path="/session" element={<Session />} />
          <Route path="/session/:sessionId" element={<Session />} />
          <Route path="/subscription/success" element={<ProtectedRoute> <SubscriptionSuccess /></ProtectedRoute>} />
          <Route path="/subscription/canceled" element={<ProtectedRoute> <SubscriptionCanceled /></ProtectedRoute>} />
        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
