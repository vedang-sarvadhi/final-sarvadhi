import { Container, Grid, Paper, Text, Title } from "@mantine/core";
import { useData } from "../../../context/DataContext.jsx";

export default function Dashboard() {
	const { totalProjects, employees, isLoading } = useData();

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
							{isLoading ? "Loading..." : totalProjects.length}
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
							{isLoading ? "Loading..." : employees.length}
						</Title>
					</Paper>
				</Grid.Col>
			</Grid>
		</Container>
	);
}
