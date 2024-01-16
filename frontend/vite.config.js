import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api1": {
				target: "http://apiyolo.sachinms.fyi/users",
				changeOrigin: true
			},
			"/api2": {
				target: "http://apiyolo.sachinms.fyi/posts",
				changeOrigin: true
			},
			"/api3": {
				target: "http://apiyolo.sachinms.fyi/messaging",
				changeOrigin: true
			},
			"/api4": {
				target: "http://apiyolo.sachinms.fyi/notification",
				changeOrigin: true
			},
			"/api5": {
				target: "http://apiyolo.sachinms.fyi/admin",
				changeOrigin: true
			}
		}
	}
});
