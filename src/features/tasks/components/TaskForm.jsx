import {
	Box,
	Button,
	Container,
	Flex,
	Select,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";
import { ROLES } from "../../../core/permissions.js";
import { useEntity } from "../../../hooks/useEntity.js";
import { useAuth } from "../../auth/context/AuthContext.jsx";

const statusOptions = [
	{ value: "not started", label: "Not Started" },
	{ value: "in-progress", label: "In Progress" },
	{ value: "completed", label: "Completed" },
];

const priorityOptions = [
	{ value: "low", label: "Low" },
	{ value: "medium", label: "Medium" },
	{ value: "high", label: "High" },
];

// Error Boundary Component
class ErrorBoundary extends React.Component {
	state = { hasError: false, error: null };

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				<Center py="lg">
					<Title order={4} c="red">
						Error rendering task form: {this.state.error.message}
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

export default function TaskForm() {
	const navigate = useNavigate();
	const { projectId } = useParams();
	const { addItem } = useEntity("tasks");
	const { user } = useAuth();
	const { employees, totalProjects } = useData(); // Added totalProjects to get project name

	// Find the project name based on projectId
	const project = totalProjects.find((p) => p.projectIds?.includes(projectId));
	const projectName = project ? project.projectName : "Unknown Project";

	// Dynamically generate assignee options from employees
	const assigneeOptions = employees.map((emp) => ({
		value: emp.id,
		label: emp.name,
	}));

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			task: "",
			assignee: user.id || "", // Preselect current user if non-admin
			status: "not started",
			priority: "medium",
			dueDate: null,
			projectId: projectId, // Auto-set projectId from URL
		},
	});

	const onSubmit = (data) => {
		addItem(data, {
			onSuccess: () => {
				reset();
				navigate(`/projects/${projectId}`);
			},
			onError: (error) => {
				console.error("Failed to add task:", error);
			},
		});
	};

	return (
		<ErrorBoundary>
			<Box mt="50" ml="100">
				<Container size="sm">
					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack spacing="lg" maw={500} w="100%">
							<Title order={2} ta="center">
								Add New Task for {projectName}
							</Title>

							<Controller
								name="assignee"
								control={control}
								rules={{ required: "Assignee is required" }}
								render={({ field }) => (
									<Select
										label="Assignee"
										placeholder="Select assignee"
										data={assigneeOptions}
										{...field}
										error={errors.assignee?.message}
										disabled={user.role !== ROLES.ADMIN} // Non-admins can only assign to themselves
									/>
								)}
							/>

							<Controller
								name="task"
								control={control}
								rules={{ required: "Task name is required" }}
								render={({ field }) => (
									<TextInput
										label="Task Name"
										placeholder="Enter task name"
										{...field}
										error={errors.task?.message}
									/>
								)}
							/>

							<Controller
								name="status"
								control={control}
								rules={{ required: "Status is required" }}
								render={({ field }) => (
									<Select
										label="Status"
										placeholder="Select status"
										data={statusOptions}
										{...field}
										error={errors.status?.message}
									/>
								)}
							/>

							<Controller
								name="priority"
								control={control}
								rules={{ required: "Priority is required" }}
								render={({ field }) => (
									<Select
										label="Priority"
										placeholder="Select priority"
										data={priorityOptions}
										{...field}
										error={errors.priority?.message}
									/>
								)}
							/>

							<Controller
								name="dueDate"
								control={control}
								rules={{ required: "Due date is required" }}
								render={({ field }) => (
									<DateInput
										label="Due Date"
										placeholder="Pick a date"
										clearable
										{...field}
										error={errors.dueDate?.message}
									/>
								)}
							/>

							<Flex justify="flex-end" gap="sm" mt="md">
								<Link to={`/projects/${projectId}`}>
									<Button variant="default">Cancel</Button>
								</Link>
								<Button type="submit">Submit</Button>
							</Flex>
						</Stack>
					</form>
				</Container>
			</Box>
		</ErrorBoundary>
	);
}
