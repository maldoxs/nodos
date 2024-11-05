<script setup lang="ts">
    import { reactive, ref, watch, computed } from "vue";
    import { VNetworkGraph } from "v-network-graph";
    import "v-network-graph/lib/style.css";
    import { ForceLayout } from "v-network-graph/lib/force-layout";
    import data from "./data"; // Importa los datos de configuración

    // Configuración inicial para nodos y aristas
    const nodes = reactive({ ...data.nodes });
    const edges = reactive({ ...data.edges });
    const layouts = ref(data.layouts);

    // Extrae la configuración desde el objeto de datos
    const configs = reactive({
        node: data.configs.node,
        edge: data.configs.edge,
        view: {
            layoutHandler: new ForceLayout(), // Inicializa con ForceLayout
            panEnabled: true, // Permite hacer pan (arrastrar el gráfico completo)
            zoomEnabled: false, // Permite hacer zoom
            zoomMin: 0.5, // Nivel mínimo de zoom
            zoomMax: 1, // Nivel máximo de zoom
            backgroundColor: "#f8f9fa", // Color de fondo del gráfico
        },
    });

    // Índices para el próximo nodo y arista
    const nextNodeIndex = ref(Object.keys(nodes).length + 1);
    const nextEdgeIndex = ref(Object.keys(edges).length + 1);

    // Selección de nodos y aristas
    const selectedNodes = ref<string[]>([]);
    const selectedEdges = ref<string[]>([]);

    // Estado para habilitar el diseño forzado
    const d3ForceEnabled = ref(false);

    // Computed para manejar el diseño
    watch(d3ForceEnabled, (value) => {
        configs.view.layoutHandler = value ? new ForceLayout() : new vNG.SimpleLayout();
    });

    // Función para agregar un nodo
    const addNode = () => {
        const nodeId = `node${nextNodeIndex.value}`;
        nodes[nodeId] = { name: `N${nextNodeIndex.value}` };
        nextNodeIndex.value++;
    };

    // Función para eliminar nodos seleccionados
    const removeNode = () => {
        selectedNodes.value.forEach((nodeId) => delete nodes[nodeId]);
    };

    // Función para agregar una arista entre dos nodos seleccionados
    const addEdge = () => {
        if (selectedNodes.value.length === 2) {
            const [source, target] = selectedNodes.value;
            edges[`edge${nextEdgeIndex.value}`] = { source, target };
            nextEdgeIndex.value++;
        }
    };

    // Función para eliminar aristas seleccionadas
    const removeEdge = () => {
        selectedEdges.value.forEach((edgeId) => delete edges[edgeId]);
    };

    // Nueva funcionalidad para actualizar el nombre del nodo
    const newNodeName = ref("");
    const updateNodeName = () => {
        if (selectedNodes.value.length === 1) {
            const nodeId = selectedNodes.value[0];
            nodes[nodeId].name = newNodeName.value;
            newNodeName.value = "";
        } else {
            alert("Por favor selecciona un único nodo para renombrarlo.");
        }
    };
</script>

<template>
    <div class="container mt-5">
        <div class="row mb-3">
            <div class="col">
                <label class="form-label">Nodo:</label>
                <button class="btn btn-primary btn-sm mx-1" @click="addNode">Añadir Nodo</button>
                <button
                    class="btn btn-danger btn-sm mx-1"
                    :disabled="selectedNodes.length === 0"
                    @click="removeNode">
                    Eliminar Nodo
                </button>
            </div>
            <div class="col">
                <label class="form-label">Arista:</label>
                <button
                    class="btn btn-primary btn-sm mx-1"
                    :disabled="selectedNodes.length !== 2"
                    @click="addEdge">
                    Añadir Arista
                </button>
                <button
                    class="btn btn-danger btn-sm mx-1"
                    :disabled="selectedEdges.length === 0"
                    @click="removeEdge">
                    Eliminar Arista
                </button>
            </div>
            <div class="col">
                <div class="form-check">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        id="d3ForceCheckbox"
                        v-model="d3ForceEnabled" />
                    <label class="form-check-label" for="d3ForceCheckbox">
                        D3-Force habilitado
                    </label>
                </div>
            </div>
            <div class="col">
                <input
                    type="text"
                    v-model="newNodeName"
                    class="form-control form-control-sm"
                    placeholder="Renombrar Nodo" />
                <button
                    class="btn btn-secondary btn-sm mt-2"
                    @click="updateNodeName"
                    :disabled="selectedNodes.length !== 1">
                    Cambiar Nombre
                </button>
            </div>
        </div>

        <div class="network-graph-container bg-light rounded shadow-sm p-3">
            <v-network-graph
                v-model:selected-nodes="selectedNodes"
                v-model:selected-edges="selectedEdges"
                :nodes="nodes"
                :edges="edges"
                :layouts="layouts"
                :configs="configs" />
        </div>

        <div class="mt-5 mb-5">
            <h1>Descripción</h1>
            <table class="dictionary">
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
                        <td>
                            Un nodo representa un punto en el gráfico. Puede ser un objeto, una
                            entidad o cualquier elemento que desees visualizar.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="line"></div>
                            Arista
                        </td>
                        <td>
                            Una conexión (o arista) representa la relación entre dos nodos. Se
                            utiliza para mostrar interacciones o vínculos.
                        </td>
                    </tr>
                    <tr>
                        <td>D3-Force</td>
                        <td>
                            Permite que los nodos se distribuyan de manera que la visualización sea
                            más clara y comprensible.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
    .network-graph-container {
        height: 700px;
        width: 100%;
        border: 2px solid #dee2e6;
        border-radius: 10px;
        background-color: #ffffff;
        padding: 20px;
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
        background-color: #007bff;
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
        width: 40px; /* Ajusta la longitud de la línea */
        height: 2px; /* Ajusta el grosor de la línea */
        background-color: #007bff;
        display: inline-block;
        margin-right: 8px;
        vertical-align: middle;
    }
</style>
