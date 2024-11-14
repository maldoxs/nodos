<template>
    <div class="container">
        <div class="card p-3 mb-3 shadow-sm">
            <div class="card-header bg-primary text-white">
                <h6 class="m-0">Panel de Acciones</h6>
            </div>
            <div class="card-body">
                <div class="row gy-3">
                    <!-- Sección de acciones de Nodo -->
                    <div class="col-md-3 d-flex flex-column align-items-start">
                        <h6 class="text-warning">Nodo</h6>
                        <div class="btn-group">
                            <button class="btn btn-primary btn-sm" @click="addNode">
                                Añadir Nodo
                            </button>
                            <button
                                class="btn btn-outline-danger btn-sm"
                                :disabled="selectedNodes.length === 0"
                                @click="removeNode">
                                Eliminar Nodo
                            </button>
                        </div>
                        <button class="btn btn-outline-success btn-sm mt-2" @click="saveNodes">
                            Guardar Nodos
                        </button>
                    </div>
                    <!-- Sección de acciones de Arista -->
                    <div class="col-md-3 d-flex flex-column align-items-start">
                        <h6 class="text-warning">Arista</h6>
                        <div class="btn-group">
                            <button
                                class="btn btn-primary btn-sm"
                                :disabled="selectedNodes.length !== 2"
                                @click="addEdge">
                                Añadir Arista
                            </button>
                            <button
                                class="btn btn-outline-danger btn-sm"
                                :disabled="selectedEdges.length === 0"
                                @click="removeEdge">
                                Eliminar Arista
                            </button>
                        </div>
                    </div>
                    <!-- Sección de cambio de nombre de nodo -->
                    <div class="col-md-3">
                        <h6 class="text-warning">Renombrar Nodo</h6>
                        <div class="input-group input-group-sm">
                            <input
                                type="text"
                                v-model="newNodeName"
                                class="form-control"
                                placeholder="Nombre del Nodo" />
                            <button
                                class="btn btn-outline-secondary"
                                @click="updateNodeName"
                                :disabled="selectedNodes.length !== 1">
                                Cambiar Nombre
                            </button>
                        </div>
                    </div>

                    <div class="col-md-3 flex-column align-items-end">
                        <h6 class="text-warning">Descargar SVG</h6>
                        <div class="btn-group">
                            <el-button type="primary" class="btn-download" @click="downloadAsSvg">
                                <el-icon><download /></el-icon>
                                <span class="btn-text">Descargar</span>
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="network-graph-container bg-light rounded shadow-sm p-3">
            <v-network-graph
                v-model:selected-nodes="selectedNodes"
                v-model:selected-edges="selectedEdges"
                :nodes="nodes"
                :edges="edges"
                :layouts="data.layouts"
                :configs="configs"
                @node-moved="onNodeMoved"
                ref="graph" />
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
    import { reactive, ref, onMounted } from "vue";
    import * as vNG from "v-network-graph";
    import { VNetworkGraph } from "v-network-graph";
    import data from "../data";
    import { Download } from "@element-plus/icons";

    const nodes = reactive({ ...data.nodes });
    const edges = reactive({ ...data.edges });
    const nextNodeIndex = ref(Object.keys(nodes).length + 1);
    const nextEdgeIndex = ref(Object.keys(edges).length + 1);
    const selectedNodes = ref<string[]>([]);
    const selectedEdges = ref<string[]>([]);
    const newNodeName = ref<string>("");
    const graph = ref<vNG.Instance | null>(null); // Inicializar con null

    // Extrae la configuración desde el objeto de datos
    const configs = reactive({
        node: data.configs.node,
        edge: data.configs.edge,
        view: {
            panEnabled: true,
            zoomEnabled: false,
            zoomMin: 0.5,
            zoomMax: 1,
            backgroundColor: "red",
        },
    });

    // Función para manejar el evento de mover nodo
    const onNodeMoved = (nodeId: string, newPosition: { x: number; y: number }) => {
        if (nodes[nodeId]) {
            nodes[nodeId].x = newPosition.x;
            nodes[nodeId].y = newPosition.y;
            console.log(
                `Nodo ${nodeId} movido a nuevas coordenadas: (${newPosition.x}, ${newPosition.y})`
            );
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
    const addNode = () => {
        const nodeId = `node${nextNodeIndex.value}`; // Crear ID único para el nodo
        const name = `Nodo ${nextNodeIndex.value}`; // Crear nombre basado en el índice del nodo
        const x = Math.random() * 400; // Coordenada aleatoria x
        const y = Math.random() * 400; // Coordenada aleatoria y

        // Crear el nodo con el nombre y las coordenadas
        nodes[nodeId] = { name, x, y };

        // Incrementar el índice del siguiente nodo
        nextNodeIndex.value++;

        // Mostrar las coordenadas del nuevo nodo en la consola
        console.log(`Nodo creado: ${name}, Coordenadas: (${x}, ${y})`);
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
        edges[edgeId] = { source, target };
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
</style>
