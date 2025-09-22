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
import { useEntity } from "../../../hooks/useEntity.js";
export default function EmployeesTable() {
	const { data: employees, isLoading } = useEntity("employees");

	return (
		<Container size="lg" mt="xl">
			<Flex justify="space-between" align="center" mb="xl">
				<Title order={1}>Employees</Title>
				<Link to="/employee">
					<Button variant="light" radius="lg">
						Add New Employee
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
									<Table.Th>Name</Table.Th>
									<Table.Th>Email</Table.Th>
									<Table.Th>Department</Table.Th>
									<Table.Th>Role</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{employees.map((p) => (
									<Table.Tr key={p.id}>
										<Table.Td>{p.name}</Table.Td>
										<Table.Td>{p.email}</Table.Td>
										<Table.Td>{p.department}</Table.Td>
										<Table.Td>{p.role}</Table.Td>
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
