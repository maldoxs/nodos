import { reactive, ref } from "vue";
import data from "../data";

export function useGraphState() {
  // --- Datos principales del grafo
  const nodes = reactive({ ...data.nodes });
  const edges = reactive({ ...data.edges });
  const layouts = reactive(data.layouts);

  // --- Índices para crear nuevos nodos/aristas
  const nextNodeIndex = ref(Object.keys(nodes).length + 1);
  const nextEdgeIndex = ref(Object.keys(edges).length + 1);

  // --- Selección actual
  const selectedNodes = ref<string[]>([]);
  const selectedEdges = ref<string[]>([]);

  // --- Otros estados útiles
  const newNodeName = ref<string>("");

  // --- Exponer el estado y métodos esenciales
  return {
    nodes,
    edges,
    layouts,
    nextNodeIndex,
    nextEdgeIndex,
    selectedNodes,
    selectedEdges,
    newNodeName
  };
}


/**
 * Composable useGraphState
 * ------------------------
 * Gestiona el estado reactivo principal del grafo: nodos, aristas (edges), layouts,
 * índices incrementales para crear nuevos elementos y selección de nodos/aristas.
 *
 * Provee un único punto de acceso y manipulación al core del grafo, asegurando reactividad
 * y facilitando la centralización de la lógica de estado.
 *
 * Este composable es la "fuente de la verdad" para cualquier operación de alto nivel
 * sobre el grafo en la aplicación.
 */
