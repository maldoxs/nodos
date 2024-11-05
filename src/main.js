import { createApp } from "vue";
import App from "./App.vue";
import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";

import "bootstrap/dist/css/bootstrap.min.css";
// Importa el JavaScript de Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const app = createApp(App);
app.use(VNetworkGraph); // Registra el plugin del gráfico de red
app.mount("#app"); // Monta la aplicación en el elemento con ID 'app'
