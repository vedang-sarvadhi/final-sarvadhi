import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import RoleGuard from "../features/auth/guards/RoleGuard.jsx";
import PageNotFound from "../layouts/PageNotFound.jsx";

const Dashboard = lazy(
	() => import("../features/dashboard/pages/Dashboard.jsx"),
);
const EmployeeForm = lazy(
	() => import("../features/employees/components/EmployeeForm.jsx"),
);
const ProjectForm = lazy(
	() => import("../features/projects/components/ProjectForm.jsx"),
);
const ProjectTable = lazy(
	() => import("../features/projects/components/ProjectTable.jsx"),
);
const ProjectDetail = lazy(
	() => import("../features/projects/pages/ProjectDetail.jsx"),
);
const TaskForm = lazy(
	() => import("../features/tasks/components/TaskForm.jsx"),
);
const TaskTable = lazy(
	() => import("../features/tasks/components/TaskTable.jsx"),
); // Assuming a TaskTable component
const PrivateLayout = lazy(() => import("../layouts/PrivateLayout.jsx"));
const PublicLayout = lazy(() => import("../layouts/PublicLayout.jsx"));
const Login = lazy(() => import("../features/auth/components/Login.jsx"));

export function AppRoutes() {
	return (
		<Routes>
			<Route element={<PublicLayout />}>
				<Route path="/" element={<Login />} />
			</Route>

			<Route element={<PrivateLayout />}>
				<Route element={<RoleGuard permission="dashboard" />}>
					<Route path="dashboard" element={<Dashboard />} />
				</Route>

				<Route element={<RoleGuard permission="employees" />}>
					<Route path="employee" element={<EmployeeForm />} />
				</Route>

				<Route element={<RoleGuard permission="projects" />}>
					<Route path="projects" element={<ProjectTable />} />
					<Route path="projects/:projectId" element={<ProjectDetail />} />
					<Route path="projects/add" element={<ProjectForm />} />
				</Route>

				<Route element={<RoleGuard permission="tasks" />}>
					<Route path="tasks" element={<TaskTable />} />{" "}
					{/* New tasks overview route */}
					<Route path="projects/:projectId/tasks/add" element={<TaskForm />} />
				</Route>
			</Route>

			<Route path="*" element={<PageNotFound />} />
		</Routes>
	);
}
