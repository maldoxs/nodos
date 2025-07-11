<script setup lang="ts">
    import { ref, reactive, onMounted, watch, watchEffect, nextTick } from "vue";
    import * as vNG from "v-network-graph";
    import { Tooltip } from "bootstrap";
    import Swal from "sweetalert2";
    import ExcelExportButton from "../components/ExcelExportButton.vue";

    // Composables de estado, config y tooltips
    import { useGraphState } from "../composables/useGraphState";
    import { useGraphConfigs } from "../composables/useGraphConfigs";
    import { useGraphTooltips } from "../composables/useGraphTooltips";
    import { useGraphCrud } from "../composables/useGraphCrud"; // ✅ Nuevo centralizado

    import NodeModal from "../components/NodeModal.vue";
    import EditNodeModal from "../components/EditNodeModal.vue";

    // --- Estados para edición de nodo (para el modal) ---
    const showEditNodeModal = ref(false);
    const editNodeData = reactive({
        nodeId: "",
        nombre: "",
        rut: "",
        tipo: "",
        capitalEnterado: 0,
        lineaNegocio: "",
    });

    // --- Graph refs y básicos ---
    const graph = ref<vNG.Instance | null>(null);
    const graphContainer = ref<HTMLDivElement | null>(null);
    const deleteBtn = ref<HTMLButtonElement | null>(null);
    const deleteEdgeBtn = ref<HTMLButtonElement | null>(null);
    const createEdgeBtn = ref<HTMLButtonElement | null>(null);
    const showAddNodeModal = ref(false);

    // --- Estados base del grafo (nodos, aristas, selección, etc.) ---
    const {
        nodes,
        edges,
        layouts,
        nextNodeIndex,
        nextEdgeIndex,
        selectedNodes,
        selectedEdges,
        newNodeName,
    } = useGraphState();

    const { configs, d3ForceEnabled, onNodeMoved } = useGraphConfigs();
    const {
        tooltip,
        tooltipData,
        tooltipOpacity,
        tooltipPos,
        targetNodeId,
        showNodeTooltip,
        edgeTooltip,
        edgeTooltipData,
        edgeTooltipOpacity,
        edgeTooltipPos,
        targetEdgeId,
        showEdgeTooltip,
        closeTooltip,
    } = useGraphTooltips(graph, layouts);

    // --- CRUD centralizado (importante: pasar referencias/reactives) ---
    const {
        addNode,
        openEditNodeModal,
        handleConfirmEditNode,
        removeNode,
        handleRemoveNode,
        addEdge,
        handleCreateEdge,
        removeEdge,
        handleRemoveEdge,
        updateNodeName,
        saveNodes,
        loadNodes,
    } = useGraphCrud({
        nodes,
        edges,
        layouts,
        nextNodeIndex,
        nextEdgeIndex,
        selectedNodes,
        selectedEdges,
        newNodeName,
        closeTooltip,
        showEditNodeModal,
        editNodeData,
    });

    // --- Modal creación de nodo ---
    function openAddNodeModal() {
        showAddNodeModal.value = true;
    }
    function handleConfirmAddNode(data) {
        addNode(data.nombre, data.rut, data.tipo, data.capitalEnterado, data.lineaNegocio);
        showAddNodeModal.value = false;
    }

    // --- Selección por caja y tooltips múltiples ---
    const isBoxSelectionMode = ref(false);
    const selectionTooltips = ref<Array<{ id: string; left: string; top: string; data: any }>>([]);
    const verticalGap = 8;

    function updateSelectionTooltips() {
        if (!graph.value) {
            selectionTooltips.value = [];
            return;
        }
        selectionTooltips.value = selectedNodes.value
            .map((id) => {
                const nodeData = nodes[id];
                const layout = layouts.nodes[id];
                if (!nodeData || !layout) return { id, data: {}, left: "0px", top: "0px" };
                const dom = graph.value!.translateFromSvgToDomCoordinates(layout);
                return {
                    id,
                    data: {
                        name: nodeData.name,
                        ...(nodeData.data ?? {}),
                        x: layout.x?.toFixed(2) ?? "",
                        y: layout.y?.toFixed(2) ?? "",
                    },
                    left: `${dom.x - 75}px`,
                    top: `${dom.y - 50 - verticalGap}px`,
                };
            })
            .filter((tip) => tip.id);
    }
    function startBoxSelection() {
        graph.value?.startBoxSelection({ stop: "manual" });
        isBoxSelectionMode.value = true;
        updateSelectionTooltips();
    }
    function stopBoxSelection() {
        graph.value?.stopBoxSelection();
        isBoxSelectionMode.value = false;
        selectionTooltips.value = [];
        selectedNodes.value = [];
        selectedEdges.value = [];
    }

    // --- Persistencia layouts ---
    watchEffect(() => {
        localStorage.setItem("layouts", JSON.stringify(layouts));
    });

    // --- Tooltips Bootstrap para botones ---
    onMounted(() => {
        nextTick(() => {
            document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
                const prev = Tooltip.getInstance(el);
                prev && prev.dispose();
                new Tooltip(el, {
                    placement: "right",
                    container: "#graph-container",
                    boundary: "clippingParents",
                });
            });
        });
    });

    // --- Cargar nodos/layouts al montar ---
    onMounted(() => {
        loadNodes();
        const savedLayouts = localStorage.getItem("layouts");
        if (savedLayouts) {
            const parsedLayouts = JSON.parse(savedLayouts);
            Object.assign(layouts.nodes, parsedLayouts.nodes);
        }
        nextTick(() => {
            graph.value?.fitToContents();
        });
    });

    // --- Watch tooltips selección múltiple ---
    watch(
        () => selectedNodes.value.slice(),
        () => {
            if (isBoxSelectionMode.value) updateSelectionTooltips();
        }
    );

    // --- Handlers de eventos del grafo ---
    const eventHandlers: vNG.EventHandlers = {
        "node:click": ({ node }) => {
            if (isBoxSelectionMode.value) return;
            closeTooltip("node");
            const nodeData = nodes[node];
            const nodeLayout = layouts.nodes[node];
            if (nodeData && nodeLayout) showNodeTooltip(node, nodeData, nodeLayout);
        },
        "edge:click": (event) => {
            if (isBoxSelectionMode.value) return;
            closeTooltip("edge");
            const edge = event.edge;
            if (!edge) return;
            const edgeData = edges[edge];
            if (edgeData) {
                const sourcePos = layouts.nodes[edgeData.source];
                const targetPos = layouts.nodes[edgeData.target];
                if (sourcePos && targetPos)
                    showEdgeTooltip(edge, edgeData, sourcePos, targetPos, nodes);
            }
        },
        "view:mode": (mode: string) => {
            if (mode === "box-selection") {
                isBoxSelectionMode.value = true;
                updateSelectionTooltips();
            }
        },
    };

    // --- Fullscreen toggle ---
    function toggleFullscreen() {
        document.querySelectorAll(".tooltip.show").forEach((t) => t.classList.remove("show"));
        if (!document.fullscreenElement) {
            graphContainer.value?.requestFullscreen();
        } else {
            document.exitFullscreen?.();
        }
    }

    // --- Selección reactiva de nodos (para box selection) ---
    function onSelectedNodesUpdate(newSelection: string[]) {
        if (isBoxSelectionMode.value && newSelection.length === 0) return;
        selectedNodes.value = newSelection;
        if (isBoxSelectionMode.value) updateSelectionTooltips();
    }

    // --- Exportar SVG ---
    async function downloadAsSvg() {
        if (!graph.value) return;
        try {
            const svgText = await graph.value.exportAsSvgText();
            const blob = new Blob([svgText], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "network-graph.svg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al exportar como SVG:", error);
        }
    }
</script>

<template>
    <div class="container">
        <!-- Panel de Acciones -->
        <div
            id="graph-container"
            class="network-graph-container bg-light rounded shadow-sm p-3"
            ref="graphContainer">
            <div class="d-flex justify-content-end flex-column align-items-end">
                <!-- Botón fullscreen -->
                <div
                    class="fullscreen-wrapper"
                    aria-label="Agrandar imagen"
                    role="button"
                    @click="toggleFullscreen">
                    <span class="fullscreen-text">Ver más grande</span>
                    <i
                        class="bi bi-arrows-fullscreen text-white"
                        style="font-size: 14px; cursor: pointer"></i>
                </div>
                <!-- D3-Force -->
                <div
                    class="fullscreen-wrapper mt-4 mt-smaller d-flex align-items-center justify-content-between"
                    aria-label="Ordenar Esquema"
                    role="button"
                    style="padding-top: 2px; padding-bottom: 2px; padding-left: 0">
                    <span class="fullscreen-text">Ordenar Esquema</span>
                    <div
                        class="form-check"
                        style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 16px;
                            height: 16px;
                        ">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="d3ForceEnabled"
                            id="d3ForceCheck"
                            style="
                                width: 16px;
                                height: 16px;
                                cursor: pointer;
                                margin: 0;
                                position: relative;
                                top: 1px;
                                left: -7px;
                            " />
                        <label class="form-check-label visually-hidden" for="d3ForceCheck"></label>
                    </div>
                </div>
            </div>
            <!-- Toolbar Nodos -->
            <div
                class="toolbar d-flex gap-2 flex-column position-absolute"
                style="top: 10px; left: 10px; z-index: 2000">
                <button
                    class="btn btn-primary btn-sm"
                    data-bs-toggle="tooltip"
                    title="Gestión de Nodo">
                    <i class="bi bi-diagram-3-fill fs-6"></i>
                </button>
                <button
                    ref="deleteBtn"
                    class="btn btn-light btn-sm"
                    data-bs-toggle="tooltip"
                    title="Eliminar Nodo"
                    @click="handleRemoveNode">
                    <i class="bi bi-trash-fill text-black fs-6"></i>
                </button>
                <button
                    class="btn btn-light btn-sm"
                    data-bs-toggle="tooltip"
                    title="Crear Nodo"
                    @click="openAddNodeModal">
                    <i class="bi bi-plus-circle-fill text-black fs-6"></i>
                </button>
            </div>
            <!-- Toolbar Aristas -->
            <div
                class="toolbar d-flex gap-2 flex-column position-absolute"
                style="top: 145px; left: 10px; z-index: 2000">
                <button
                    class="btn btn-primary btn-sm"
                    data-bs-toggle="tooltip"
                    title="Gestión de Aristas">
                    <i class="bi bi-arrow-left-right"></i>
                </button>
                <button
                    ref="deleteEdgeBtn"
                    class="btn btn-light btn-sm"
                    data-bs-toggle="tooltip"
                    title="Eliminar Arista"
                    @click="handleRemoveEdge">
                    <i class="bi bi-trash3-fill text-black fs-6"></i>
                </button>
                <button
                    ref="createEdgeBtn"
                    class="btn btn-light btn-sm"
                    data-bs-toggle="tooltip"
                    title="Crear Arista "
                    @click="handleCreateEdge">
                    <i class="bi bi-plus-circle-fill text-black fs-6"></i>
                </button>
            </div>
            <!-- Toolbar Grupos -->
            <div
                class="toolbar d-flex gap-2 flex-column position-absolute"
                style="top: 280px; left: 10px; z-index: 2000">
                <button
                    class="btn btn-primary btn-sm"
                    data-bs-toggle="tooltip"
                    title="Gestión de Grupos">
                    <i class="bi bi-share-fill fs-6"></i>
                </button>
                <button
                    class="btn btn-light btn-sm"
                    @click="stopBoxSelection"
                    :disabled="!isBoxSelectionMode"
                    data-bs-toggle="tooltip"
                    title="Detener selección">
                    <i
                        :class="[
                            'bi',
                            'bi-stop-circle',
                            'fs-6',
                            isBoxSelectionMode ? 'text-danger' : 'text-black',
                        ]"></i>
                </button>
            </div>
            <!-- Toolbar selección grupo nodos -->
            <div
                class="toolbar d-flex gap-2 flex-column position-absolute"
                style="top: 358px; left: 10px; z-index: 2000">
                <div class="d-flex justify-content-end">
                    <button
                        class="btn btn-light btn-sm"
                        @click="startBoxSelection"
                        :disabled="isBoxSelectionMode"
                        :aria-pressed="isBoxSelectionMode ? 'true' : 'false'"
                        data-bs-toggle="tooltip"
                        title="Selección por Grupo de Nodos">
                        <i class="bi bi-check-circle fs-6"></i>
                    </button>
                    <div>
                        <ExcelExportButton
                            class="btn btn-light btn-sm demos"
                            :isBoxMode="isBoxSelectionMode"
                            :selectedNodes="selectedNodes"
                            :nodes="nodes"
                            :layouts="layouts.nodes"
                            data-bs-toggle="tooltip"
                            title="Exportar a Excel" />
                    </div>
                </div>
            </div>
            <!-- Toolbar Descargar SVG -->
            <div
                class="toolbar d-flex gap-2 flex-column position-absolute"
                style="top: 420px; left: 10px; z-index: 2000">
                <button
                    class="btn btn-light btn-sm"
                    data-bs-toggle="tooltip"
                    title="Descargar SVG"
                    @click="downloadAsSvg">
                    <i class="bi bi-file-earmark-arrow-down text-primary fs-6"></i>
                </button>
            </div>
            <!-- Botón fijo Guardar -->
            <button class="btn btn-success btn-sm px-3 save-btn-bottom-right" @click="saveNodes">
                <i class="fas fa-save me-1"></i> Guardar Esquema
            </button>

            <!-- v-network-graph principal -->
            <v-network-graph
                :selected-nodes="selectedNodes"
                @update:selected-nodes="onSelectedNodesUpdate"
                v-model:selected-edges="selectedEdges"
                :nodes="nodes"
                :edges="edges"
                :layouts="layouts"
                :configs="configs"
                @node-moved="onNodeMoved"
                :event-handlers="eventHandlers"
                ref="graph">
                <defs>
                    <component is="style">
                        @font-face { font-family: 'Material Icons'; font-style: normal; font-weight:
                        400; src:
                        url(https://fonts.gstatic.com/s/materialicons/v97/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2)
                        format('woff2'); }
                    </component>
                </defs>
                <template #override-node="{ nodeId, scale, config, ...slotProps }">
                    <circle :r="config.radius * scale" :fill="config.color" v-bind="slotProps" />
                    <text
                        font-family="Material Icons"
                        :font-size="22 * scale"
                        fill="#ffffff"
                        text-anchor="middle"
                        dominant-baseline="central"
                        style="pointer-events: none"
                        v-html="nodes[nodeId].icon" />
                </template>
            </v-network-graph>

            <!-- Tooltips selección múltiple -->
            <div v-if="isBoxSelectionMode">
                <div
                    v-for="tip in selectionTooltips"
                    :key="tip.id"
                    class="selection-tooltip"
                    :style="{ left: tip.left, top: tip.top }">
                    <div><strong>Nombre:</strong> {{ tip.data.name }}</div>
                    <div v-if="tip.data.rut"><strong>RUT:</strong> {{ tip.data.rut }}</div>
                    <div v-if="tip.data.tipo"><strong>Tipo:</strong> {{ tip.data.tipo }}</div>
                    <div v-if="tip.data.capitalEnterado">
                        <strong>Capital Enterado:</strong> {{ tip.data.capitalEnterado }}
                    </div>
                    <div v-if="tip.data.lineaNegocio">
                        <strong>Línea de Negocio:</strong> {{ tip.data.lineaNegocio }}
                    </div>
                </div>
            </div>
            <div v-if="isBoxSelectionMode" class="mode-indicator">Modo selección por caja</div>

            <!-- Tooltip Nodos -->
            <div ref="tooltip" class="tooltip" :style="{ ...tooltipPos, opacity: tooltipOpacity }">
                <button class="close-btn" @click="closeTooltip('node')">×</button>
                <div class="d-flex align-items-center">
                    <strong>Nombre:</strong> {{ tooltipData.name }}
                    <button
                        class="btn btn-link btn-sm p-0 ms-2"
                        style="color: #0f69b4"
                        @click="openEditNodeModal(tooltipData)">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                </div>
                <div v-if="tooltipData.data">
                    <div><strong>RUT:</strong> {{ tooltipData.data?.rut ?? "" }}</div>
                    <div><strong>Tipo:</strong> {{ tooltipData.data?.tipo ?? "" }}</div>
                    <div v-if="tooltipData.data?.capitalEnterado !== undefined">
                        <strong>Capital Enterado:</strong>
                        {{ tooltipData.data?.capitalEnterado ?? 0 }}
                    </div>
                    <div v-if="tooltipData.data?.lineaNegocio">
                        <strong>Línea de Negocio:</strong>
                        {{ tooltipData.data?.lineaNegocio ?? "" }}
                    </div>
                </div>
            </div>

            <!-- Modal de edición de nodo -->
            <EditNodeModal
                v-if="showEditNodeModal"
                :show="showEditNodeModal"
                :node="editNodeData"
                :onClose="() => (showEditNodeModal = false)"
                :onConfirm="handleConfirmEditNode" />

            <!-- Tooltip Aristas -->
            <div
                ref="edgeTooltip"
                class="tooltip"
                :style="{ ...edgeTooltipPos, opacity: edgeTooltipOpacity }">
                <button class="close-btn" @click="closeTooltip('edge')">×</button>
                <div>
                    <strong>{{ edgeTooltipData.name }}</strong>
                </div>
                <div v-if="edgeTooltipData.porcentajeParticipacion !== undefined">
                    <strong>Porcentaje de Participación:</strong>
                    {{ edgeTooltipData.porcentajeParticipacion }}%
                </div>
                <div v-if="edgeTooltipData.porcentajeParticipacionUtilidades !== undefined">
                    <strong>Porcentaje de Utilidades:</strong>
                    {{ edgeTooltipData.porcentajeParticipacionUtilidades }}%
                </div>
            </div>
        </div>

        <div class="mt-3 mb-1">
            <h3>Descripción</h3>
            <table class="dictionary bg-primary">
                <thead>
                    <tr>
                        <th>Elemento</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="circle"></div>
                            Nodo
                        </td>
                        <td>Un nodo representa un punto en el gráfico.</td>
                    </tr>
                    <tr>
                        <td>
                            <div class="line"></div>
                            Arista
                        </td>
                        <td>Una conexión (o arista) representa la relación entre dos nodos.</td>
                    </tr>
                    <tr>
                        <td>D3-Force</td>
                        <td>Permite que los nodos se distribuyan de manera más clara.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal Bootstrap para crear nodo -->
        <NodeModal
            :show="showAddNodeModal"
            :onClose="() => (showAddNodeModal = false)"
            :onConfirm="handleConfirmAddNode" />
    </div>
</template>

<style scoped>
    /* Importar la fuente 'Outfit' */
    @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@700&display=swap");

    .network-graph-container {
        height: 700px;
        width: 100%;
        border: 2px solid #dee2e6;
        border-radius: 10px;
        background-color: #ffffff;
        padding: 20px;
        position: relative;
        overflow: visible; /* <— permite scroll si los nodos se salen */
    }

    /* Estilos para el contenedor del ícono de fullscreen */
    .fullscreen-wrapper {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        background-color: #ec540c; /* Fondo rojo siempre visible */
        border-radius: 4px 4px 4px;
        padding: 4px 10px;
        cursor: pointer;
        transition: background-color 0.3s ease-in-out;
        z-index: 2000;
        flex-direction: row; /* Texto a la izquierda del ícono */
        gap: 0; /* Eliminar cualquier espacio entre el ícono y el texto */
    }

    /* Estilo para el ícono SVG */
    .fullscreen-icon {
        width: 20px; /* Tamaño adecuado del ícono */
        height: 20px;
        color: white; /* Ícono en blanco */
        flex-shrink: 0; /* Evita que el ícono se reduzca de tamaño */
        transition: transform 0.3s ease-in-out;
        border-radius: 0;
    }

    /* Estilo para el texto del tooltip */
    .fullscreen-text {
        position: absolute;
        right: 100%; /* Posiciona el texto a la izquierda del ícono */
        top: 50%; /* Centra verticalmente el texto */
        transform: translateY(-50%); /* Centra verticalmente el texto */
        white-space: nowrap;
        color: white;
        opacity: 0;
        visibility: hidden;

        font-family: "Outfit", sans-serif; /* Asegúrate de que la fuente esté cargada */
        background-color: #ec540c; /* Fondo rojo */
        padding: 2.6px 6px; /* Padding para el texto */
        border-radius: 4px 0 0 4px; /* Bordes redondeados opcionales */
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out,
            visibility 0.3s ease-in-out;
        transform-origin: right center; /* Definir el punto de origen para la animación */
        margin: 0; /* Asegura que no haya márgenes que causen el espacio */
    }

    /* Mostrar el texto con animación al pasar el cursor */
    .fullscreen-wrapper:hover .fullscreen-text.fullscreen-wrapper {
        opacity: 1;
        visibility: visible;
        transform: translateY(-50%) translateX(-5px); /* Ajustar el desplazamiento para que el texto se desplace más cerca */
        border-radius: 0 4px 4px 0;
    }

    /* Mostrar el texto con animación al pasar el cursor */
    .fullscreen-wrapper:hover .fullscreen-text {
        opacity: 1;
        visibility: visible;
        transform: translateY(-50%) translateX(0); /* Mueve el texto exactamente al borde del ícono */
    }
    .fullscreen-wrapper:hover {
        border-radius: 0 4px 4px 0;
    }

    /* Estilos para otros elementos existentes */

    .btn-download {
        display: flex;
        align-items: center;
        padding: 4px 12px !important;
        border-radius: 5px;
        font-weight: bold;
        background-color: #0056b3;
        color: #fff;
    }

    .dictionary {
        border-collapse: collapse;
        width: 100%;
        margin-top: 20px;
    }

    .dictionary th,
    .dictionary td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    .dictionary th {
        color: white;
    }

    .dictionary td {
        background-color: #fff;
    }

    .circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #007bff;
        display: inline-block;
        margin-right: 8px;
    }

    .line {
        width: 40px;
        height: 1px;
        background-color: #007bff;
        display: inline-block;
        margin-right: 8px;
        vertical-align: middle;
    }

    .tooltip {
        position: absolute;
        background-color: white;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        pointer-events: none;
        transition: opacity 0.2s ease-in-out;
        z-index: 1000;
        opacity: 0;
        margin-top: 39px;
    }

    .tooltip .close-btn {
        pointer-events: auto;
    }

    .tooltip[style*="opacity: 1"] {
        opacity: 1;
        pointer-events: auto; /* Permitir interacción cuando el tooltip está visible */
    }

    .close-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        border: none;
        background: transparent;
        color: #333;
        font-size: 18px;
        cursor: pointer;
    }

    .close-btn:hover {
        color: #e63946;
    }

    .mt-smaller {
        margin-top: 2rem !important; /* Ajusta el valor según lo necesites */
    }

    .mode-indicator {
        position: absolute;
        bottom: 10px;
        left: 10px;
        padding: 4px 10px;
        background-color: #ec540c;
        color: #ffffff;
        font-style: italic;
        border-radius: 4px;
        pointer-events: none;
        font-size: 12px;
    }

    .demo-control-panel {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .color-fondo {
        background-color: #0064a0;
        color: #ffffff;
    }

    .selection-tooltip {
        position: absolute;
        width: 140px;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid #bbb;
        padding: 6px 8px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        pointer-events: none;
        font-size: 12px;
        z-index: 9999;
        white-space: normal;
        word-wrap: break-word;
    }
    .btn-primary.active,
    .btn-primary.disabled,
    .btn-primary:disabled {
        /* Bootstrap normalmente baja la opacidad al disabled, lo revertimos */
        opacity: 1 !important;
        color: #fff !important;
        background-color: #0064a0 !important; /* mismo tono primario */
        border-color: #0064a0 !important;
        cursor: default;
    }

    .icon-lg {
        font-size: 4rem; /* o cualquier otro valor */
    }

    .icon-lg2 {
        font-size: 3rem;
    }

    .toolbar {
        background: rgba(255, 255, 255, 0.8);
        padding: 4px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap; /* Permite que los botones salten de línea si no caben */
        max-width: calc(100% - 20px); /* Evita que exceda el ancho del contenedor */
        overflow: hidden; /* Oculta cualquier desborde */
    }

    .network-graph-container {
        overflow: visible; /* Permite ver tooltips o elementos flotantes fuera del scroll */
    }

    .save-btn-bottom-right {
        position: absolute;
        bottom: 22px; /* Espacio desde el borde inferior */
        right: 22px; /* Espacio desde el borde derecho */
        z-index: 3000; /* Por encima del grafo y toolbars */
        border-radius: 8px;
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.09);
        font-weight: bold;
        padding: 8px;
    }

    .swal2-container {
        z-index: 99999 !important;
    }
</style>
