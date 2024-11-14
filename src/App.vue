<!-- <script setup lang="ts">
    import { reactive, ref, onMounted } from "vue";
    import * as vNG from "v-network-graph";
    import { VNetworkGraph } from "v-network-graph";
    import data from "./data";
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
        const nodeId = `node${nextNodeIndex.value}`;

        const name = `N${nextNodeIndex.value}`;

        nodes[nodeId] = { name };
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
            nodes: { ...nodes },
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
</script> -->

<template>
    <div class="container p-3 mb-4 pt-0">
        <nav class="p-3">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </nav>
        <router-view></router-view>
    </div>
</template>
