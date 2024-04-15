import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: { port: 1046 }, // 046 = オシロ
    base: "/tone-oscilloscope/",
});
