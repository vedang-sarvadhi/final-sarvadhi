import { createContext, useContext } from "react";
import { useEntity } from "../hooks/useEntity.js";

export const DataContext = createContext();

export default function DataProvider({ children }) {
	const { data: employees, isLoading, error } = useEntity("employees");

	const data = Array.isArray(employees) ? employees : (employees?.data ?? []);

	const projects = data.flatMap((emp) => emp.projects || []);

	const totalProjects = Object.values(
		projects.reduce((acc, obj) => {
			acc[obj.projectName] = { ...obj };
			return acc;
		}, {}),
	);

	return (
		<DataContext.Provider
			value={{
				employees: data,
				projects,
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
	const { employees, projects, totalProjects, isLoading, error } =
		useContext(DataContext);

	return {
		employees,
		projects,
		totalProjects,
		isLoading,
		error,
	};
}
