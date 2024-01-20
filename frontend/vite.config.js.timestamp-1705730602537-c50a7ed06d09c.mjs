// vite.config.js
import { defineConfig } from "file:///C:/YOLO/node_modules/.pnpm/vite@5.0.12_@types+node@20.11.5/node_modules/vite/dist/node/index.js";
import react from "file:///C:/YOLO/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.0.12/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
	plugins: [react()],
	server: {
		port: 3e3,
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
	}
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxZT0xPXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxZT0xPXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9ZT0xPL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuXHRwbHVnaW5zOiBbcmVhY3QoKV0sXHJcblx0c2VydmVyOiB7XHJcblx0XHRwb3J0OiAzMDAwLFxyXG5cdFx0cHJveHk6IHtcclxuXHRcdFx0XCIvYXBpMVwiOiB7XHJcblx0XHRcdFx0dGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NzEwMFwiLFxyXG5cdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcIi9hcGkyXCI6IHtcclxuXHRcdFx0XHR0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo3MDAwXCIsXHJcblx0XHRcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdFwiL2FwaTNcIjoge1xyXG5cdFx0XHRcdHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIixcclxuXHRcdFx0XHRjaGFuZ2VPcmlnaW46IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0XCIvYXBpNFwiOiB7XHJcblx0XHRcdFx0dGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6OTAwMFwiLFxyXG5cdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcIi9hcGk1XCI6IHtcclxuXHRcdFx0XHR0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo3MzAwXCIsXHJcblx0XHRcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdPLFNBQVMsb0JBQW9CO0FBQ3JRLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ04sU0FBUztBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNmO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDZjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNmO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
