import { useState } from 'react'
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

          <Route path="/login" element={<LoggedRoute> <Login /></LoggedRoute>} />
          <Route path="/forgot-password" element={<LoggedRoute> <ForgotPassword /></LoggedRoute>} />

          <Route path="/verify-email" element={<ProtectedRoute> <VerifyEmail /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute> <HomeLoggedUser /></ProtectedRoute>} />
          <Route path="/session" element={<Session />} />
        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
