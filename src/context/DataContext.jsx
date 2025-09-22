import { createContext, useContext, useMemo } from "react";
import { useEntity } from "../hooks/useEntity.js";

export const DataContext = createContext();

export default function DataProvider({ children }) {
	// Fetch employees, projects, and tasks using useEntity
	const {
		data: employeesData,
		isLoading: employeesLoading,
		error: employeesError,
	} = useEntity("employees");
	const {
		data: projectsData,
		isLoading: projectsLoading,
		error: projectsError,
	} = useEntity("projects");
	const {
		data: tasksData,
		isLoading: tasksLoading,
		error: tasksError,
	} = useEntity("tasks");

	// Ensure data is an array, fallback to empty array if undefined
	const employees = Array.isArray(employeesData)
		? employeesData
		: (employeesData?.data ?? []);
	const projects = Array.isArray(projectsData)
		? projectsData
		: (projectsData?.data ?? []);
	const tasks = Array.isArray(tasksData) ? tasksData : (tasksData?.data ?? []);

	// Combine loading states (true if any are loading)
	const isLoading = employeesLoading || projectsLoading || tasksLoading;

	// Combine errors (return the first non-null error)
	const error = employeesError || projectsError || tasksError;

	// Compute totalProjects: group projects by projectName
	const totalProjects = useMemo(() => {
		const projectMap = projects.reduce((acc, proj) => {
			if (!acc[proj.projectName]) {
				acc[proj.projectName] = {
					projectName: proj.projectName,
					description: proj.description,
					projectIds: [proj.id], // Track all project IDs
					employeeIds: [proj.employeeId], // Track associated employees
					tasks: tasks.filter((task) => task.projectId === proj.id), // Tasks for this project
				};
			} else {
				acc[proj.projectName].projectIds.push(proj.id);
				acc[proj.projectName].employeeIds.push(proj.employeeId);
				acc[proj.projectName].tasks.push(
					...tasks.filter((task) => task.projectId === proj.id),
				);
			}
			return acc;
		}, {});

		return Object.values(projectMap);
	}, [projects, tasks]);

	return (
		<DataContext.Provider
			value={{
				employees,
				projects,
				tasks,
				totalProjects,
				isLoading,
				error,
			}}
		>
			{children}
		</DataContext.Provider>
	);
}

export function useData() {
	const { employees, projects, tasks, totalProjects, isLoading, error } =
		useContext(DataContext);

	return {
		employees,
		projects,
		tasks,
		totalProjects,
		isLoading,
		error,
	};
}
