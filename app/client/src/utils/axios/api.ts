import axios from "axios";
import { useAuthStore } from "../../stores/AuthStore";
import { authStorage } from "../../storage/AuthStorage";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token =
        useAuthStore.getState().accessToken ||
        authStorage.getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let isRefreshing = false;
let failedQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
    failedQueue.forEach((callback) => callback(token));
    failedQueue = [];
}

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken = authStorage.getRefreshToken();

        if (!refreshToken) {
            useAuthStore.getState().logout();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push((newToken) => {
                    if (!newToken) {
                        reject(error);
                        return;
                    }

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(api(originalRequest));
                });
            });
        }

        isRefreshing = true;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/refresh`,
                {
                    refresh_token: refreshToken,
                }
            );

            const newAccessToken = response.data.data.access_token;
            const newRefreshToken = response.data.data.refresh_token;

            authStorage.setAccessToken(newAccessToken);

            if (newRefreshToken) {
                authStorage.setRefreshToken(newRefreshToken);
            }

            useAuthStore.getState().setAccessToken(newAccessToken);

            processQueue(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            processQueue(null);
            useAuthStore.getState().logout();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);