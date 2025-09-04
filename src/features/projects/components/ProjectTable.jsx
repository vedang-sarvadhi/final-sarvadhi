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
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";
import { useAuth } from "../../auth/context/AuthContext.jsx";

export default function ProjectTable() {
	const { isLoading } = useData();
	const { user, employees } = useAuth();

const projectMap = useMemo(() => {
  const map = new Map();

  employees.forEach((emp) => {
    emp.projects?.forEach((proj) => {
      if (!map.has(proj.id)) {
        // first time seeing this project → create it
        map.set(proj.id, {
          ...proj,
          tasks: [], // ensure tasks array is fresh
          owners: new Set() // track multiple owners
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
      { ...proj, owners: [...proj.owners] }
    ])
  );
}, [employees]);

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
											<Link to={`/projects/${p.id}`}>View</Link>
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
