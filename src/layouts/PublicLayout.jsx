import { Container, Flex, Group } from "@mantine/core";
import Login from "../features/auth/components/Login.jsx";

export default function PublicLayout() {
	return (
		<div>
			<div style={{ borderBottom: "1px solid #eaeaea", background: "white" }}>
				<Container size="xl">
					<Flex justify="space-between" align="center" py="sm">
						<Group>
							<img src="/36.svg" alt="Sarvadhi" style={{ height: 40 }} />
							<img src="/47.svg" alt="Sarvadhi" style={{ height: 40 }} />
						</Group>
					</Flex>
				</Container>
			</div>
			<Login />
		</div>
	);
}
