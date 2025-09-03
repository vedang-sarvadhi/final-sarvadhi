"use client";
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
import "@mantine/core/styles.css";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEntity } from "../../../hooks/useEntity.js";

const assigneeOptions = [
	{ value: "john", label: "John Doe" },
	{ value: "jane", label: "Jane Smith" },
	{ value: "michael", label: "Michael Johnson" },
];

const projectOptions = [
	{ value: "john", label: "John Doe" },
	{ value: "jane", label: "Jane Smith" },
	{ value: "michael", label: "Michael Johnson" },
];
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

export default function TaskForm() {
	const navigate = useNavigate();
	const { addItem } = useEntity("employees");

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			task: "",
			assignee: "",
			status: "",
			priority: "",
			dueDate: null,
		},
	});

	const onSubmit = (data) => {
		addItem(data, {
			onSuccess: () => {
				reset();
				navigate("/projects/details");
			},
			onError: (error) => {
				console.error("Failed to add task:", error);
			},
		});
	};

	return (
		<Box mt="50" ml="100">
			<Container size="sm">
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing="lg" maw={500} w="100%">
						<Title order={2} ta="center">
							Add New Task
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
								/>
							)}
						/>

						<Controller
							name="projects"
							control={control}
							rules={{ required: "Project name is required" }}
							render={({ field }) => (
								<Select
									label="Project Name"
									placeholder="Enter project name"
									data={projectOptions}
									{...field}
									error={errors.task?.message}
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
							<Link to="/projects/details">
								<Button variant="default">Cancel</Button>
							</Link>
							<Button type="submit">Submit</Button>
						</Flex>
					</Stack>
				</form>
			</Container>
		</Box>
	);
}
