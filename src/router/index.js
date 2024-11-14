import { createRouter, createWebHistory } from "vue-router";

console.log(import.meta.env.VITE_APP_CTX); // Verifica que la variable de entorno se carga correctamente

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/HomeView.vue"), // Carga diferida del componente HomeView
    },
    {
        path: "/about",
        name: "about",
        component: () => import("../views/AboutView.vue"), // Carga diferida del componente AboutView
    },
];

const baseURL = "/graficos-intra/"; // Usa la URL de base manualmente

const router = createRouter({
    history: createWebHistory(baseURL),
    routes,
});

export default router;
