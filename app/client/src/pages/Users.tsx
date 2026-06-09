import { useCallback } from "react";
import { authStorage } from "../storage/AuthStorage";
import { useAuthStore } from "../stores/AuthStore"
import { api } from "../utils/axios/api";
import { useNavigate } from "react-router";



export default function UsersPage() {

    const {
        user,
        logout,
    } = useAuthStore();

    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {

        const refreshToken = authStorage.getRefreshToken();

        try {
            if (refreshToken) {
                await api.post("/auth/logout", {
                    refresh_token: refreshToken,
                });
            }
        } finally {
            logout();
            navigate("/login");
        }
    }, [logout, navigate]);

    return (
        <div
            style={{
                background: '#fff',
                color: '#000'
            }}
        >
            <p>
                ola sou o {user?.name ?? "Não identificado"}
            </p>

            {!user && (
                <button
                    value={"Logar"}
                    onClick={() => navigate("/login")}
                />
            )}

            {user && (
                <button
                    value={"Deslogar"}
                    onClick={handleLogout}
                />
            )}
        </div>
    )
}
