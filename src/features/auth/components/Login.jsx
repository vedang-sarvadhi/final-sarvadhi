"use client";

import {
	Button,
	Container,
	Loader,
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../../core/permissions.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
	const { authenticateEmployee, isLoading } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	// Client-side validation
	const validateInputs = () => {
		let isValid = true;
		setEmailError("");
		setPasswordError("");

		if (!email.includes("@")) {
			setEmailError("Please enter a valid email address");
			isValid = false;
		}
		if (password.length < 6) {
			setPasswordError("Password must be at least 6 characters long");
			isValid = false;
		}
		return isValid;
	};

	async function handleLogin(e) {
		e.preventDefault();
		setError("");

		// Validate inputs before submitting
		if (!validateInputs()) {
			return;
		}

		const { user, error } = await authenticateEmployee(email, password);

		if (user) {
			setEmail("");
			setPassword("");
			if (user.role === ROLES.ADMIN) {
				navigate("/dashboard");
			} else if (user.role === ROLES.EMPLOYEE || user.role === "user") {
				// Treat "user" role as employee for compatibility
				navigate("/projects");
			} else {
				navigate("/unauthorized");
			}
		} else {
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
							error={emailError}
							disabled={isLoading}
						/>

						<PasswordInput
							label="Password"
							placeholder="Enter your password"
							required
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
							error={passwordError}
							disabled={isLoading}
						/>

						{error && (
							<Text c="red" size="sm">
								{error}
							</Text>
						)}

						<Button
							fullWidth
							mt="md"
							size="md"
							type="submit"
							disabled={isLoading}
							leftSection={isLoading ? <Loader size="sm" /> : null}
						>
							{isLoading ? "Logging in..." : "Log in"}
						</Button>
					</Stack>
				</form>
			</Paper>
		</Container>
	);
}
