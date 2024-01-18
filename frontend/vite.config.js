import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api1": {
				target: "http://localhost:7100",
				changeOrigin: true
			},
			"/api2": {
				target: "http://localhost:7000",
				changeOrigin: true
			},
			"/api3": {
				target: "http://localhost:8000",
				changeOrigin: true
			},
			"/api4": {
				target: "http://localhost:9000",
				changeOrigin: true
			},
			"/api5": {
				target: "http://localhost:7300",
				changeOrigin: true
			}
		}
	},
	preview: {
		port: 3000
	}
});
