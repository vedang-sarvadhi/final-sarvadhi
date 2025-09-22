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
import { showNotification } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ROLES } from "../../../core/permissions.js";
import { useEntity } from "../../../hooks/useEntity.js";
import { useAuth } from "../../auth/context/AuthContext.jsx";

export default function CreateProjectForm() {
	const { addItem } = useEntity("projects");
	const navigate = useNavigate();
	const { user } = useAuth();

	// Check if user is authorized (only admins can create projects)
	if (user?.role !== ROLES.ADMIN) {
		console.error("Unauthorized access to create project");
		navigate("/unauthorized");
		return null;
	}

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			projectName: "",
			description: "",
			tasks: "",
		},
	});

	const onSubmit = async (data) => {
		try {
			const formattedData = {
				projectName: data.projectName,
				description: data.description,
				tasks: data.tasks
					.split("\n")
					.filter((task) => task.trim())
					.map((taskName) => ({
						taskName: taskName.trim(),
						completed: false,
					})),
			};

			await addItem(formattedData);
			showNotification({
				title: "Success",
				message: "Project created successfully",
				color: "green",
			});
			reset();
			navigate("/projects"); // Navigate to a general projects list page
		} catch (error) {
			console.error("Failed to add project:", error);
			showNotification({
				title: "Error",
				message: "Failed to create project. Please try again.",
				color: "red",
			});
		}
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
							<Link to="/projects">
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
