export const ROLES = {
	ADMIN: "admin",
	EMPLOYEE: "employee",
};

export const PERMISSIONS = {
	[ROLES.ADMIN]: ["dashboard", "employees", "projects", "tasks"],
	[ROLES.EMPLOYEE]: ["projects", "tasks"],
};
