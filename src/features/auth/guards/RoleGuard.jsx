import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RoleGuard({ permission }) {
	const { isAuthenticated, hasPermission } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	if (!hasPermission(permission)) {
		return <Navigate to="/unauthorized" replace />;
	}

	return <Outlet />;
}
