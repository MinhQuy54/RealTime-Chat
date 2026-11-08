import { request } from "./clients";
import type { AuthUser, LoginPayload, LoginResponse } from "./types";


const AUTH_KEYS = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken'
} as const

export function saveAuthTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(AUTH_KEYS.accessToken, accessToken);
    localStorage.setItem(AUTH_KEYS.refreshToken, refreshToken)
}


export function clearAuthTokens() {
    localStorage.removeItem(AUTH_KEYS.accessToken);
    localStorage.removeItem(AUTH_KEYS.refreshToken);
}

export function getAccessToken(): string | null {
    return localStorage.getItem(AUTH_KEYS.accessToken);
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    const res = await request<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return res.data;
}

export async function getMeApi(): Promise<AuthUser> {
    const res = await request<AuthUser>("/api/user");
    return res.data
}