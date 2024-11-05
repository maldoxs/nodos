import { createApp } from "vue";
import App from "./App.vue";
import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";

// Importa primero el CSS de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// Luego importa tus personalizaciones para que sobrescriban el CSS de Bootstrap
import "./assets/custom-bootstrap.scss";

// Importa el JavaScript de Bootstrap (si necesitas componentes de Bootstrap que requieren JS)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const app = createApp(App);
app.use(VNetworkGraph); // Registra el plugin del gráfico de red
app.mount("#app"); // Monta la aplicación en el elemento con ID 'app'
