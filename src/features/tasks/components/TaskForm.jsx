"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";
import { ROLES } from "../../../core/permissions.js";
import { useEntity } from "../../../hooks/useEntity.js";
import { useAuth } from "../../auth/context/AuthContext.jsx";

// Options
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

// Error Boundary
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
						Error rendering task form: {this.state.error?.message || "Unknown"}
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
	const { employees, projects, tasks, totalProjects } = useData();

	const visibleProjects =
		user?.role === ROLES.ADMIN
			? totalProjects
			: totalProjects.filter((p) => {
					const userProjectIds = Array.isArray(user?.projects)
						? user.projects
						: [];
					const isInAssignedProjects = p.projectIds?.some((id) =>
						userProjectIds.includes(id),
					);
					const hasAssignedTasks = Array.isArray(p.tasks)
						? p.tasks.some((t) => t.assignee === user?.id)
						: false;
					return isInAssignedProjects || hasAssignedTasks;
				});

	// Local state for project options
	const [projectOptions, setProjectOptions] = useState([]);

	// Build project options after projects and user are loaded
	useEffect(() => {
		if (!projects || !user) return;

		let availableProjects = [];

		if (user.role === ROLES.ADMIN) {
			// Admins see all projects
			availableProjects = projects;
		} else {
			// Users see projects they're assigned to OR have tasks in
			const userProjectIds = Array.isArray(user.projects) ? user.projects : [];

			// Get projects where user has tasks assigned
			const projectsWithUserTasks = (tasks || [])
				.filter((task) => task.assignee === user.id)
				.map((task) => task.projectId)
				.filter(Boolean);

			// Combine explicitly assigned projects with projects where user has tasks
			const allRelevantProjectIds = [
				...new Set([...userProjectIds, ...projectsWithUserTasks]),
			];

			availableProjects = projects.filter((p) =>
				allRelevantProjectIds.includes(p.id),
			);
		}

		const options = availableProjects.map((p) => ({
			value: p.id,
			label: p.projectName,
		}));

		setProjectOptions(options);
	}, [projects, user, tasks]);

	// Build assignee options
	const assigneeOptions = (employees || []).map((emp) => ({
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
			assignee: user?.id || "",
			status: "not started",
			priority: "medium",
			dueDate: null,
			projectId: projectId || "",
		},
	});

	const onSubmit = (data) => {
		if (!data.projectId && !projectId) {
			showNotification({
				title: "Project required",
				message: "Please select a project to add a task.",
				color: "red",
			});
			return;
		}

		const selectedProjectId = data.projectId || projectId;

		addItem(
			{ ...data, projectId: selectedProjectId },
			{
				onSuccess: () => {
					reset();
					navigate(`/projects/${selectedProjectId}`);
				},
				onError: (error) => {
					console.error("Failed to add task:", error);
					showNotification({
						title: "Error",
						message: "Failed to add task. Please try again.",
						color: "red",
					});
				},
			},
		);
	};

	return (
		<ErrorBoundary>
			<Box mt="50" ml="100">
				<Container size="sm">
					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack spacing="lg" maw={500} w="100%">
							<Title order={2} ta="center">
								Add New Task
							</Title>

							{/* Project Select */}
							<Controller
								name="projectId"
								control={control}
								rules={{ required: !projectId ? "Project is required" : false }}
								render={({ field }) => (
									<Select
										label="Project"
										placeholder="Select project"
										data={projectOptions}
										value={field.value || ""}
										onChange={field.onChange}
										disabled={user.role !== ROLES.ADMIN && !!projectId}
										error={errors.projectId?.message}
									/>
								)}
							/>

							{/* Assignee */}
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
										disabled={user.role !== ROLES.ADMIN}
									/>
								)}
							/>

							{/* Task Name */}
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

							{/* Status */}
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

							{/* Priority */}
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

							{/* Due Date */}
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

							{/* Buttons */}
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
