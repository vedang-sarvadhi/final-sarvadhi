import { Button, Container, Flex, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext.jsx";

export default function Navbar() {
	const { isAuthenticated, logout, hasPermission } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
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
								{hasPermission("dashboard") && (
									<NavLink
										to="/dashboard"
										className={({ isActive }) =>
											`nav-link ${isActive ? "active" : ""}`
										}
										style={{
											fontWeight: 500,
											position: "relative",
											paddingBottom: "4px",
											textDecoration: "none",
											color: "inherit",
										}}
									>
										Dashboard
									</NavLink>
								)}

								{hasPermission("employees") && (
									<NavLink
										to="/employee"
										className={({ isActive }) =>
											`nav-link ${isActive ? "active" : ""}`
										}
										style={{
											fontWeight: 500,
											position: "relative",
											paddingBottom: "4px",
											textDecoration: "none",
											color: "inherit",
										}}
									>
										Employees
									</NavLink>
								)}

								{hasPermission("projects") && (
									<NavLink
										to="/projects"
										className={({ isActive }) =>
											`nav-link ${isActive ? "active" : ""}`
										}
										style={{
											fontWeight: 500,
											position: "relative",
											paddingBottom: "4px",
											textDecoration: "none",
											color: "inherit",
										}}
									>
										Projects
									</NavLink>
								)}

								{hasPermission("tasks") && (
									<NavLink
										to="/task"
										className={({ isActive }) =>
											`nav-link ${isActive ? "active" : ""}`
										}
										style={{
											fontWeight: 500,
											position: "relative",
											paddingBottom: "4px",
											textDecoration: "none",
											color: "inherit",
										}}
									>
										Tasks
									</NavLink>
								)}
							</Group>

							{/* Buttons */}
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
