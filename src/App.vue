<script setup lang="ts">
    import { reactive, ref } from "vue";
    import { VNetworkGraph } from "v-network-graph";
    import data from "./data";

    const nodes = reactive({ ...data.nodes });
    const edges = reactive({ ...data.edges });
    const nextNodeIndex = ref(Object.keys(nodes).length + 1);
    const nextEdgeIndex = ref(Object.keys(edges).length + 1);
    const selectedNodes = ref<string[]>([]);
    const selectedEdges = ref<string[]>([]);
    const newNodeName = ref<string>("");

    function addNode() {
        const nodeId = `node${nextNodeIndex.value}`;
        const name = `N${nextNodeIndex.value}`;
        nodes[nodeId] = { name };
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
        edges[edgeId] = { source, target };
        nextEdgeIndex.value++;
    }

    function removeEdge() {
        for (const edgeId of selectedEdges.value) {
            delete edges[edgeId];
        }
    }

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
                <!-- <div v-if="selectedNodes.length === 1" class="mt-2">
                    <input
                        type="text"
                        v-model="newNodeName"
                        @input="updateNodeName"
                        placeholder="Cambiar nombre del nodo"
                        class="form-control form-control-sm" />
                </div> -->
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
                :layouts="data.layouts"
                :configs="data.configs" />
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
