import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import { useLocation } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";
import { PERMISSIONS, ROLES } from "../../../core/permissions.js";

const initialState = {
	user: null,
	isAuthenticated: false,
	isLoading: true,
};

function authReducer(state, action) {
	switch (action.type) {
		case "login":
			return { ...state, user: action.payload, isAuthenticated: true };
		case "logout":
			return { user: null, isAuthenticated: false };
		case "restore":
			return {
				...state,
				user: action.payload,
				isAuthenticated: !!action.payload,
				isLoading: false,
			};
		default:
			throw new Error("Unknown action type");
	}
}

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
	const { employees, projects, tasks } = useData();
	const location = useLocation();

	const [state, dispatch] = useReducer(authReducer, initialState);

	// Enrich employees with their projects and tasks
	const enrichedEmployees = useMemo(() => {
		if (!Array.isArray(employees)) {
			console.warn("Employees data is not an array:", employees);
			return [];
		}
		return employees
			.filter(
				(emp) => emp && emp.id && emp.email && typeof emp.email === "string",
			)
			.map((emp) => {
				const empProjects = projects.filter(
					(proj) => proj.employeeId === emp.id,
				);
				const empTasks = tasks.filter((task) => task.employeeId === emp.id);
				return {
					...emp,
					projects: empProjects,
					tasks: empTasks,
				};
			});
	}, [employees, projects, tasks]);

	// Map employees by email for quick lookup
	const employeeMap = useMemo(() => {
		if (!Array.isArray(enrichedEmployees)) {
			console.warn("Enriched employees is not an array:", enrichedEmployees);
			return new Map();
		}
		const validEmployees = enrichedEmployees.filter(
			(emp) => emp.email && typeof emp.email === "string",
		);
		if (validEmployees.length < enrichedEmployees.length) {
			console.warn(
				"Some employees have invalid emails:",
				enrichedEmployees.filter(
					(emp) => !emp.email || typeof emp.email !== "string",
				),
			);
		}
		return new Map(validEmployees.map((emp) => [emp.email.toLowerCase(), emp]));
	}, [enrichedEmployees]);

	// Build projectMap to aggregate projects and their tasks
	const projectMap = useMemo(() => {
		const map = new Map();

		projects.forEach((proj) => {
			if (!map.has(proj.id)) {
				map.set(proj.id, {
					...proj,
					tasks: [],
					owners: new Set(),
				});
			}

			const existing = map.get(proj.id);
			// Add tasks for this project
			const projTasks = tasks.filter((task) => task.projectId === proj.id);
			existing.tasks.push(...projTasks);
			// Add owner (employee name)
			const emp = enrichedEmployees.find((e) => e.id === proj.employeeId);
			if (emp) {
				existing.owners.add(emp.name);
			}
		});

		// Convert owners Set to Array
		return new Map(
			[...map.entries()].map(([id, proj]) => [
				id,
				{ ...proj, owners: [...proj.owners] },
			]),
		);
	}, [projects, tasks, enrichedEmployees]);

	useEffect(() => {
		const savedUser = localStorage.getItem("user");
		if (savedUser) {
			dispatch({ type: "restore", payload: JSON.parse(savedUser) });
		} else {
			dispatch({ type: "restore", payload: null });
		}
	}, []);

	useEffect(() => {
		if (location.pathname === "/") {
			localStorage.removeItem("user");
			dispatch({ type: "logout" });
		}
	}, [location.pathname]);

	async function authenticateEmployee(email, password) {
		const emp = employeeMap.get(email.toLowerCase());

		if (typeof email !== "string" || !email.includes("@")) {
			return { user: null, error: "Invalid email format" };
		}
		if (typeof password !== "string" || password.length < 6) {
			return { user: null, error: "Password too short" };
		}
		if (!emp) {
			return { user: null, error: "No employee found with this email" };
		}
		if (emp.password !== password) {
			return { user: null, error: "Invalid password" };
		}

		const { password: _, ...safeEmp } = emp;

		const role = safeEmp.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.EMPLOYEE;

		const userWithPermissions = {
			...safeEmp,
			role,
			permissions: PERMISSIONS[role] || [],
		};

		localStorage.setItem("user", JSON.stringify(userWithPermissions));
		dispatch({ type: "login", payload: userWithPermissions });

		return { user: userWithPermissions, error: null };
	}

	function logout() {
		localStorage.removeItem("user");
		dispatch({ type: "logout" });
	}

	function hasPermission(page) {
		return state?.user?.permissions?.includes(page) ?? false;
	}

	// Filter employees based on role
	const visibleEmployees = useMemo(() => {
		if (state.user?.role === ROLES.ADMIN) {
			return enrichedEmployees.map(({ password, ...e }) => e);
		}
		return state.user ? [{ ...state.user }] : [];
	}, [state.user, enrichedEmployees]);

	return (
		<AuthContext.Provider
			value={{
				...state,
				authenticateEmployee,
				logout,
				hasPermission,
				employees: visibleEmployees,
				projectMap,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const {
		authenticateEmployee,
		user,
		employees,
		projectMap,
		isAuthenticated,
		logout,
		isLoading,
		hasPermission,
	} = useContext(AuthContext);
	return {
		authenticateEmployee,
		user,
		employees,
		projectMap,
		isAuthenticated,
		logout,
		isLoading,
		hasPermission,
	};
}
