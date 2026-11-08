import { env } from "../config/env";
import type { ApiResponse } from "./types";

export async function request<T>(
    path: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${env.apiBaseUrl}${path}}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers
        }
    })
    if (!res.ok) {
        throw new Error('FETCH_FAILED')
    }
    return res.json() as Promise<ApiResponse<T>>
}