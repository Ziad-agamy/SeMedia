import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

const ProtectedRoute = () => {
    const { token, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
