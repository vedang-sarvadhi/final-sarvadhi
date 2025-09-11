import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import RoleGuard from "../features/auth/guards/RoleGuard.jsx";
import PageNotFound from "../layouts/PageNotFound.jsx";

// import Login from "../features/auth/components/Login.jsx";
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
const PrivateLayout = lazy(() => import("../layouts/PrivateLayout.jsx"));
const PublicLayout = lazy(() => import("../layouts/PublicLayout.jsx"));

const Login = lazy(() => import("../features/auth/components/Login.jsx"));

// dist/index.html                   0.44 kB │ gzip:   0.29 kB
// dist/assets/index-fjl3epnG.css  214.35 kB │ gzip:  31.16 kB
// dist/assets/index-B7_xhLkB.js   574.93 kB │ gzip: 181.09 kB

export function AppRoutes() {
	return (
		<Routes>
			<Route element={<PublicLayout />}>
				<Route path="/" element={<Login />} />
			</Route>

			<Route>
				<Route path="*" element={<PageNotFound />} />
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
					<Route path="task" element={<TaskForm />} />
				</Route>
			</Route>
		</Routes>
	);
}
