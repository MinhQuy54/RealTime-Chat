import { env } from "../config/env";
import type { ApiResponse } from "./types";

export async function request<T>(
    path: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${env.apiBaseUrl}${path}`, {
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers
        }
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const error = new Error(data?.message || 'FETCH_FAILED');
        (error as any).response = { data, status: res.status };
        throw error;
    }

    return data as ApiResponse<T>;
}