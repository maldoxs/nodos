import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; // 👈 importa 'path' para usar en el alias

export default defineConfig({
    plugins: [vue()],
    base: process.env.VITE_APP_CTX || "/",
    server: {
        port: 3000,
        https: false,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"), // 👈 esto activa el uso de @
        },
    },
});
