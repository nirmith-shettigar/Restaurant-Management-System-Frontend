import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { provide } from "vue";

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: "jsdom",

        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            reportsDirectory: "./coverage",
        }
    }
});