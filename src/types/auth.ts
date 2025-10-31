export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string>;
    timestamp: string;
}

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    lastLoginAt?: string;
}

export interface AuthResponse {
    tokenType: string;
    expiresIn: number;
    user: UserResponse;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
}

export interface ResetPasswordRequest {
    newPassword: string;
    confirmPassword: string;
}