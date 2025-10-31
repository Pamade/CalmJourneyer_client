import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../utils/AuthApi';
import type { UserResponse } from "../types/auth";

interface AuthContextType {
    user: UserResponse | null;
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
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const response = await authApi.getCurrentUser();
            if (response.success && response.data) {
                setUser(response.data);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        const response = await authApi.login({ email, password });
        if (response.success && response.data) {
            setUser(response.data.user);
        }
    }

    async function register(name: string, email: string, password: string, repeatPassword: string) {
        const response = await authApi.register({ name, email, password, repeatPassword });
        if (response.success && response.data) {
            setUser(response.data.user);
        }
    }

    async function forgotPassword(email: string) {

        await authApi.forgotPassword(email);
    }

    async function resetPassword(token: string, newPassword: string, confirmPassword: string) {
        const response = await authApi.resetPassword(token, { newPassword, confirmPassword });
        if (response.success && response.data) {
            setUser(response.data.user);
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