import { create } from "zustand";
import { authStorage } from "../storage/AuthStorage";
import { api } from "../utils/axios/api";

type AuthStore = {
    loading: boolean;
    initialized: boolean;

    accessToken: string | null;
    user: AuthUser | null;

    setAccessToken: (token: string | null) => void;

    login: (data: {
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
    }) => void;

    init: () => Promise<void>;

    logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    loading: true,
    initialized: false,

    accessToken: authStorage.getAccessToken(),
    user: null,

    setAccessToken: (token) => {
        if (token) {
            authStorage.setAccessToken(token);
        } else {
            authStorage.removeAccessToken();
        }

        set({ accessToken: token });
    },

    login: ({ accessToken, refreshToken, user }) => {
        authStorage.setAccessToken(accessToken);
        authStorage.setRefreshToken(refreshToken);

        set({
            accessToken,
            user,
            loading: false,
            initialized: true,
        });
    },

    init: async () => {
        try {
            const accessToken = authStorage.getAccessToken();

            if (!accessToken) {
                set({
                    accessToken: null,
                    user: null,
                    loading: false,
                    initialized: true,
                });

                return;
            }

            set({
                accessToken,
                loading: true,
            });

            const response = await api.get("/auth/me");

            set({
                user: response.data.me.user,
                accessToken,
                loading: false,
                initialized: true,
            });
        } catch {
            authStorage.clear();

            set({
                accessToken: null,
                user: null,
                loading: false,
                initialized: true,
            });
        }
    },

    logout: () => {
        authStorage.clear();

        set({
            accessToken: null,
            user: null,
            loading: false,
            initialized: true,
        });
    },
}));