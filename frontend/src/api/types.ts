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

