import { Container, Grid, Paper, Text, Title } from "@mantine/core";
import { useEntity } from "../../../hooks/useEntity.js";

export default function Dashboard() {
	const { data: employees, isLoading: isEmployeesLoading } =
		useEntity("employees");
	const { data: projects, isLoading: isProjectsLoading } =
		useEntity("projects");

	return (
		<Container size="lg" py="xl" mt="lg">
			<Grid gutter="lg" mb="xl">
				<Grid.Col span={6}>
					<Paper
						withBorder
						shadow="md"
						radius="lg"
						p="xl"
						style={{ minHeight: 120 }}
					>
						<Text size="sm" c="dimmed">
							Total Projects
						</Text>
						<Title order={3}>
							{isProjectsLoading ? "Loading..." : (projects?.length ?? 0)}
						</Title>
					</Paper>
				</Grid.Col>

				<Grid.Col span={6}>
					<Paper
						withBorder
						shadow="md"
						radius="lg"
						p="xl"
						style={{ minHeight: 120 }}
					>
						<Text size="sm" c="dimmed">
							Total Employees
						</Text>
						<Title order={3}>
							{isEmployeesLoading ? "Loading..." : (employees?.length ?? 0)}
						</Title>
					</Paper>
				</Grid.Col>
			</Grid>
		</Container>
	);
}
