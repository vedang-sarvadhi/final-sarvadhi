import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RoleGuard({ permission }) {
	const { isAuthenticated, hasPermission, isLoading } = useAuth();

	if (isLoading) {
		return <div className="flex h-screen items-center justify-center"></div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	if (!hasPermission(permission)) {
		return <Navigate to="/unauthorized" replace />;
	}

	return <Outlet />;
}
