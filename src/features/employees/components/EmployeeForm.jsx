import {
	Box,
	Button,
	Container,
	Flex,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEntity } from "../../../hooks/useEntity.js";

export default function EmployeeForm() {
	const navigate = useNavigate();
	const { addItem } = useEntity("employees");

	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			department: "",
			role: "",
		},
	});

	const onSubmit = (data) => {
		addItem(data, {
			onSuccess: () => {
				reset();
				navigate("/dashboard");
			},
			onError: (error) => {
				console.error("Failed to add employee:", error);
			},
		});
	};

	return (
		<Container size="xl" py="xl">
			<Box maw={500} mx="auto" mt="100">
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing="lg">
						<Title order={1}>Add New Employee</Title>

						<Controller
							name="name"
							control={control}
							rules={{ required: "Name is required" }}
							render={({ field, fieldState }) => (
								<TextInput
									label="Name"
									placeholder="Enter employee's full name"
									radius="md"
									{...field}
									error={fieldState.error?.message}
								/>
							)}
						/>

						<Controller
							name="email"
							control={control}
							rules={{
								required: "Email is required",
								pattern: {
									value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
									message: "Enter a valid email address",
								},
							}}
							render={({ field, fieldState }) => (
								<TextInput
									label="Email"
									placeholder="Enter employee's email address"
									radius="md"
									{...field}
									error={fieldState.error?.message}
								/>
							)}
						/>

						<Controller
							name="password"
							control={control}
							rules={{
								required: "Password is required",
							}}
							render={({ field, fieldState }) => (
								<TextInput
									label="password"
									placeholder="Enter employee's email address"
									radius="md"
									{...field}
									error={fieldState.error?.message}
								/>
							)}
						/>

						<Controller
							name="department"
							control={control}
							rules={{ required: "Department is required" }}
							render={({ field, fieldState }) => (
								<TextInput
									label="Department"
									placeholder="Enter employee's department"
									radius="md"
									{...field}
									error={fieldState.error?.message}
								/>
							)}
						/>

						<Controller
							name="role"
							control={control}
							rules={{ required: "Role is required" }}
							render={({ field, fieldState }) => (
								<TextInput
									label="Role"
									placeholder="Enter employee's role"
									radius="md"
									{...field}
									error={fieldState.error?.message}
								/>
							)}
						/>

						<Flex justify="flex-end" gap="sm" mt="md">
							<Button variant="default" onClick={() => reset()} type="button">
								Cancel
							</Button>
							<Button type="submit">Add Employee</Button>
						</Flex>
					</Stack>
				</form>
			</Box>
		</Container>
	);
}
