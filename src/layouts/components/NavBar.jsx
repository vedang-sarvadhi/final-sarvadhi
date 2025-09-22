import { Button, Container, Flex, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext.jsx";

export default function Navbar() {
	const { isAuthenticated, logout, hasPermission } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const pathname = location?.pathname ?? "";

	// Track if user visited Projects
	const [visitedProjects, setVisitedProjects] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	// Projects active only if NOT in tasks
	const isProjectsActive = () => {
		return (
			pathname === "/projects" ||
			pathname === "/projects/add" ||
			(pathname.startsWith("/projects/") && !pathname.includes("/tasks"))
		);
	};

	// Tasks active for /projects/:projectId/tasks
	const isTasksActive = () => {
		return /^\/projects\/[^/]+\/tasks/.test(pathname);
	};

	// Compute Tasks link dynamically based on current project
	const getTasksLink = () => {
		const match = pathname.match(/^\/projects\/([^/]+)/);
		if (match) return `/projects/${match[1]}/tasks/add`;

		// Default project if none visited yet
		return "/projects/p1_1/tasks/add";
	};

	// Handle Tasks click with Projects visit check
	const handleTasksClick = () => {
		if (!visitedProjects) setVisitedProjects(true); // mark projects as visited
		navigate(getTasksLink());
	};

	// Render link with click + keyboard accessibility
	const renderLink = (
		label,
		to,
		isActiveFn,
		isProjects = false,
		isTasks = false,
	) => {
		const handleClick = () => {
			if (isProjects) setVisitedProjects(true);
			if (isTasks) handleTasksClick();
			else navigate(to);
		};

		const handleKeyDown = (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleClick();
			}
		};

		return (
			<span
				role="button"
				tabIndex={0}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				className={`nav-link ${isActiveFn() ? "active" : ""}`}
				style={{
					fontWeight: 500,
					position: "relative",
					paddingBottom: "4px",
					textDecoration: "none",
					color: "inherit",
					cursor: "pointer",
				}}
			>
				{label}
			</span>
		);
	};

	return (
		<div style={{ borderBottom: "1px solid #eaeaea", background: "white" }}>
			<Container size="xl">
				<Flex justify="space-between" align="center" py="sm">
					<Group>
						<img src="/36.svg" alt="Sarvadhi" style={{ height: 40 }} />
						<img src="/47.svg" alt="Sarvadhi" style={{ height: 40 }} />
					</Group>

					{isAuthenticated && (
						<Group spacing="xl" ml="xl">
							<Group spacing={40} mr="lg">
								{hasPermission("dashboard") &&
									renderLink(
										"Dashboard",
										"/dashboard",
										() => pathname === "/dashboard",
									)}

								{hasPermission("employees") &&
									renderLink(
										"Employees",
										"/employee",
										() => pathname === "/employee",
									)}

								{hasPermission("projects") &&
									renderLink("Projects", "/projects", isProjectsActive, true)}

								{hasPermission("tasks") &&
									renderLink(
										"Tasks",
										getTasksLink(),
										isTasksActive,
										false,
										true,
									)}
							</Group>

							<Group spacing="md">
								<Button variant="light" radius="md" onClick={handleLogout}>
									Logout
								</Button>
								<Button variant="light" radius="md" onClick={handleLogout}>
									<IconArrowLeft size={18} />
								</Button>
							</Group>
						</Group>
					)}
				</Flex>
			</Container>

			<style>
				{`
          .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background-color: #228be6;
            transition: width 0.3s ease;
          }
          .nav-link.active::after {
            width: 100%;
          }
        `}
			</style>
		</div>
	);
}
