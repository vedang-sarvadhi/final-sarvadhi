"use client";
import {
	Box,
	Button,
	Container,
	Flex,
	Stack,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEntity } from "../../../hooks/useEntity.js";

export default function CreateProjectForm({ employeeId }) {
	const { addItem } = useEntity(`employees/${employeeId}/projects`);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			projectName: "",
			description: "",
		},
	});

	const onSubmit = (data) => {
		const formattedData = {
			projectName: data.projectName,
			description: data.description,
			tasks: data.tasks.map((task) => ({
				taskName: task.taskName,
				completed: false,
			})),
		};

		addItem(formattedData, {
			onSuccess: () => {
				reset();
				navigate(`/employees/${employeeId}/projects`);
			},
			onError: (error) => {
				console.error("Failed to add project:", error);
			},
		});
	};

	return (
		<Container size="xl" py="xl">
			<Box maw={500} mx="auto" mt="100">
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing="lg">
						<Title order={2}>Create Project</Title>

						{/* Project Name */}
						<TextInput
							label="Project Name"
							placeholder="Enter Project Name"
							radius="md"
							{...register("projectName", {
								required: "Project name is required",
							})}
							error={errors.projectName?.message}
						/>

						{/* Description */}
						<Textarea
							label="Description"
							placeholder="Enter project details..."
							minRows={4}
							autosize
							{...register("description", {
								required: "Description is required",
							})}
							error={errors.description?.message}
						/>

						{/* Buttons */}
						<Flex justify="flex-end" gap="sm" mt="md">
							<Link to={`/employees/${employeeId}/projects`}>
								<Button variant="default">Cancel</Button>
							</Link>
							<Button type="submit">Create Project</Button>
						</Flex>
					</Stack>
				</form>
			</Box>
		</Container>
	);
}
