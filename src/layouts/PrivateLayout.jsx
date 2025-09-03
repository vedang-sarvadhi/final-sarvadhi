import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";

export default function PrivateLayout() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}
