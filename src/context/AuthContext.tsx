import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../utils/AuthApi';
import axios from 'axios';

export interface User {
    id: string;
    email: string;
    username?: string;
    name?: string;
    emailVerified?: boolean;
    onboardingCompleted?: boolean;
    provider?: string; // 'google' or 'local'
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, repeatPassword: string) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;
    verifyToken: (token: string) => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
    sendVerificationEmail: (email: string) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                withCredentials: true
            });

            if (response.data.success && response.data.data) {
                const userData = response.data.data;
                setUser({
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    emailVerified: userData.emailVerified || false,
                    onboardingCompleted: userData.onboardingCompleted || false,
                    provider: userData.provider || 'local'
                });
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                email,
                password
            }, { withCredentials: true });

            if (response.data.success && response.data.data) {
                const userData = response.data.data.user;
                setUser({
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    emailVerified: userData.emailVerified || false,
                    onboardingCompleted: userData.onboardingCompleted || false,
                    provider: userData.provider || 'local'
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async function register(name: string, email: string, password: string, repeatPassword: string) {
        const response = await authApi.register({ name, email, password, repeatPassword });
        if (response.success && response.data) {
            const userData = response.data.user;
            setUser({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                emailVerified: userData.emailVerified || false,
                onboardingCompleted: userData.onboardingCompleted || false,
                provider: userData.provider || 'local'
            });
        }
    }

    async function forgotPassword(email: string) {

        await authApi.forgotPassword(email);
    }

    async function resetPassword(token: string, newPassword: string, confirmPassword: string) {
        const response = await authApi.resetPassword(token, { newPassword, confirmPassword });
        if (response.success && response.data) {
            const userData = response.data.user;
            setUser({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                emailVerified: userData.emailVerified || false,
                onboardingCompleted: userData.onboardingCompleted || false,
                provider: userData.provider || 'local'
            });
        }
    }

    async function verifyToken(token: string) {
        await authApi.verifyToken(token);
    }

    async function logout() {
        await authApi.logout();
        setUser(null);
    }

    async function verifyEmail(token: string) {
        await authApi.verifyEmail(token);
    }


    async function sendVerificationEmail(email: string) {

        await authApi.sendVerificationEmail(email);

    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyToken,
        verifyEmail,
        sendVerificationEmail,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// 🔧 NEW: Optimistic auth hook for homepage - non-blocking, immediate render
export function useOptimisticAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check auth in background, don't block rendering
        checkAuthInBackground();
    }, []);

    const checkAuthInBackground = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                withCredentials: true,
                timeout: 3000 // 3 second timeout to prevent hanging
            });

            if (response.data.success && response.data.data) {
                const userData = response.data.data;
                setUser({
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    emailVerified: userData.emailVerified || false,
                    onboardingCompleted: userData.onboardingCompleted || false,
                    provider: userData.provider || 'local'
                });
            } else {
                setUser(null);
            }
        } catch (error) {
            // Silently fail - user stays null (default for public homepage)
            setUser(null);
        }
    };

    return { user };
}