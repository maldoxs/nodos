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
                                <button
                                    class="btn btn-warning btn-sm px-3 text-white"
                                    @click="addHotPinkNodeHandler">
                                    <i class="fas fa-plus-circle me-1"></i> Nodo Padre
                                </button>
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
            <!-- <el-button @click="addHotPinkNodeHandler">Add HotPink</el-button> -->
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
                    ref="graph" />
                <!-- Tooltip dinámico -->
                <div
                    ref="tooltip"
                    class="tooltip"
                    :style="{ ...tooltipPos, opacity: tooltipOpacity }">
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
    import { reactive, ref, onMounted, computed, watch } from "vue"; // Importa funciones de Vue
    import * as vNG from "v-network-graph"; // Importa todos los elementos de 'v-network-graph' (usa 'vNG' para abreviar)
    import { VNetworkGraph } from "v-network-graph"; // Importa el componente VNetworkGraph específicamente
    import data from "../data"; // Asegúrate de que 'data' esté exportado correctamente desde '../data'
    import { Download } from "@element-plus/icons"; // Importa el ícono 'Download' de Element Plus
    //import { addHotPinkNode } from "../data"; // Asegúrate de que 'addHotPinkNode' esté correctamente exportado desde '../data'

    // const addHotPinkNodeHandler = () => {
    //     addHotPinkNode(nodes, nextNodeIndex); // Llama a la función pasando los nodos y el índice del siguiente nodo
    // };
    // Código adicional aquí para la lógica de tu componente

    const nodes = reactive({ ...data.nodes });
    const edges = reactive({ ...data.edges });
    const nextNodeIndex = ref(Object.keys(nodes).length + 1);
    const nextEdgeIndex = ref(Object.keys(edges).length + 1);
    const selectedNodes = ref<string[]>([]);
    const selectedEdges = ref<string[]>([]);
    const newNodeName = ref<string>("");

    const layouts = reactive(data.layouts);

    // Tooltip dinámico
    const tooltip = ref<HTMLDivElement>();
    const tooltipData = ref<Record<string, any>>({});
    const tooltipOpacity = ref(0);
    const tooltipPos = ref({ left: "0px", top: "0px" });
    const targetNodeId = ref<string>("");

    const graph = ref<vNG.Instance | null>(null); // Inicializar con null
    // Reemplazar el cálculo de la posición del nodo en el tooltip
    const targetNodePos = computed(() => {
        // Comprueba si el nodo existe en layouts.nodes
        const nodeLayout = layouts.nodes[targetNodeId.value];
        return nodeLayout ? { x: nodeLayout.x, y: nodeLayout.y } : { x: 0, y: 0 };
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

    /// **Eventos del grafo**
    // Event Handlers
    const eventHandlers: vNG.EventHandlers = {
        "node:pointerover": ({ node }) => {
            const nodeData = nodes[node];
            const nodeLayout = layouts.nodes[node];

            if (nodeData && nodeLayout) {
                // Actualiza los datos del tooltip
                tooltipData.value = {
                    id: node,
                    name: nodeData.name || `Nodo sin nombre (${node})`,
                    x: nodeLayout.x,
                    y: nodeLayout.y,
                    data: nodeData.data, // Añadimos los datos para el tooltip
                };
                // Mostrar tooltip
                tooltipOpacity.value = 1;
                // Calcular posición del tooltip
                updateTooltipPosition(nodeLayout);
            }
        },
        "node:pointerout": () => {
            tooltipOpacity.value = 0; // Ocultar tooltip
        },
    };

    // **Actualizar posición del tooltip**
    const updateTooltipPosition = (nodeLayout: { x: number; y: number }) => {
        if (!graph.value) return;

        // Mapea coordenadas SVG a DOM
        const domPoint = graph.value.translateFromSvgToDomCoordinates(nodeLayout);

        // Ajusta posición del tooltip para que quede arriba del nodo
        const offsetY = 140; // Desplazamiento hacia arriba (ajusta según el tamaño de tus nodos y tooltip)
        tooltipPos.value = {
            left: `${domPoint.x}px`,
            top: `${domPoint.y - offsetY}px`,
        };
    };

    // Configuración del grafo
    const configs = reactive({
        node: data.configs.node,
        edge: data.configs.edge,
        view: {
            panEnabled: true,
            zoomEnabled: true,
            zoomMin: 0.5,
            zoomMax: 1,
            backgroundColor: "#f8f9fa",
        },
    });

    // Sincronización de nodos y layouts
    const onNodeMoved = (nodeId: string, newPosition: { x: number; y: number }) => {
        if (nodes[nodeId]) {
            nodes[nodeId].x = newPosition.x;
            nodes[nodeId].y = newPosition.y;
            layouts.nodes[nodeId] = { x: newPosition.x, y: newPosition.y };
        }
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
        const edgeId = `edge${nextEdgeIndex.value}`; // Corregido: añadiendo comillas
        // Definir el color de la arista
        const edgeColor = "#002C48"; // Puedes cambiar el color según sea necesario
        edges[edgeId] = { source, target, color: edgeColor };
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

            // Restaurar nodos y aristas de forma reactiva
            for (const nodeId in savedNodes) {
                nodes[nodeId] = savedNodes[nodeId];
            }
            for (const edgeId in savedEdges) {
                edges[edgeId] = savedEdges[edgeId];
            }

            // Restaurar los índices para evitar la sobrescritura
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
    }
</style>
