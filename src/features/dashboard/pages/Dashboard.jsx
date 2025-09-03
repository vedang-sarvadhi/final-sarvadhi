import "@mantine/core/styles.css";
import EmployeeTable from "../../employees/components/EmployeeTable.jsx";
import ProjectTable from "../../projects/components/ProjectTable.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
export default function Dashboard() {
	return (
		<>
			<DashboardStats />
			<EmployeeTable />
			<ProjectTable />
		</>
	);
}
