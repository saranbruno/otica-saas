import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import UsersPage from './pages/Users'
import { useAuthStore } from './stores/AuthStore';
import { useEffect } from 'react';
import LoginPage from './pages/auth/Login';

type RouteGuardProps = {
    children: ReactElement;
}

function AuthenticatedRoute({ children }: RouteGuardProps) {
    const {
        accessToken,
        user,
    } = useAuthStore();

    if (!accessToken || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function GuestRoute({ children }: RouteGuardProps) {
    const {
        accessToken,
        user,
    } = useAuthStore();

    if (accessToken && user) {
        return <Navigate to="/users" replace />;
    }

    return children;
}

export default function App() {

    const {
        init,
        initialized,
        accessToken,
        user,
    } = useAuthStore();

    useEffect(() => {
        init();
    }, [init]);

    if (!initialized) {
        return <div>Carregando...</div>;
    }

    const initialRoute = accessToken && user ? "/users" : "/login";

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={initialRoute} replace />} />
                <Route
                    path="/users"
                    element={(
                        <AuthenticatedRoute>
                            <UsersPage />
                        </AuthenticatedRoute>
                    )}
                />
                <Route
                    path="/login"
                    element={(
                        <GuestRoute>
                            <LoginPage />
                        </GuestRoute>
                    )}
                />
                <Route path="*" element={<Navigate to={initialRoute} replace />} />
            </Routes>
        </BrowserRouter>
    )
}
