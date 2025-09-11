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
	const { employees } = useData();
	const location = useLocation();

	const [state, dispatch] = useReducer(authReducer, initialState);

	const employeeMap = useMemo(
		() => new Map(employees.map((emp) => [emp.email.toLowerCase(), emp])),
		[employees],
	);

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

	const projectMap = useMemo(() => {
		const map = new Map();

		employees.forEach((emp) => {
			emp.projects?.forEach((proj) => {
				if (!map.has(proj.id)) {
					// first time seeing this project → create it
					map.set(proj.id, {
						...proj,
						tasks: [], // ensure tasks array is fresh
						owners: new Set(), // track multiple owners
					});
				}

				const existing = map.get(proj.id);
				// merge tasks (spread so we don't nest arrays)
				existing.tasks.push(...proj.tasks);
				// track owner(s)
				existing.owners.add(emp.name);
			});
		});

		// Convert owners Set → Array before returning
		return new Map(
			[...map.entries()].map(([id, proj]) => [
				id,
				{ ...proj, owners: [...proj.owners] },
			]),
		);
	}, [employees]);

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

	const visibleEmployees =
		state.user?.role === ROLES.ADMIN
			? employees.map(({ password, ...e }) => e)
			: state.user
				? [{ ...state.user }]
				: [];

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
