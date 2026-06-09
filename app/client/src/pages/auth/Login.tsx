import { useCallback, useMemo, useState } from "react"
import { api } from "../../utils/axios/api";
import { useAuthStore } from "../../stores/AuthStore";
import { authStorage } from "../../storage/AuthStorage";
import { useNavigate } from "react-router";


export default function LoginPage() {

    const navigate = useNavigate();

    const {
        login,
    } = useAuthStore();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [processing, setProcessing] = useState<boolean>(false);

    const handleLogin = useCallback(async () => {
        try {
            setProcessing(true);

            const resp = await api.post("/auth/login", {
                email,
                password
            });

            login(resp.data.data);

            navigate("/users");
        } catch (error) {
            console.log("Ocorreu um erro ao realizar login: ", error);
        } finally {
            setProcessing(false);
        }
    }, [email, password, navigate, login]);
    
    return (
        <div>
            <p>
                Email
            </p>
            <input
                value={email}
                onChange={v => setEmail(v.currentTarget.value)}
            />

            <p>
                senha
            </p>
            <input
                type="password"
                value={password}
                onChange={v => setPassword(v.currentTarget.value)}
            />

            <button
                value={processing ? "Processando..." : "Login"}
                onClick={handleLogin}
                disabled={processing}
            />
        </div>
    )
}