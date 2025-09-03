import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import DataProvider from "../context/DataContext.jsx";
import AuthProvider from "../features/auth/context/AuthContext.jsx";
import { AppRoutes } from "./AppRoutes.jsx";

const queryClient = new QueryClient();

export function Providers({ children }) {
	return (
		<MantineProvider>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<DataProvider>
						<AuthProvider>
							<AppRoutes>{children}</AppRoutes>
						</AuthProvider>
					</DataProvider>
				</BrowserRouter>
			</QueryClientProvider>
		</MantineProvider>
	);
}
