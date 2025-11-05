
import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './ProtectedRoute.module.scss';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireVerification?: boolean; // If true, require email verification
}

export default function ProtectedRoute({ children, requireVerification = true }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if email verification is required and user is not verified
    // Skip verification check for Google login users (provider === 'google')
    if (requireVerification && !user.emailVerified && user.provider !== 'google') {
        return <Navigate to="/verify-email" replace />;
    }

    return <>{children}</>;
}