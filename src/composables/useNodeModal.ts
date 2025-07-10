// src/composables/useNodeModal.ts
import { ref, reactive } from "vue";

export function useNodeModal() {
  // Estado del modal de edición
  const showEditNodeModal = ref(false);
  const editNodeData = reactive({
    nodeId: "",
    nombre: "",
    rut: "",
    tipo: "",
    capitalEnterado: 0,
    lineaNegocio: "",
  });

  // Estado del modal de agregar
  const showAddNodeModal = ref(false);

  // Métodos simples para abrir/cerrar y setear datos
  function openEditNodeModal(tooltipData: any) {
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
  function closeEditNodeModal() {
    showEditNodeModal.value = false;
  }
  function openAddNodeModal() {
    showAddNodeModal.value = true;
  }
  function closeAddNodeModal() {
    showAddNodeModal.value = false;
  }

  return {
    showEditNodeModal,
    editNodeData,
    showAddNodeModal,
    openEditNodeModal,
    closeEditNodeModal,
    openAddNodeModal,
    closeAddNodeModal,
  };
}
