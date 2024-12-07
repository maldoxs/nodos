<template>
    <div class="container">
        <div class="card p-3 mb-3 shadow-sm">
            <div class="card-header bg-primary text-white">
                <h6 class="m-0">Panel de Acciones</h6>
            </div>
            <div class="card-body">
                <div class="row gy-3">
                    <!-- Sección de acciones de Nodo -->
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded shadow-sm">
                            <h6 class="text-primary mb-3"><strong>Gestión de Nodos</strong></h6>
                            <div class="d-flex flex-wrap gap-2">
                                <button class="btn btn-primary btn-sm px-3" @click="addNode">
                                    <i class="fas fa-plus-circle me-1"></i> Nodo Hijo
                                </button>
                                <button
                                    class="btn btn-danger btn-sm px-3"
                                    :disabled="selectedNodes.length === 0"
                                    @click="removeNode">
                                    <i class="fas fa-trash-alt me-1"></i> Eliminar Nodo
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Sección de acciones de Arista -->
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
                            <el-checkbox v-model="d3ForceEnabled" label="D3-Force enabled" />
                        </div>
                    </div>

                    <!-- Sección de cambio de nombre de nodo -->
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

                    <!-- Sección de descarga -->
                    <div class="col-md-6 mt-3">
                        <div class="p-3 bg-light rounded shadow-sm">
                            <h6 class="text-primary mb-3"><strong>Exportar</strong></h6>
                            <div>
                                <el-button
                                    type="primary"
                                    class="btn-download"
                                    @click="downloadAsSvg">
                                    <el-icon><download /></el-icon>
                                    Descargar SVG
                                </el-button>
                            </div>
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
        <div></div>

        <div>
            <!-- Aquí podrías tener el componente de la red que utiliza los nodos configurados -->
        </div>

        <div class="tooltip-wrapper">
            <div class="network-graph-container bg-light rounded shadow-sm p-3">
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
                    <!-- Definir la fuente de Material Icons -->
                    <defs>
                        <component is="style">
                            @font-face { font-family: 'Material Icons'; font-style: normal;
                            font-weight: 400; src:
                            url(https://fonts.gstatic.com/s/materialicons/v97/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2)
                            format('woff2'); }
                        </component>
                    </defs>

                    <!-- Sobrescribir el nodo para incluir el ícono -->
                    <template #override-node="{ nodeId, scale, config, ...slotProps }">
                        <circle
                            :r="config.radius * scale"
                            :fill="config.color"
                            v-bind="slotProps" />
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

                <!-- Tooltip dinámico para nodos -->
                <div
                    ref="tooltip"
                    class="tooltip"
                    :style="{ ...tooltipPos, opacity: tooltipOpacity }">
                    <!-- Botón de cerrar -->
                    <button class="close-btn" @click="closeTooltip('node')">×</button>
                    <div><strong>Nombre:</strong> {{ tooltipData.name }}</div>
                    <div v-if="tooltipData.data">
                        <div><strong>RUT:</strong> {{ tooltipData.data.rut }}</div>
                        <div><strong>Tipo:</strong> {{ tooltipData.data.tipo }}</div>
                        <div v-if="tooltipData.data.capitalEnterado">
                            <strong>Capital Enterado:</strong>
                            {{ tooltipData.data.capitalEnterado }}
                        </div>
                        <div v-if="tooltipData.data.lineaNegocio">
                            <strong>Línea de Negocio:</strong> {{ tooltipData.data.lineaNegocio }}
                        </div>
                    </div>
                    <div><strong>Posición:</strong> ({{ tooltipData.x }}, {{ tooltipData.y }})</div>
                </div>

                <!-- Tooltip dinámico para aristas -->
                <div
                    ref="edgeTooltip"
                    class="tooltip"
                    :style="{ ...edgeTooltipPos, opacity: edgeTooltipOpacity }">
                    <!-- Botón de cerrar -->
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
                        <td>
                            Permite que los nodos se distribuyan de manera que la visualización sea
                            más clara.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, onMounted, computed, watchEffect, watch } from "vue";
    import * as vNG from "v-network-graph";
    import { ForceLayout } from "v-network-graph/lib/force-layout"; // Importar ForceLayout para el diseño forzado
    import { Download } from "@element-plus/icons"; // Importar el ícono 'Download' de Element Plus
    import data from "../data"; // Datos para los nodos y aristas contiene la configuración y los nodos iniciales.

    const nodes = reactive({ ...data.nodes });
    const edges = reactive({ ...data.edges });
    const layouts = reactive(data.layouts);

    const nextNodeIndex = ref(Object.keys(nodes).length + 1);
    const nextEdgeIndex = ref(Object.keys(edges).length + 1);
    const selectedNodes = ref<string[]>([]);
    const selectedEdges = ref<string[]>([]);
    const newNodeName = ref<string>("");
    const graph = ref<vNG.Instance | null>(null);

    // Propiedad computada para habilitar o deshabilitar Force Layout
    const d3ForceEnabled = computed({
        get: () => configs.view?.layoutHandler instanceof ForceLayout,
        set: (value: boolean) => {
            if (configs.view) {
                if (value) {
                    configs.view.layoutHandler = new ForceLayout();
                } else {
                    configs.view.layoutHandler = new vNG.SimpleLayout();
                }
            }
        },
    });

    // Configuración del grafo, incluyendo el handler del layout
    const configs = reactive(
        vNG.defineConfigs({
            view: {
                layoutHandler: new ForceLayout(), // Se inicializa con ForceLayout por defecto
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

    // Tooltip dinámico para nodos
    const tooltip = ref<HTMLDivElement>();
    const tooltipData = ref<Record<string, any>>({});
    const tooltipOpacity = ref(0);
    const tooltipPos = ref({ left: "0px", top: "0px" });
    const targetNodeId = ref<string>("");

    // Tooltip dinámico para aristas
    const edgeTooltip = ref<HTMLDivElement>();
    const edgeTooltipData = ref<Record<string, any>>({});
    const edgeTooltipOpacity = ref(0);
    const edgeTooltipPos = ref({ left: "0px", top: "0px" });
    const targetEdgeId = ref<string>("");

    // Actualizar la función de posición del tooltip para nodos
    const updateTooltipPosition = () => {
        if (!graph.value || !tooltip.value || !targetNodeId.value) return;

        const nodeLayout = layouts.nodes[targetNodeId.value];
        if (!nodeLayout) return;

        // Mapeo de coordenadas SVG a DOM
        const domPoint = graph.value.translateFromSvgToDomCoordinates(nodeLayout);

        // Ajustar posición del tooltip
        tooltipPos.value = {
            left: `${domPoint.x - tooltip.value.offsetWidth / 2}px`,
            top: `${domPoint.y - tooltip.value.offsetHeight - 20}px`,
        };
    };

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

    // Reemplazar el cálculo de la posición del nodo en el tooltip
    // Actualiza la lógica del watch para reutilizar targetNodePos
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
    // Verificación en el evento "edge:click" para evitar que "edgeTooltip.value" sea undefined
    const updateEdgeTooltipPosition = () => {
        if (!graph.value || !edgeTooltip.value || !targetEdgeId.value) return;

        const edgeData = edges[targetEdgeId.value];
        if (!edgeData) return;

        const sourcePos = layouts.nodes[edgeData.source];
        const targetPos = layouts.nodes[edgeData.target];

        // Aseguramos que sourcePos y targetPos existen
        if (!sourcePos || !targetPos) return;

        // Calcular la posición central de la arista
        const edgeCenter = {
            x: (sourcePos.x + targetPos.x) / 2,
            y: (sourcePos.y + targetPos.y) / 2,
        };

        // Mapeo de coordenadas SVG a DOM
        const domPoint = graph.value.translateFromSvgToDomCoordinates(edgeCenter);

        // Ajustar posición del tooltip
        edgeTooltipPos.value = {
            left: `${domPoint.x - edgeTooltip.value.offsetWidth / 2}px`,
            top: `${domPoint.y - edgeTooltip.value.offsetHeight - 20}px`,
        };
    };

    // Función para cerrar los tooltips
    const closeTooltip = (type: string) => {
        console.log(`Cerrando tooltip de tipo: ${type}`);
        if (type === "node") {
            tooltipOpacity.value = 0; // Ocultar el tooltip de nodo
            targetNodeId.value = ""; // Limpiar el ID del nodo
        } else if (type === "edge") {
            edgeTooltipOpacity.value = 0; // Ocultar el tooltip de arista
            targetEdgeId.value = ""; // Limpiar el ID de la arista
        }
    };

    // Event Handlers para el clic en los nodos y aristas
    // Event Handlers para el clic en los nodos y aristas
    const eventHandlers: vNG.EventHandlers = {
        "node:click": ({ node }) => {
            closeTooltip("node"); // Cerrar cualquier tooltip de nodo antes de abrir el nuevo

            const nodeData = nodes[node];
            const nodeLayout = layouts.nodes[node];

            if (nodeData && nodeLayout) {
                if (!graph.value || !tooltip.value) return;

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

                tooltipOpacity.value = 1; // Mostrar el tooltip de nodo
                targetNodeId.value = node;
            }
        },

        "edge:click": (event: vNG.EdgeEvent<MouseEvent>) => {
            closeTooltip("edge"); // Cerrar cualquier tooltip de arista antes de abrir el nuevo

            const edge = event.edge;
            if (!edge) return;

            const edgeData = edges[edge];
            if (edgeData) {
                const sourceNode = nodes[edgeData.source];
                const targetNode = nodes[edgeData.target];

                if (sourceNode && targetNode) {
                    if (!graph.value || !edgeTooltip.value) return;

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
                        name: `Conexión entre ${sourceNode.name} y ${targetNode.name}`,
                        porcentajeParticipacion: edgeData.porcentajeParticipacion,
                        porcentajeParticipacionUtilidades:
                            edgeData.porcentajeParticipacionUtilidades,
                    };

                    edgeTooltipPos.value = {
                        left: `${domPoint.x - edgeTooltip.value.offsetWidth / 2}px`,
                        top: `${domPoint.y - edgeTooltip.value.offsetHeight - 20}px`,
                    };

                    edgeTooltipOpacity.value = 1; // Mostrar el tooltip de arista
                    targetEdgeId.value = edge;
                }
            }
        },
    };

    const onNodeMoved = (nodeId, newPosition) => {
        layouts.nodes[nodeId] = { ...newPosition };
        nodes[nodeId].x = newPosition.x;
        nodes[nodeId].y = newPosition.y;
    };

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

    // Funciones para agregar y eliminar nodos y aristas...
    // **Agregar un nodo**
    const addNode = () => {
        const nodeId = `node${nextNodeIndex.value}`;
        const name = `Nodo ${nextNodeIndex.value}`;
        const x = Math.random() * 400;
        const y = Math.random() * 400;
        nodes[nodeId] = { name, x, y, size: 15, color: "#0064a0", label: true };
        layouts.nodes[nodeId] = { x, y };
        nextNodeIndex.value++;
    };

    const removeNode = () => {
        for (const nodeId of selectedNodes.value) {
            delete nodes[nodeId];
        }
        selectedNodes.value = [];
    };

    const addEdge = () => {
        if (selectedNodes.value.length !== 2) {
            alert("Por favor selecciona exactamente dos nodos para crear una arista.");
            return;
        }
        const [source, target] = selectedNodes.value;
        const edgeId = `edge${nextEdgeIndex.value}`;
        const edgeColor = "#002C48";

        // Solicitar porcentajes al usuario
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
    };

    const removeEdge = () => {
        for (const edgeId of selectedEdges.value) {
            delete edges[edgeId];
        }
        selectedEdges.value = [];
    };

    const updateNodeName = () => {
        if (selectedNodes.value.length === 1) {
            const nodeId = selectedNodes.value[0];
            nodes[nodeId].name = newNodeName.value;
            newNodeName.value = "";
        } else {
            alert("Por favor selecciona un único nodo para renombrarlo.");
        }
    };

    const saveNodes = () => {
        const currentGraphState = {
            nodes: { ...nodes }, // Realiza una copia de los nodos
            edges: { ...edges },
            nextNodeIndex: nextNodeIndex.value,
            nextEdgeIndex: nextEdgeIndex.value,
        };
        localStorage.setItem("savedGraphState", JSON.stringify(currentGraphState));
        console.log("Estado guardado:", currentGraphState);
        alert("Nodos y aristas guardados correctamente.");
    };

    const loadNodes = () => {
        const savedGraphState = localStorage.getItem("savedGraphState");
        if (savedGraphState) {
            const {
                nodes: savedNodes,
                edges: savedEdges,
                nextNodeIndex: savedNodeIndex,
                nextEdgeIndex: savedEdgeIndex,
            } = JSON.parse(savedGraphState);

            // Combinar nodos
            for (const nodeId in savedNodes) {
                nodes[nodeId] = { ...nodes[nodeId], ...savedNodes[nodeId] };
            }

            // Combinar aristas
            for (const edgeId in savedEdges) {
                edges[edgeId] = { ...edges[edgeId], ...savedEdges[edgeId] };
            }

            // Restaurar los índices
            nextNodeIndex.value = savedNodeIndex;
            nextEdgeIndex.value = savedEdgeIndex;

            console.log("Estado cargado desde el almacenamiento local:", savedGraphState);
        } else {
            console.log("No se encontró estado guardado.");
        }
    };

    onMounted(() => {
        loadNodes();
    });
</script>

<style scoped>
    .network-graph-container {
        height: 700px;
        width: 100%;
        border: 2px solid #dee2e6;
        border-radius: 10px;
        background-color: #ffffff;
        padding: 20px;
    }

    .btn-download {
        display: flex;
        align-items: center;
        padding: 4px 12px !important;
        border-radius: 5px;
        font-weight: bold;
        background-color: #0056b3;
        color: #fff;
    }

    h1 {
        color: #333;
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

    .network-graph-container {
        position: relative;
        height: 700px;
        width: 100%;
        border: 2px solid #dee2e6;
        border-radius: 10px;
        background-color: #ffffff;
        padding: 20px;
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
        opacity: 0; /* Asegúrate de que el tooltip esté oculto por defecto */
    }

    .tooltip .close-btn {
        pointer-events: auto; /* Habilitar eventos en el botón de cerrar */
    }

    .tooltip[style*="opacity: 1"] {
        opacity: 1; /* Cuando la opacidad es 1, el tooltip debe ser visible */
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
        color: #e63946; /* Cambiar el color al pasar el ratón */
    }
</style>
