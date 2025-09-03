"use client";

import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
	const { authenticateEmployee } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	async function handleLogin(e) {
		e.preventDefault();
		const { user, error } = await authenticateEmployee(email, password);

		if (user) {
			setError("");

			if (user.role === "admin") {
				navigate("/dashboard");
			} else if (user.role === "employee") {
				navigate("/projects");
			} else {
				navigate("/unauthorized");
			}
		} else {
			console.log("❌ Login failed:", error);
			setError(error || "❌ Invalid email or password");
		}
	}

	return (
		<Container size={420} mt={160}>
			<Title align="center" style={{ fontWeight: 700 }}>
				Welcome back
			</Title>
			<Text c="dimmed" size="sm" align="center" mt={5}>
				Admin and Employee login
			</Text>

			<Paper withBorder shadow="md" p="xl" radius="md" mt={30}>
				<form onSubmit={handleLogin}>
					<Stack>
						<TextInput
							label="Email"
							placeholder="Enter your email"
							required
							value={email}
							onChange={(e) => setEmail(e.currentTarget.value)}
						/>

						<PasswordInput
							label="Password"
							placeholder="Enter your password"
							required
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
						/>

						{error && (
							<Text c="red" size="sm">
								{error}
							</Text>
						)}

						<Button fullWidth mt="md" size="md" type="submit">
							Log in
						</Button>
					</Stack>
				</form>
			</Paper>
		</Container>
	);
}
