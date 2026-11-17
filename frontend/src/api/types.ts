export interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}

export interface AuthUser {
    id: string,
    username: string,
    email: string,
    role?: string
}

export interface LoginPayload {
    username: string,
    password: string
}

export interface LoginResponse {
    accessToken: string,
    refreshToken: string
    user: AuthUser
}

export interface RegisterPayload {
    email: string;
    password: string;
    confirmPassword: string;
    userName: string;
    firstName: string;
    lastName: string;
}

export interface RegisterResponseData {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
}

