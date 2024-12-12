import { createRouter, createWebHistory } from "vue-router";

//console.log(import.meta.env.VITE_APP_CTX); // Debería mostrar el valor definido en .env, e.g. "/taf-resoluciones-intra/"

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/ArmaNodoGraf.vue"),
    },
    {
        path: "/about",
        name: "about",
        component: () => import("../views/AboutView.vue"),
    },
];

// Usa la variable de entorno VITE_APP_CTX
const baseURL = import.meta.env.VITE_APP_CTX || "/";

const router = createRouter({
    history: createWebHistory(baseURL),
    routes,
});

export default router;
