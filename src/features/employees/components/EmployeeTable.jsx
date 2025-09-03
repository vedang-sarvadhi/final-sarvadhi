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

export default function EmployeesTable() {
	const { isLoading } = useData();
  const { user } = useAuth();

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
									<Table.Tr key={user.id}>
										<Table.Td>{user.name}</Table.Td>
										<Table.Td>{user.email}</Table.Td>
										<Table.Td>{user.department}</Table.Td>
										<Table.Td>{user.role}</Table.Td>
									</Table.Tr>
							</Table.Tbody>
						</Table>
					</Table.ScrollContainer>
				)}
			</Paper>
		</Container>
	);
}
