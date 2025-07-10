import { reactive, computed } from "vue";
import * as vNG from "v-network-graph";
import { ForceLayout } from "v-network-graph/lib/force-layout";
import { useGraphState } from "./useGraphState";

// Composable de configuración visual y lógica de layout del grafo
export function useGraphConfigs() {
  const { layouts } = useGraphState();

  const configs = reactive(
    vNG.defineConfigs({
      view: {
        layoutHandler: new ForceLayout(),
        panEnabled: true,
        zoomEnabled: true,
        boxSelectionEnabled: false,
        selection: {
          box: {
            color: "#0000ff20",
            strokeWidth: 1,
            strokeColor: "#aaaaff",
            strokeDasharray: "0",
          },
        },
      },
      node: {
        normal: {
          type: "circle",
          radius: (node) => node.size,
          color: (node) => node.color,
        },
        hover: {
          radius: (node) => node.size + 2,
          color: (node) => node.color,
        },
        selectable: true,
        label: {
          visible: (node) => !!node.label,
          directionAutoAdjustment: true,
          fontSize: 15,
          color: "black",
          fontFamily: "Arial",
          direction: "south",
        },
        focusring: {
          color: "darkgray",
        },
      },
      edge: {
        normal: {
          width: 2,
          color: (edge) => edge.color,
          dasharray: (edge) => (edge.dashed ? "4" : "0"),
        },
        selectable: true,
        marker: {
          target: { type: "arrow" },
        },
        label: {
          fontSize: 40,
        },
      },
    })
  );

  // Permite alternar entre ForceLayout y SimpleLayout
  const d3ForceEnabled = computed({
    get: () => configs.view?.layoutHandler instanceof ForceLayout,
    set: (value: boolean) => {
      if (configs.view) {
        configs.view.layoutHandler = value ? new ForceLayout() : new vNG.SimpleLayout();
      }
    },
  });

  // Evento de mover nodo, actualiza layouts reactivos
  function onNodeMoved({ nodeId, x, y }) {
    layouts.nodes[nodeId] = { x, y };
  }

  return {
    configs,
    d3ForceEnabled,
    onNodeMoved,
  };
}


/**
 * Composable useGraphConfigs
 * --------------------------
 * Centraliza la configuración visual y lógica de layout del grafo v-network-graph.
 *
 * Define estilos, propiedades y layouts reactivos para nodos, aristas y la vista general,
 * y provee un "computed" para alternar dinámicamente entre ForceLayout (d3) y SimpleLayout.
 *
 * Incluye métodos como `onNodeMoved` para manejar el evento de movimiento de nodos,
 * asegurando que las posiciones se actualicen de forma reactiva en el layout.
 *
 * Permite desacoplar completamente la configuración visual/lógica del componente principal,
 * facilitando la mantenibilidad y futuras extensiones de la app.
 */
