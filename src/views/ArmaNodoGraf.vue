<script setup lang="ts">
    import { reactive, ref, onMounted, computed, watchEffect, watch } from "vue";
    import * as vNG from "v-network-graph";
    import { ForceLayout } from "v-network-graph/lib/force-layout";
    import data from "../data";

    // Asegúrate de tener v-network-graph instalado: npm install v-network-graph
    // Asegúrate de tener Bootstrap CSS/JS en tu index.html o main.js

    const nodes = reactive({ ...data.nodes });
    const edges = reactive({ ...data.edges });
    const layouts = reactive(data.layouts);

    const nextNodeIndex = ref(Object.keys(nodes).length + 1);
    const nextEdgeIndex = ref(Object.keys(edges).length + 1);
    const selectedNodes = ref<string[]>([]);
    const selectedEdges = ref<string[]>([]);
    const newNodeName = ref<string>("");
    const graph = ref<vNG.Instance | null>(null);
    const graphContainer = ref<HTMLDivElement | null>(null);

    const d3ForceEnabled = computed({
        get: () => configs.view?.layoutHandler instanceof ForceLayout,
        set: (value: boolean) => {
            if (configs.view) {
                configs.view.layoutHandler = value ? new ForceLayout() : new vNG.SimpleLayout();
            }
        },
    });

    const onNodeMoved = ({ nodeId, x, y }) => {
        data.updateNodePosition(nodeId, { x, y });
    };

    const configs = reactive(
        vNG.defineConfigs({
            view: {
                layoutHandler: new ForceLayout(),
                panEnabled: true,
                zoomEnabled: true,
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

    const tooltip = ref<HTMLDivElement>();
    const tooltipData = ref<Record<string, any>>({});
    const tooltipOpacity = ref(0);
    const tooltipPos = ref({ left: "0px", top: "0px" });
    const targetNodeId = ref<string>("");

    const edgeTooltip = ref<HTMLDivElement>();
    const edgeTooltipData = ref<Record<string, any>>({});
    const edgeTooltipOpacity = ref(0);
    const edgeTooltipPos = ref({ left: "0px", top: "0px" });
    const targetEdgeId = ref<string>("");

    watchEffect(() => {
        localStorage.setItem("layouts", JSON.stringify(layouts));
    });

    onMounted(() => {
        const savedLayouts = localStorage.getItem("layouts");
        if (savedLayouts) {
            const parsedLayouts = JSON.parse(savedLayouts);
            Object.assign(layouts.nodes, parsedLayouts.nodes);
        }
    });

    onMounted(() => {
        data.loadNodesFromJson();
        const savedLayouts = localStorage.getItem("layouts");
        if (savedLayouts) {
            const parsedLayouts = JSON.parse(savedLayouts);
            Object.assign(layouts.nodes, parsedLayouts.nodes);
        }
    });

    watch(
        () => [targetNodeId.value, tooltipOpacity.value],
        () => {
            if (!graph.value || !tooltip.value || !targetNodeId.value) return;
            const nodeLayout = layouts.nodes[targetNodeId.value];
            if (nodeLayout) {
                const domPoint = graph.value.translateFromSvgToDomCoordinates(nodeLayout);
                tooltipPos.value = {
                    left: `${domPoint.x - tooltip.value.offsetWidth / 2}px`,
                    top: `${domPoint.y - tooltip.value.offsetHeight - 20}px`,
                };
            }
        }
    );

    const eventHandlers: vNG.EventHandlers = {
        "node:click": ({ node }) => {
            closeTooltip("node");
            const nodeData = nodes[node];
            const nodeLayout = layouts.nodes[node];
            if (nodeData && nodeLayout && graph.value && tooltip.value) {
                const domPoint = graph.value.translateFromSvgToDomCoordinates(nodeLayout);
                tooltipData.value = {
                    id: node,
                    name: nodeData.name || `Nodo sin nombre (${node})`,
                    x: nodeLayout.x.toFixed(2),
                    y: nodeLayout.y.toFixed(2),
                    data: nodeData.data,
                };
                tooltipPos.value = {
                    left: `${domPoint.x - tooltip.value.offsetWidth / 2}px`,
                    top: `${domPoint.y - tooltip.value.offsetHeight - 20}px`,
                };
                tooltipOpacity.value = 1;
                targetNodeId.value = node;
            }
        },
        "edge:click": (event: vNG.EdgeEvent<MouseEvent>) => {
            closeTooltip("edge");
            const edge = event.edge;
            if (!edge) return;
            const edgeData = edges[edge];
            if (edgeData && graph.value && edgeTooltip.value) {
                const sourcePos = layouts.nodes[edgeData.source];
                const targetPos = layouts.nodes[edgeData.target];
                if (!sourcePos || !targetPos) return;
                const edgeCenter = {
                    x: (sourcePos.x + targetPos.x) / 2,
                    y: (sourcePos.y + targetPos.y) / 2,
                };
                const domPoint = graph.value.translateFromSvgToDomCoordinates(edgeCenter);
                edgeTooltipData.value = {
                    id: edge,
                    name: `Conexión entre ${nodes[edgeData.source].name} y ${
                        nodes[edgeData.target].name
                    }`,
                    porcentajeParticipacion: edgeData.porcentajeParticipacion,
                    porcentajeParticipacionUtilidades: edgeData.porcentajeParticipacionUtilidades,
                };
                edgeTooltipPos.value = {
                    left: `${domPoint.x - edgeTooltip.value.offsetWidth / 2}px`,
                    top: `${domPoint.y - edgeTooltip.value.offsetHeight - 20}px`,
                };
                edgeTooltipOpacity.value = 1;
                targetEdgeId.value = edge;
            }
        },
    };

    function closeTooltip(type: string) {
        if (type === "node") {
            tooltipOpacity.value = 0;
            targetNodeId.value = "";
        } else if (type === "edge") {
            edgeTooltipOpacity.value = 0;
            targetEdgeId.value = "";
        }
    }

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

    // Variables para el modal usando Bootstrap (sin Element Plus)
    const newNodeForm = reactive({
        nombre: "",
        rut: "",
        tipo: "",
        capitalEnterado: 0,
        lineaNegocio: "",
    });

    let addNodeModalInstance: any = null;
    const addNodeModalEl = ref<HTMLDivElement | null>(null);

    onMounted(() => {
        loadNodes();
        addNodeModalEl.value = document.getElementById("addNodeModal") as HTMLDivElement | null;
    });

    function openAddNodeModal() {
        newNodeForm.nombre = "";
        newNodeForm.rut = "";
        newNodeForm.tipo = "";
        newNodeForm.capitalEnterado = 0;
        newNodeForm.lineaNegocio = "";

        if (addNodeModalEl.value) {
            addNodeModalInstance = new (window as any).bootstrap.Modal(addNodeModalEl.value);
            addNodeModalInstance.show();
        }
    }

    function closeAddNodeModal() {
        if (addNodeModalInstance) {
            addNodeModalInstance.hide();
        }
    }

    function confirmAddNode() {
        if (!newNodeForm.nombre || !newNodeForm.rut) {
            alert("Por favor completa al menos el nombre y el RUT.");
            return;
        }
        addNode(
            newNodeForm.nombre,
            newNodeForm.rut,
            newNodeForm.tipo,
            newNodeForm.capitalEnterado,
            newNodeForm.lineaNegocio
        );
        closeAddNodeModal();
    }

    function addNode(
        name: string,
        rut: string,
        tipo: string,
        capitalEnterado: number,
        lineaNegocio: string
    ) {
        const nodeId = `node${nextNodeIndex.value}`;
        const x = Math.random() * 400;
        const y = Math.random() * 400;
        nodes[nodeId] = {
            name,
            x,
            y,
            size: 15,
            color: "#0064a0",
            label: true,
            data: {
                rut,
                tipo,
                capitalEnterado,
                lineaNegocio,
            },
            icon: "&#xe7fd;",
        };
        layouts.nodes[nodeId] = { x, y };
        nextNodeIndex.value++;
    }

    function removeNode() {
        for (const nodeId of selectedNodes.value) {
            delete nodes[nodeId];
        }
        selectedNodes.value = [];
    }

    function addEdge() {
        if (selectedNodes.value.length !== 2) {
            alert("Por favor selecciona exactamente dos nodos para crear una arista.");
            return;
        }
        const [source, target] = selectedNodes.value;
        const edgeId = `edge${nextEdgeIndex.value}`;
        const edgeColor = "#002C48";

        const porcentajeParticipacion = parseFloat(
            prompt("Ingrese el porcentaje de participación:", "0") || "0"
        );
        const porcentajeParticipacionUtilidades = parseFloat(
            prompt("Ingrese el porcentaje de participación en utilidades:", "0") || "0"
        );

        edges[edgeId] = {
            source,
            target,
            color: edgeColor,
            porcentajeParticipacion,
            porcentajeParticipacionUtilidades,
        };
        nextEdgeIndex.value++;
    }

    function removeEdge() {
        for (const edgeId of selectedEdges.value) {
            delete edges[edgeId];
        }
        selectedEdges.value = [];
    }

    function updateNodeName() {
        if (selectedNodes.value.length === 1) {
            const nodeId = selectedNodes.value[0];
            nodes[nodeId].name = newNodeName.value;
            newNodeName.value = "";
        } else {
            alert("Por favor selecciona un único nodo para renombrarlo.");
        }
    }

    function saveNodes() {
        const currentGraphState = {
            nodes: { ...nodes },
            edges: { ...edges },
            nextNodeIndex: nextNodeIndex.value,
            nextEdgeIndex: nextEdgeIndex.value,
        };
        localStorage.setItem("savedGraphState", JSON.stringify(currentGraphState));
        alert("Nodos y aristas guardados correctamente.");
    }

    function loadNodes() {
        const savedGraphState = localStorage.getItem("savedGraphState");
        if (savedGraphState) {
            const {
                nodes: savedNodes,
                edges: savedEdges,
                nextNodeIndex: savedNodeIndex,
                nextEdgeIndex: savedEdgeIndex,
            } = JSON.parse(savedGraphState);
            for (const nodeId in savedNodes) {
                nodes[nodeId] = { ...nodes[nodeId], ...savedNodes[nodeId] };
            }
            for (const edgeId in savedEdges) {
                edges[edgeId] = { ...edges[edgeId], ...savedEdges[edgeId] };
            }
            nextNodeIndex.value = savedNodeIndex;
            nextEdgeIndex.value = savedEdgeIndex;
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            graphContainer.value?.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
</script>

<template>
    <div class="container">
        <!-- Panel de Acciones -->
        <div class="card p-3 mb-3 shadow-sm">
            <div class="card-header bg-primary text-white">
                <h6 class="m-0">Panel de Acciones</h6>
            </div>
            <div class="card-body">
                <div class="row gy-3">
                    <!-- Gestión de Nodos -->
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded shadow-sm">
                            <h6 class="text-primary mb-3"><strong>Gestión de Nodos</strong></h6>
                            <div class="d-flex flex-wrap gap-2">
                                <button
                                    class="btn btn-danger btn-sm px-3"
                                    :disabled="selectedNodes.length === 0"
                                    @click="removeNode">
                                    <i class="fas fa-trash-alt me-1"></i> Eliminar Nodo
                                </button>
                                <button
                                    class="btn btn-primary btn-sm px-3"
                                    @click="openAddNodeModal">
                                    <i class="fas fa-plus-circle me-1"></i> Crear Nodo
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Gestión de Aristas -->
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded shadow-sm">
                            <h6 class="text-primary mb-3"><strong>Gestión de Aristas</strong></h6>
                            <div class="d-flex flex-wrap gap-2">
                                <button
                                    class="btn btn-primary btn-sm px-3"
                                    :disabled="selectedNodes.length !== 2"
                                    @click="addEdge">
                                    <i class="fas fa-link me-1"></i> Crear Arista
                                </button>
                                <button
                                    class="btn btn-danger btn-sm px-3"
                                    :disabled="selectedEdges.length === 0"
                                    @click="removeEdge">
                                    <i class="fas fa-unlink me-1"></i> Eliminar Arista
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Checkbox para habilitar Force Layout -->
                    <div class="col-md-6 mt-3">
                        <div class="p-3 bg-light rounded shadow-sm">
                            <h6 class="text-primary mb-3">
                                <strong>Configuración de Layout</strong>
                            </h6>
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-model="d3ForceEnabled"
                                    id="d3ForceCheck" />
                                <label class="form-check-label" for="d3ForceCheck">
                                    D3-Force enabled
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Renombrar Nodo -->
                    <div class="col-md-6 mt-3">
                        <div class="p-3 bg-light rounded shadow-sm">
                            <h6 class="text-primary mb-3"><strong>Renombrar Nodo</strong></h6>
                            <div class="d-flex flex-column gap-2">
                                <input
                                    type="text"
                                    v-model="newNodeName"
                                    class="form-control form-control-sm"
                                    placeholder="Nuevo Nombre del Nodo" />
                                <button
                                    class="btn btn-secondary btn-sm px-3"
                                    :disabled="selectedNodes.length !== 1"
                                    @click="updateNodeName">
                                    <i class="fas fa-edit me-1"></i> Cambiar Nombre
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Exportar -->
                    <div class="col-md-6 mt-3">
                        <div class="p-3 bg-light rounded shadow-sm">
                            <h6 class="text-primary mb-3"><strong>Exportar</strong></h6>
                            <button
                                class="btn btn-primary btn-sm btn-download"
                                @click="downloadAsSvg">
                                Descargar SVG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <button class="btn btn-success btn-sm px-3" @click="saveNodes">
                    <i class="fas fa-save me-1"></i> Guardar Esquema
                </button>
            </div>
        </div>

        <div class="network-graph-container bg-light rounded shadow-sm p-3" ref="graphContainer">
            <div class="d-flex justify-content-end flex-column align-items-end">
                <div
                    class="fullscreen-wrapper"
                    aria-label="Agrandar imagen"
                    role="button"
                    @click="toggleFullscreen">
                    <span class="fullscreen-text">Ver más grande</span>
                    <i
                        class="bi bi-arrows-fullscreen text-white"
                        style="font-size: 14px; cursor: pointer">
                    </i>
                </div>

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
                        <label class="form-check-label visually-hidden" for="d3ForceCheck"> </label>
                    </div>
                </div>
            </div>

            <!-- <div class="d-flex justify-content-between align-items-end">
                <div
                    class="fullscreen-wrapper"
                    aria-label="Agrandar imagen"
                    role="button"
                    @click="toggleFullscreen"
                    v-tippy="'Ver más grande'">

                    <i
                        class="bi bi-arrows-fullscreen text-white"
                        style="font-size: 14px; cursor: pointer">
                    </i>
                </div>
                <div
                    class="fullscreen-wrapper"
                    aria-label="Agrandar imagen"
                    role="button"
                    @click="toggleFullscreen"
                    v-tippy="'Ver más grande'">

                    <i
                        class="bi bi-arrows-fullscreen text-white"
                        style="font-size: 14px; cursor: pointer">
                    </i>
                </div>
            </div>
        -->
            <v-network-graph
                v-model:selected-nodes="selectedNodes"
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

            <!-- Tooltip Nodos -->
            <div ref="tooltip" class="tooltip" :style="{ ...tooltipPos, opacity: tooltipOpacity }">
                <button class="close-btn" @click="closeTooltip('node')">×</button>
                <div><strong>Nombre:</strong> {{ tooltipData.name }}</div>
                <div v-if="tooltipData.data">
                    <div><strong>RUT:</strong> {{ tooltipData.data.rut }}</div>
                    <div><strong>Tipo:</strong> {{ tooltipData.data.tipo }}</div>
                    <div v-if="tooltipData.data.capitalEnterado">
                        <strong>Capital Enterado:</strong> {{ tooltipData.data.capitalEnterado }}
                    </div>
                    <div v-if="tooltipData.data.lineaNegocio">
                        <strong>Línea de Negocio:</strong> {{ tooltipData.data.lineaNegocio }}
                    </div>
                </div>
                <div><strong>Posición:</strong> ({{ tooltipData.x }}, {{ tooltipData.y }})</div>
            </div>

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
        <div
            class="modal fade"
            id="addNodeModal"
            tabindex="-1"
            aria-labelledby="addNodeModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="addNodeModalLabel" class="modal-title">
                            <i class="bi bi-plus-circle text-warning"></i> Crear Nodo Hijo
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="closeAddNodeModal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-2">
                            <label>Nombre:</label>
                            <input
                                v-model="newNodeForm.nombre"
                                type="text"
                                class="form-control form-control-sm" />
                        </div>
                        <div class="mb-2">
                            <label>RUT:</label>
                            <input
                                v-model="newNodeForm.rut"
                                type="text"
                                class="form-control form-control-sm" />
                        </div>
                        <div class="mb-2">
                            <label>Tipo:</label>
                            <input
                                v-model="newNodeForm.tipo"
                                type="text"
                                class="form-control form-control-sm" />
                        </div>
                        <div class="mb-2">
                            <label>Capital Enterado:</label>
                            <input
                                v-model.number="newNodeForm.capitalEnterado"
                                type="number"
                                class="form-control form-control-sm" />
                        </div>
                        <div class="mb-2">
                            <label>Línea de Negocio:</label>
                            <input
                                v-model="newNodeForm.lineaNegocio"
                                type="text"
                                class="form-control form-control-sm" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            class="btn btn-warning text-white"
                            type="button"
                            @click="closeAddNodeModal">
                            Cancelar
                        </button>
                        <button class="btn btn-primary" type="button" @click="confirmAddNode">
                            Crear Nodo
                        </button>
                    </div>
                </div>
            </div>
        </div>
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
    }

    /* Estilos para el contenedor del ícono de fullscreen */
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
    }

    .tooltip .close-btn {
        pointer-events: auto;
    }

    .tooltip[style*="opacity: 1"] {
        opacity: 1;
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
</style>
