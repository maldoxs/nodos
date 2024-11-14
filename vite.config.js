import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    base: process.env.VITE_APP_CTX || "/", // Si no está definida la variable, usar '/'
    server: {
        port: 3000, // Cambia el puerto a otro que esté libre
        https: false, // O desactiva HTTPS
    },
});
