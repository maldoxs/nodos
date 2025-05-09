import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "tippy.js/dist/tippy.css"; // Importa los estilos de Tippy.js
import { plugin as TippyPlugin } from "vue-tippy";

// Importa Element Plus y los iconos
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; // Asegúrate de incluir los estilos de Element Plus

// Importa el plugin de gráficos en red
import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";

// Importa primero el CSS de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// Luego importa tus personalizaciones para que sobrescriban el CSS de Bootstrap
import "./assets/custom-bootstrap.scss";

// Importa el JavaScript de Bootstrap (si necesitas componentes de Bootstrap que requieren JS)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const app = createApp(App);

// Usa Element Plus y regístralo en la aplicación
app.use(ElementPlus); // Registra Element Plus

// Usa el plugin de gráficos en red
app.use(VNetworkGraph);

// Usa el router
app.use(router);

app.use(TippyPlugin);

// Monta la aplicación en el elemento con ID 'app'
app.mount("#app");
