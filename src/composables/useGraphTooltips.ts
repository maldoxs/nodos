// Gestiona tooltips persistentes para nodos y aristas en el grafo.
// Centraliza la visibilidad, posición, contenido y métodos para mostrar/cerrar.

import { ref, watch } from "vue";
import { useGraphState } from "./useGraphState";

export function useGraphTooltips(graph, layouts) {
  // --- Node Tooltip ---
  const tooltip = ref<HTMLDivElement | null>(null);
  const tooltipData = ref<Record<string, any>>({});
  const tooltipOpacity = ref(0);
  const tooltipPos = ref({ left: "0px", top: "0px" });
  const targetNodeId = ref<string>("");

  // --- Edge Tooltip ---
  const edgeTooltip = ref<HTMLDivElement | null>(null);
  const edgeTooltipData = ref<Record<string, any>>({});
  const edgeTooltipOpacity = ref(0);
  const edgeTooltipPos = ref({ left: "0px", top: "0px" });
  const targetEdgeId = ref<string>("");

  // --- Cerrar Tooltips ---
  function closeTooltip(type: "node" | "edge") {
    if (type === "node") {
      tooltipOpacity.value = 0;
      targetNodeId.value = "";
    } else if (type === "edge") {
      edgeTooltipOpacity.value = 0;
      targetEdgeId.value = "";
    }
  }

  // --- Actualizar posición del tooltip de nodo cuando cambia el target ---
  watch(
    () => [targetNodeId.value, tooltipOpacity.value],
    () => {
      if (!graph.value || !tooltip.value || !targetNodeId.value) return;
      const nodeLayout = layouts.nodes[targetNodeId.value];
      if (nodeLayout) {
        const domPoint = graph.value.translateFromSvgToDomCoordinates(nodeLayout);
        tooltipPos.value = {
          left: `${domPoint.x - tooltip.value.offsetWidth / 2}px`,
          top: `${domPoint.y - tooltip.value.offsetHeight - 5}px`,
        };
      }
    }
  );

  // --- Mostrar tooltip de nodo ---
  function showNodeTooltip(nodeId, nodeData, nodeLayout) {
    if (!graph.value || !tooltip.value || !nodeId) return;
    const domPoint = graph.value.translateFromSvgToDomCoordinates(nodeLayout);
    tooltipData.value = {
      id: nodeId,
      name: nodeData.name || `Nodo sin nombre (${nodeId})`,
      x: nodeLayout.x.toFixed(2),
      y: nodeLayout.y.toFixed(2),
      data: nodeData.data,
    };
    tooltipPos.value = {
      left: `${domPoint.x - tooltip.value.offsetWidth / 2}px`,
      top: `${domPoint.y - tooltip.value.offsetHeight - 5}px`,
    };
    tooltipOpacity.value = 1;
    targetNodeId.value = nodeId;
  }

  // --- Mostrar tooltip de arista ---
  function showEdgeTooltip(edgeId, edgeData, sourcePos, targetPos, nodes) {
    if (!graph.value || !edgeTooltip.value || !edgeId) return;
    if (!sourcePos || !targetPos) return;
    const edgeCenter = {
      x: (sourcePos.x + targetPos.x) / 2,
      y: (sourcePos.y + targetPos.y) / 2,
    };
    const domPoint = graph.value.translateFromSvgToDomCoordinates(edgeCenter);
    edgeTooltipData.value = {
      id: edgeId,
      name: `Conexión entre ${nodes[edgeData.source].name} y ${nodes[edgeData.target].name}`,
      porcentajeParticipacion: edgeData.porcentajeParticipacion,
      porcentajeParticipacionUtilidades: edgeData.porcentajeParticipacionUtilidades,
    };
    edgeTooltipPos.value = {
      left: `${domPoint.x - edgeTooltip.value.offsetWidth / 2}px`,
      top: `${domPoint.y - edgeTooltip.value.offsetHeight - 5}px`,
    };
    edgeTooltipOpacity.value = 1;
    targetEdgeId.value = edgeId;
  }

  return {
    // node
    tooltip,
    tooltipData,
    tooltipOpacity,
    tooltipPos,
    targetNodeId,
    showNodeTooltip,
    // edge
    edgeTooltip,
    edgeTooltipData,
    edgeTooltipOpacity,
    edgeTooltipPos,
    targetEdgeId,
    showEdgeTooltip,
    // común
    closeTooltip,
  };
}
