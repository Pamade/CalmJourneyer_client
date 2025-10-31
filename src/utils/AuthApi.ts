import axiosInstance from './axios';
import type {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UserResponse,
    ResetPasswordRequest
} from '../types/auth';

export const authApi = {
    // Login
    login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
            '/auth/login',
            credentials
        );
        return response.data;
    },

    // Register
    register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
        const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
            '/auth/register',
            data
        );
        return response.data;
    },

    // Logout
    logout: async (): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.post<ApiResponse<void>>('/auth/logout');
        return response.data;
    },

    // Get current user
    getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
        const response = await axiosInstance.get<ApiResponse<UserResponse>>('/auth/me');
        return response.data;
    },

    // Refresh token
    refreshToken: async (): Promise<ApiResponse<AuthResponse>> => {
        const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/refresh');
        return response.data;
    },

    forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.post<ApiResponse<void>>(
            '/auth/forgot-password',
            null,
            { params: { email } }
        );
        console.log(response.data);
        return response.data;
    },

    sendVerificationEmail: async (email: string): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.post<ApiResponse<void>>(
            '/auth/send-verification-email',
            null,
            { params: { email } }
        );
        return response.data;
    },

    verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.post<ApiResponse<void>>(
            '/auth/verify-email',
            null,
            { params: { token } }
        );
        return response.data;
    },

    verifyToken: async (token: string): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.post<ApiResponse<void>>(
            '/auth/verify-reset-token',
            null,
            { params: { token } }
        );
        return response.data;
    },

    resetPassword: async (token: string, data: ResetPasswordRequest): Promise<ApiResponse<AuthResponse>> => {
        const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
            '/auth/reset-password',
            data,
            { params: { token } }
        );
        return response.data;
    },
};