import { Route, Routes } from "react-router-dom";
import Login from "../features/auth/components/Login.jsx";
import RoleGuard from "../features/auth/guards/RoleGuard.jsx";
import Dashboard from "../features/dashboard/pages/Dashboard.jsx";
import EmployeeForm from "../features/employees/components/EmployeeForm.jsx";
import ProjectForm from "../features/projects/components/ProjectForm.jsx";
import ProjectTable from "../features/projects/components/ProjectTable.jsx";
import ProjectDetail from "../features/projects/pages/ProjectDetail.jsx";
import TaskForm from "../features/tasks/components/TaskForm.jsx";
import PageNotFound from "../layouts/PageNotFound.jsx";
import PrivateLayout from "../layouts/PrivateLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";

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
