import { Button, Container, Group, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
	const navigate = useNavigate();

	return (
		<Container
			size="sm"
			mt="400"
			style={{
				textAlign: "center",
				marginTop: "10vh",
			}}
		>
			<Title order={1} mb="md">
				404
			</Title>

			<Text size="xl" c="dimmed" mb="lg">
				Oops! The page you are looking for does not exist.
			</Text>

			<Group position="center">
				<Button
					variant="filled"
					color="blue"
					ml="290"
					onClick={() => navigate("/")}
				>
					Go Home
				</Button>
			</Group>
		</Container>
	);
}
