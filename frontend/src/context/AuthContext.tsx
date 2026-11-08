import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { clearAuthTokens, getAccessToken, getMeApi } from "../api/auth";
import type { AuthUser } from "../api/types";

type AuthContextValue = {
    user: AuthUser | null;
    loading: boolean;
    setUser: (user: AuthUser | null) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        const token = getAccessToken();
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const res = await getMeApi();
            setUser({
                id: res.id,
                username: res.username,
                email: res.email,
                role: res.role,
            });
        } catch {
            clearAuthTokens();
            setUser(null);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            setLoading(true);
            try {
                if (!cancelled) await refreshUser();
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void bootstrap();
        return () => {
            cancelled = true;
        };
    }, [refreshUser]);

    const logout = useCallback(() => {
        clearAuthTokens();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, loading, setUser, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
