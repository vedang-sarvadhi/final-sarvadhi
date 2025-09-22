// vite.config.js

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:5173",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	configureServer: ({ middlewares }) => {
		middlewares.use((req, res, next) => {
			if (req.url === "/api/employees") {
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify([{ id: 1, name: "John Doe" }]));
				return;
			}
			next();
		});
	},
});
