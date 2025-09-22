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
import { showNotification } from "@mantine/notifications";
import { useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";
import { ROLES } from "../../../core/permissions.js";
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
	const { projectId } = useParams();
	const { totalProjects, isLoading, error } = useData();
	const { deleteItem } = useEntity("tasks"); // For deletion, assuming tasks endpoint
	const { user } = useAuth();
	const [state, dispatch] = useReducer(reducer, {
		editMode: false,
		selectedTasks: new Set(),
		filterStatus: null,
	});

	// Determine visible projects based on user role
	const visibleProjects =
		user?.role === ROLES.ADMIN
			? totalProjects
			: user?.projects && user.projects.length > 0
				? totalProjects.filter((p) =>
						user.projects.some((projId) => p.projectIds.includes(projId)),
					)
				: [];

	// Find the project matching the projectId in visible projects or totalProjects as fallback
	const project =
		visibleProjects.find((p) => p.projectIds?.includes(projectId)) ||
		totalProjects.find((p) => p.projectIds?.includes(projectId));

	// Get all tasks for the project
	let tasks = project?.tasks || [];

	// For non-admins, filter tasks to only those assigned to the user
	if (user?.role !== ROLES.ADMIN) {
		tasks = tasks.filter((t) => t.employeeId === user.id);
	}

	useEffect(() => {
		if (!user || user.role !== ROLES.ADMIN) {
			dispatch({ type: "TOGGLE_EDIT" }); // Disable edit mode for non-admins
		}
	}, [user]);

	const handleCheckboxChange = (id, checked) => {
		dispatch({
			type: checked ? "SELECT_TASK" : "DESELECT_TASK",
			taskId: id,
		});
	};

	const handleDelete = async () => {
		try {
			for (const id of state.selectedTasks) {
				await deleteItem(id);
			}
			showNotification({
				title: "Success",
				message: "Tasks deleted successfully",
				color: "green",
			});
			dispatch({ type: "CLEAR_SELECTIONS" });
		} catch (error) {
			console.error("Failed to delete tasks:", error);
			showNotification({
				title: "Error",
				message: "Failed to delete tasks. Please try again.",
				color: "red",
			});
		}
	};

	const handleSave = () => {
		dispatch({ type: "TOGGLE_EDIT" });
	};

	const filteredTasks =
		state.filterStatus && tasks?.length > 0
			? tasks.filter((t) => t.status === state.filterStatus)
			: tasks;

	if (isLoading) {
		return (
			<Center py="lg">
				<Loader />
			</Center>
		);
	}

	if (error) {
		return (
			<Center py="lg">
				<Title order={4} c="red">
					Error loading tasks: {error.message || "Unknown error"}
				</Title>
			</Center>
		);
	}

	if (!project) {
		return (
			<Center py="lg">
				<Title order={4}>Project not found</Title>
			</Center>
		);
	}

	return (
		<Container size="lg" mt="xl">
			<Stack spacing="lg">
				<Flex justify="space-between" align="center">
					<Stack spacing={4}>
						<Title order={2}>Project: {project.projectName}</Title>
						<Text c="dimmed" size="sm">
							{project.description}
						</Text>
					</Stack>

					<Group>
						{!state.editMode && user?.role === ROLES.ADMIN && (
							<Button
								variant="default"
								color="blue"
								onClick={() => dispatch({ type: "TOGGLE_EDIT" })}
							>
								Edit Tasks
							</Button>
						)}

						<Link to={`/projects/${projectId}/tasks/add`}>
							<Button variant="default">Add Task</Button>
						</Link>
					</Group>
				</Flex>

				<Title order={4}>Assigned Employees</Title>
				<AvatarGroup spacing="sm">
					{project.employeeIds?.length > 0 ? (
						project.employeeIds.map((empId) => (
							<Avatar
								key={empId}
								src={`https://randomuser.me/api/portraits/${empId % 2 === 0 ? "women" : "men"}/${empId}.jpg`}
								radius="xl"
								alt={`Employee ${empId}`}
							/>
						))
					) : (
						<Avatar
							src="https://randomuser.me/api/portraits/men/32.jpg"
							radius="xl"
						/>
					)}
				</AvatarGroup>

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
											<Table.Td>{t.task || "N/A"}</Table.Td>
											<Table.Td>{t.assignee || "Unassigned"}</Table.Td>
											<Table.Td>{t.priority ?? "—"}</Table.Td>
											<Table.Td>
												{t.dueDate
													? new Date(t.dueDate).toLocaleDateString()
													: "—"}
											</Table.Td>
											<Table.Td>
												<Button variant="default" size="xs">
													{t.status || "Not Started"}
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
				</Paper>

				<Flex justify="space-between" align="center" mt="xl" mb="xl">
					<Link to={`/projects/${projectId}/tasks/add`}>
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
			</Stack>
		</Container>
	);
}
