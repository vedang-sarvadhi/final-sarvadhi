"use client";

import {
	Button,
	Center,
	Container,
	Flex,
	Loader,
	Paper,
	Table,
	Title,
} from "@mantine/core";
import { Component } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";
import { ROLES } from "../../../core/permissions.js";
import { useAuth } from "../../auth/context/AuthContext.jsx";

class ErrorBoundary extends Component {
	state = { hasError: false, error: null };

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				<Center py="lg">
					<Title order={4} c="red">
						Error rendering projects: {this.state.error.message}
					</Title>
					<Button mt="md" onClick={() => this.setState({ hasError: false })}>
						Try Again
					</Button>
				</Center>
			);
		}
		return this.props.children;
	}
}

export default function ProjectTable() {
	const { totalProjects, isLoading, error } = useData();
	const { user } = useAuth();

	// Determine visible projects based on user role
	const visibleProjects =
		user?.role === ROLES.ADMIN ? totalProjects : user?.projects || [];

	// Debugging log
	console.log("Visible Projects:", visibleProjects);

	return (
		<ErrorBoundary>
			<Container size="lg" mt="120" mb="120">
				<Flex justify="space-between" align="center" mb="xl">
					<Title order={1}>Projects</Title>
					{user?.role === ROLES.ADMIN && (
						<Link to="/projects/add">
							<Button variant="light" radius="xl">
								New Project
							</Button>
						</Link>
					)}
				</Flex>

				<Paper shadow="md" p="xl" withBorder radius="lg">
					{isLoading ? (
						<Center py="lg">
							<Loader />
						</Center>
					) : error ? (
						<Center py="lg">
							<Title order={4} c="red">
								Error loading projects: {error.message || "Unknown error"}
							</Title>
						</Center>
					) : visibleProjects.length === 0 ? (
						<Center py="lg">
							<Title order={4}>No projects available</Title>
						</Center>
					) : (
						<Table.ScrollContainer minWidth={800}>
							<Table striped highlightOnHover withColumnBorders>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Project Name</Table.Th>
										<Table.Th>Description</Table.Th>
										<Table.Th>Actions</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{visibleProjects.map((p) => {
										// Fallback for projectIds if undefined
										const projectId =
											Array.isArray(p.projectIds) && p.projectIds.length > 0
												? p.projectIds[0]
												: p.id ||
													`project-${Math.random().toString(36).substr(2, 9)}`;
										return (
											<Table.Tr key={projectId}>
												<Table.Td>{p.projectName}</Table.Td>
												<Table.Td>{p.description}</Table.Td>
												<Table.Td>
													<Link to={`/projects/${projectId}`}>View</Link>
												</Table.Td>
											</Table.Tr>
										);
									})}
								</Table.Tbody>
							</Table>
						</Table.ScrollContainer>
					)}
				</Paper>
			</Container>
		</ErrorBoundary>
	);
}
