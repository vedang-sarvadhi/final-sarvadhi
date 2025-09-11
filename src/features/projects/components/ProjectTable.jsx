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
import { Link } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";
import { useAuth } from "../../auth/context/AuthContext.jsx";

export default function ProjectTable() {
	const { isLoading } = useData();
	const { user, projectMap } = useAuth();

	console.log(user);

	// Decide which projects to show (admin = all, employee = only theirs)
	const visibleProjects =
		user.role === "admin"
			? Array.from(projectMap.values())
			: user.projects || [];

	console.log("🔎 projectMap", projectMap);
	console.log("👀 visibleProjects", visibleProjects);

	return (
		<Container size="lg" mt="120" mb="120">
			<Flex justify="space-between" align="center" mb="xl">
				<Title order={1}>Projects</Title>
				<Link to="/projects/add">
					<Button variant="light" radius="xl">
						New Project
					</Button>
				</Link>
			</Flex>

			<Paper shadow="md" p="xl" withBorder radius="lg">
				{isLoading ? (
					<Center py="lg">
						<Loader />
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
								{visibleProjects?.map((p) => (
									<Table.Tr key={p.id}>
										<Table.Td>{p.projectName}</Table.Td>
										<Table.Td>{p.description}</Table.Td>
										<Table.Td>
											<Link
												to={`/projects/${p.id}`}
												state={{ projects: visibleProjects }}
											>
												View
											</Link>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Table.ScrollContainer>
				)}
			</Paper>
		</Container>
	);
}
