import {
	Avatar,
	AvatarGroup,
	Button,
	Center,
	Checkbox,
	Container,
	Flex,
	Group,
	Loader,
	Paper,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { useEntity } from "../../../hooks/useEntity.js";
import { useAuth } from "../../auth/context/AuthContext.jsx";

function reducer(state, action) {
	switch (action.type) {
		case "TOGGLE_EDIT":
			return { ...state, editMode: !state.editMode, selectedTasks: new Set() };
		case "SELECT_TASK":
			return {
				...state,
				selectedTasks: new Set([...state.selectedTasks, action.taskId]),
			};
		case "DESELECT_TASK": {
			const newSet = new Set(state.selectedTasks);
			newSet.delete(action.taskId);
			return { ...state, selectedTasks: newSet };
		}
		case "CLEAR_SELECTIONS":
			return { ...state, selectedTasks: new Set() };
		case "SET_FILTER":
			return { ...state, filterStatus: action.status };
		default:
			return state;
	}
}

export default function TaskTable() {
	const { loading, deleteItem } = useEntity("employees");
	const { user } = useAuth();
	const { projectId } = useParams();

	const projects = user?.projects ?? [];
	const allProjects = new Map(projects.map((p) => [p.id, p]));
	const mainProject = allProjects.get(projectId);
	const tasks = mainProject?.tasks ?? [];

	const [state, dispatch] = useReducer(reducer, {
		editMode: false,
		selectedTasks: new Set(),
		filterStatus: null,
	});

	const handleCheckboxChange = (id, checked) => {
		dispatch({
			type: checked ? "SELECT_TASK" : "DESELECT_TASK",
			taskId: id,
		});
	};

	const handleDelete = async () => {
		for (const id of state.selectedTasks) {
			await deleteItem(id);
		}
		dispatch({ type: "CLEAR_SELECTIONS" });
	};

	const handleSave = () => {
		dispatch({ type: "TOGGLE_EDIT" });
	};

	const filteredTasks =
		state.filterStatus && tasks.length > 0
			? tasks.filter((t) => t.status === state.filterStatus)
			: tasks;

	return (
		<Container size="lg" mt="xl">
			<Stack spacing="lg">
				<Flex justify="space-between" align="center">
					<Stack spacing={4}>
						<Title order={2}>
							Project: {mainProject?.projectName ?? "N/A"}
						</Title>
						<Text c="dimmed" size="sm">
							{mainProject?.description ?? ""}
						</Text>
					</Stack>

					<Group>
						{!state.editMode && (
							<Button
								variant="default"
								color="blue"
								onClick={() => dispatch({ type: "TOGGLE_EDIT" })}
							>
								Edit Tasks
							</Button>
						)}

						<Link to="/task">
							<Button variant="default">Add Task</Button>
						</Link>
					</Group>
				</Flex>

				<Title order={4}>Assigned Employees</Title>
				<AvatarGroup spacing="sm">
					<Avatar
						src="https://randomuser.me/api/portraits/men/32.jpg"
						radius="xl"
					/>
					<Avatar
						src="https://randomuser.me/api/portraits/women/44.jpg"
						radius="xl"
					/>
					<Avatar
						src="https://randomuser.me/api/portraits/men/12.jpg"
						radius="xl"
					/>
					<Avatar
						src="https://randomuser.me/api/portraits/men/56.jpg"
						radius="xl"
					/>
					<Avatar
						src="https://randomuser.me/api/portraits/women/21.jpg"
						radius="xl"
					/>
				</AvatarGroup>
				<AvatarGroup spacing="sm">
					{mainProject?.assignedEmployees?.map((e) => (
						<Avatar key={e.id} src={e.avatarUrl} radius="xl" />
					))}
				</AvatarGroup>
			</Stack>

			<Flex justify="space-between" align="center" mb="xl" mt="xl">
				<Title order={1}>Tasks</Title>

				{!state.editMode && (
					<Group>
						<Button
							variant="default"
							onClick={() => dispatch({ type: "SET_FILTER", status: null })}
						>
							All
						</Button>
						<Button
							variant="default"
							onClick={() =>
								dispatch({ type: "SET_FILTER", status: "Not Started" })
							}
						>
							Not Started
						</Button>
						<Button
							variant="default"
							onClick={() =>
								dispatch({ type: "SET_FILTER", status: "In Progress" })
							}
						>
							In Progress
						</Button>
						<Button
							variant="default"
							onClick={() =>
								dispatch({ type: "SET_FILTER", status: "Completed" })
							}
						>
							Completed
						</Button>
					</Group>
				)}
			</Flex>

			<Paper shadow="md" p="xl" pb="md" withBorder radius="lg">
				{loading ? (
					<Center py="lg">
						<Loader />
					</Center>
				) : (
					<Table.ScrollContainer minWidth={800}>
						<Table
							striped
							highlightOnHover
							withColumnBorders
							verticalSpacing="md"
							horizontalSpacing="lg"
						>
							<Table.Thead>
								<Table.Tr>
									{state.editMode && <Table.Th></Table.Th>}
									<Table.Th>Task</Table.Th>
									<Table.Th>Assignee</Table.Th>
									<Table.Th>Priority</Table.Th>
									<Table.Th>Due Date</Table.Th>
									<Table.Th>Status</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{filteredTasks.length > 0 ? (
									filteredTasks.map((t) => (
										<Table.Tr key={t.id}>
											{state.editMode && (
												<Table.Td>
													<Checkbox
														checked={state.selectedTasks.has(t.id)}
														onChange={(e) =>
															handleCheckboxChange(
																t.id,
																e.currentTarget.checked,
															)
														}
													/>
												</Table.Td>
											)}
											<Table.Td>{t.task}</Table.Td>
											<Table.Td>{t.assignee}</Table.Td>
											<Table.Td>{t.priority ?? "—"}</Table.Td>
											<Table.Td>
												{t.dueDate
													? new Date(t.dueDate).toLocaleDateString()
													: "—"}
											</Table.Td>
											<Table.Td>
												<Button variant="default" size="xs">
													{t.status}
												</Button>
											</Table.Td>
										</Table.Tr>
									))
								) : (
									<Table.Tr>
										<Table.Td
											colSpan={state.editMode ? 6 : 5}
											style={{ textAlign: "center" }}
										>
											No tasks available
										</Table.Td>
									</Table.Tr>
								)}
							</Table.Tbody>
						</Table>
					</Table.ScrollContainer>
				)}
			</Paper>

			<Flex justify="space-between" align="center" mt="xl">
				<Link to="/task">
					<Button variant="default">Add Task</Button>
				</Link>

				{state.editMode && (
					<Flex justify="flex-end" align="center" mt="x">
						<Group>
							<Button
								variant="default"
								color="gray"
								radius="md"
								disabled={state.selectedTasks.size === 0}
								onClick={handleDelete}
							>
								Delete Tasks
							</Button>
							<Button radius="md" onClick={handleSave}>
								Save Changes
							</Button>
						</Group>
					</Flex>
				)}
			</Flex>
		</Container>
	);
}
