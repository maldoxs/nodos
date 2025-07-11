// src/composables/useGraphCrud.ts
import Swal from "sweetalert2";
import { nextTick } from "vue";

/**
 * Composable centralizado para operaciones CRUD de nodos y aristas.
 * Recibe el estado reactivo del grafo y retorna métodos CRUD y helpers.
 */
export function useGraphCrud({
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
}) {
    // --- 1. AGREGAR NODO ---
    function addNode(nombre, rut, tipo, capitalEnterado, lineaNegocio) {
        const nodeId = `node${nextNodeIndex.value}`;
        const x = Math.random() * 400;
        const y = Math.random() * 400;
        nodes[nodeId] = {
            name: nombre ?? "",
            x, y,
            size: 15,
            color: "#0064a0",
            label: true,
            data: { rut, tipo, capitalEnterado, lineaNegocio },
            icon: "&#xe7fd;",
        };
        layouts.nodes[nodeId] = { x, y };
        nextNodeIndex.value++;
    }
    // -----------------------------------------

    // --- 2. EDITAR NODO: abre modal con los datos del nodo seleccionado ---
    function openEditNodeModal(tooltipData) {
        Object.assign(editNodeData, {
            nodeId: tooltipData.id,
            nombre: tooltipData.name ?? "",
            rut: tooltipData.data?.rut ?? "",
            tipo: tooltipData.data?.tipo ?? "",
            capitalEnterado: tooltipData.data?.capitalEnterado ?? 0,
            lineaNegocio: tooltipData.data?.lineaNegocio ?? "",
        });
        showEditNodeModal.value = true;
    }
    // -----------------------------------------

    // --- 3. CONFIRMAR EDICIÓN DE NODO (con alerta de seguridad) ---
    function handleConfirmEditNode(data) {
        showEditNodeModal.value = false; // Cierra el modal antes del Swal
        nextTick(() => {
            Swal.fire({
                title: "¿Está seguro de editar este nodo?",
                text: "Se actualizarán los datos del nodo seleccionado.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, guardar cambios",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
                customClass: {
                    popup: "sii-swal-popup",
                    header: "sii-swal-header-info",
                    icon: "sii-swal-icon",
                    confirmButton: "sii-swal-confirm-btn",
                    cancelButton: "sii-swal-cancel-btn",
                    closeButton: "sii-swal-close-btn",
                } as any,
            }).then((result) => {
                if (result.isConfirmed) {
                    const nodeId = data.nodeId;
                    if (nodes[nodeId] && nodes[nodeId].data) {
                        nodes[nodeId].name = data.nombre;
                        nodes[nodeId].data.rut = data.rut ?? "";
                        nodes[nodeId].data.tipo = data.tipo ?? "";
                        nodes[nodeId].data.capitalEnterado = data.capitalEnterado ?? 0;
                        nodes[nodeId].data.lineaNegocio = data.lineaNegocio ?? "";
                        closeTooltip("node");
                        Swal.fire({
                            icon: "success",
                            title: "¡Nodo actualizado!",
                            text: "El nodo ha sido editado correctamente.",
                            iconColor: "#20c997",
                            background: "#FFFFFF",
                            confirmButtonText: "Cerrar",
                            customClass: {
                                popup: "sii-swal-popup",
                                header: "sii-swal-header-info",
                                icon: "sii-swal-icon",
                                confirmButton: "sii-swal-confirm-btn",
                                closeButton: "sii-swal-close-btn",
                            } as any,
                        });
                    }
                }
            });
        });
    }
    // -----------------------------------------

    // --- 4. ELIMINAR NODO (sincrónico, elimina seleccionados) ---
    function removeNode() {
        for (const nodeId of selectedNodes.value) {
            delete nodes[nodeId];
        }
        selectedNodes.value = [];
    }

    // --- 5. MANEJAR BOTÓN ELIMINAR NODO (con alerta) ---
    function handleRemoveNode() {
        if (selectedNodes.value.length === 0) {
            return Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "Para eliminar un nodo primero debe seleccionarlo",
                iconColor: "#FF4F4F",
                background: "#FFFFFF",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: "sii-swal-popup",
                    header: "sii-swal-header-error",
                    icon: "sii-swal-icon",
                    confirmButton: "sii-swal-confirm-btn",
                    closeButton: "sii-swal-close-btn",
                } as any,
            });
        }
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se eliminará el nodo seleccionado.",
            icon: "warning",
            iconColor: "#FF4F4F",
            background: "#FFFFFF",
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí, eliminar",
            customClass: {
                popup: "sii-swal-popup",
                header: "sii-swal-header-error",
                icon: "sii-swal-icon",
                confirmButton: "sii-swal-confirm-btn",
                cancelButton: "sii-swal-cancel-btn",
                closeButton: "sii-swal-close-btn",
            } as any,
        }).then((result) => {
            if (!result.isConfirmed) return;
            removeNode();
            Swal.fire({
                icon: "success",
                title: "¡Eliminado!",
                text: "El nodo ha sido eliminado.",
                iconColor: "#20c997",
                background: "#FFFFFF",
                confirmButtonText: "Cerrar",
                customClass: {
                    popup: "sii-swal-popup",
                    header: "sii-swal-header-info",
                    icon: "sii-swal-icon",
                    confirmButton: "sii-swal-confirm-btn",
                    closeButton: "sii-swal-close-btn",
                } as any,
            });
        });
    }
    // -----------------------------------------

    // --- 6. AGREGAR ARISTA (dos prompts anidados: participación y utilidades) ---
    function addEdge() {
        if (selectedNodes.value.length !== 2) return;
        const [source, target] = selectedNodes.value;
        Swal.fire({
            title: "Porcentaje de Participación",
            input: "number",
            inputLabel: "Ingrese el porcentaje de participación:",
            inputValue: 0,
            inputAttributes: { min: "0", max: "100", step: "0.01" },
            showCancelButton: true,
            confirmButtonText: "Siguiente",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (!result.isConfirmed) return;
            const porcentajeParticipacion = parseFloat(result.value || "0");
            Swal.fire({
                title: "Porcentaje de Utilidades",
                input: "number",
                inputLabel: "Ingrese el porcentaje de participación en utilidades:",
                inputValue: 0,
                inputAttributes: { min: "0", max: "100", step: "0.01" },
                showCancelButton: true,
                confirmButtonText: "Crear",
                cancelButtonText: "Cancelar",
            }).then((result2) => {
                if (!result2.isConfirmed) return;
                const porcentajeParticipacionUtilidades = parseFloat(result2.value || "0");
                const edgeId = `edge${nextEdgeIndex.value}`;
                edges[edgeId] = {
                    source, target,
                    color: "#002C48",
                    porcentajeParticipacion,
                    porcentajeParticipacionUtilidades,
                };
                nextEdgeIndex.value++;
                Swal.fire({
                    icon: "success",
                    title: "¡Arista creada!",
                    text: "La arista ha sido creada exitosamente.",
                    iconColor: "#20c997",
                    background: "#FFFFFF",
                    confirmButtonText: "Cerrar",
                });
            });
        });
    }
    // -----------------------------------------

    // --- 7. MANEJAR BOTÓN CREAR ARISTA (alerta si no hay selección, llama a addEdge si OK) ---
    function handleCreateEdge() {
        if (selectedNodes.value.length !== 2) {
            return Swal.fire({
                icon: "info",
                title: "Modo creación",
                text: "Para crear una arista mantén presionada la tecla Shift mientras haces clic en dos nodos (primero uno, luego otro).",
                iconColor: "#0F69B4",
                background: "#FFFFFF",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: "sii-swal-popup",
                    header: "sii-swal-header-info",
                    icon: "sii-swal-icon",
                    confirmButton: "sii-swal-confirm-btn",
                    closeButton: "sii-swal-close-btn",
                } as any,
            });
        }
        addEdge();
    }
    // -----------------------------------------

    // --- 8. ELIMINAR ARISTA (sincrónico, elimina seleccionadas) ---
    function removeEdge() {
        for (const edgeId of selectedEdges.value) {
            delete edges[edgeId];
        }
        selectedEdges.value = [];
    }
    // --- 9. MANEJAR BOTÓN ELIMINAR ARISTA (con alerta) ---
    function handleRemoveEdge() {
        if (selectedEdges.value.length === 0) {
            return Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "Para eliminar una arista primero debe seleccionarla",
                iconColor: "#FF4F4F",
                background: "#FFFFFF",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: "sii-swal-popup",
                    header: "sii-swal-header-error",
                    icon: "sii-swal-icon",
                    confirmButton: "sii-swal-confirm-btn",
                    closeButton: "sii-swal-close-btn",
                } as any,
            });
        }
        Swal.fire({
            title: "¿Eliminar arista?",
            text: "Se eliminará la(s) arista(s) seleccionada(s).",
            icon: "warning",
            iconColor: "#FF4F4F",
            background: "#FFFFFF",
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí, eliminar",
            customClass: {
                popup: "sii-swal-popup",
                header: "sii-swal-header-error",
                icon: "sii-swal-icon",
                confirmButton: "sii-swal-confirm-btn",
                cancelButton: "sii-swal-cancel-btn",
                closeButton: "sii-swal-close-btn",
            } as any,
        }).then((r) => {
            if (!r.isConfirmed) return;
            removeEdge();
            Swal.fire({
                icon: "success",
                title: "¡Arista eliminada!",
                text: "La arista ha sido eliminada.",
                iconColor: "#20c997",
                background: "#FFFFFF",
                confirmButtonText: "Cerrar",
                customClass: {
                    popup: "sii-swal-popup",
                    header: "sii-swal-header-info",
                    icon: "sii-swal-icon",
                    confirmButton: "sii-swal-confirm-btn",
                    closeButton: "sii-swal-close-btn",
                } as any,
            });
        });
    }
    // -----------------------------------------

    // --- 10. RENOMBRAR NODO (solo uno seleccionado, prompt SweetAlert) ---
    function updateNodeName() {
        if (selectedNodes.value.length === 1) {
            const nodeId = selectedNodes.value[0];
            Swal.fire({
                title: "Renombrar nodo",
                input: "text",
                inputLabel: "Nuevo nombre para el nodo:",
                inputValue: nodes[nodeId].name,
                showCancelButton: true,
                confirmButtonText: "Renombrar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    nodes[nodeId].name = result.value;
                    newNodeName.value = "";
                    Swal.fire({
                        icon: "success",
                        title: "Nodo renombrado",
                        text: "El nombre del nodo ha sido actualizado.",
                        confirmButtonText: "Cerrar",
                    });
                }
            });
        } else {
            Swal.fire({
                icon: "warning",
                title: "Selección inválida",
                text: "Por favor selecciona un único nodo para renombrarlo.",
                confirmButtonText: "Entendido",
            });
        }
    }
    // -----------------------------------------

    // --- 11. GUARDAR GRAFO (completo en localStorage, con feedback) ---
    function saveNodes() {
        const cleanNodes = {};
        for (const k in nodes) if (nodes[k]) cleanNodes[k] = nodes[k];
        const cleanEdges = {};
        for (const k in edges) if (edges[k]) cleanEdges[k] = edges[k];
        const currentGraphState = {
            nodes: cleanNodes,
            edges: cleanEdges,
            nextNodeIndex: nextNodeIndex.value,
            nextEdgeIndex: nextEdgeIndex.value,
        };
        localStorage.setItem("savedGraphState", JSON.stringify(currentGraphState));
        Swal.fire({
            icon: "success",
            title: "¡Esquema guardado!",
            text: "Nodos y aristas guardados correctamente.",
            iconColor: "#20c997",
            background: "#FFFFFF",
            showConfirmButton: false,
            timer: 1200,
            timerProgressBar: true,
            customClass: {
                popup: "sii-swal-popup",
                header: "sii-swal-header-info",
                icon: "sii-swal-icon",
                title: "sii-swal-title",
                confirmButton: "sii-swal-confirm-btn",
                closeButton: "sii-swal-close-btn",
            } as any,
        });
    }
    // -----------------------------------------

    // --- 12. CARGAR GRAFO (desde localStorage) ---
    function loadNodes() {
        const savedGraphState = localStorage.getItem("savedGraphState");
        if (savedGraphState) {
            const {
                nodes: savedNodes,
                edges: savedEdges,
                nextNodeIndex: savedNodeIndex,
                nextEdgeIndex: savedEdgeIndex,
            } = JSON.parse(savedGraphState);
            Object.keys(nodes).forEach((k) => delete nodes[k]);
            Object.keys(edges).forEach((k) => delete edges[k]);
            for (const nodeId in savedNodes) nodes[nodeId] = { ...savedNodes[nodeId] };
            for (const edgeId in savedEdges) edges[edgeId] = { ...savedEdges[edgeId] };
            nextNodeIndex.value = savedNodeIndex;
            nextEdgeIndex.value = savedEdgeIndex;
        }
    }
    // -----------------------------------------

    // --- 13. Retornar todas las funciones (puedes desestructurar al importar) ---
    return {
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
    };
}
