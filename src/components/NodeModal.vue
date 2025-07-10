<script setup lang="ts">
    const props = defineProps<{
        show: boolean;
        onClose: () => void;
        onConfirm: (data: {
            nombre: string;
            rut: string;
            tipo: string;
            capitalEnterado: number;
            lineaNegocio: string;
        }) => void;
    }>();

    import { reactive, watch } from "vue";

    // Estado local del formulario
    const newNodeForm = reactive({
        nombre: "",
        rut: "",
        tipo: "",
        capitalEnterado: 0,
        lineaNegocio: "",
    });

    // Resetear el form cada vez que se abre el modal
    watch(
        () => props.show,
        (visible) => {
            if (visible) {
                newNodeForm.nombre = "";
                newNodeForm.rut = "";
                newNodeForm.tipo = "";
                newNodeForm.capitalEnterado = 0;
                newNodeForm.lineaNegocio = "";
            }
        }
    );

    function confirmar() {
        if (!newNodeForm.nombre || !newNodeForm.rut) {
            alert("Por favor completa al menos el nombre y el RUT.");
            return;
        }
        props.onConfirm({ ...newNodeForm });
    }
    function cerrar() {
        props.onClose();
    }
</script>

<template>
    <div>
        <div
            v-if="show"
            class="modal fade show"
            tabindex="-1"
            style="display: block"
            aria-modal="true"
            role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-plus-circle text-warning"></i> Crear Nodo
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="cerrar"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-2">
                            <label>Nombre:</label>
                            <input
                                v-model="newNodeForm.nombre"
                                type="text"
                                class="form-control form-control-sm"
                                autocomplete="off" />
                        </div>
                        <div class="mb-2">
                            <label>RUT:</label>
                            <input
                                v-model="newNodeForm.rut"
                                type="text"
                                class="form-control form-control-sm"
                                autocomplete="off" />
                        </div>
                        <div class="mb-2">
                            <label>Tipo:</label>
                            <input
                                v-model="newNodeForm.tipo"
                                type="text"
                                class="form-control form-control-sm"
                                autocomplete="off" />
                        </div>
                        <div class="mb-2">
                            <label>Capital Enterado:</label>
                            <input
                                v-model.number="newNodeForm.capitalEnterado"
                                type="number"
                                class="form-control form-control-sm"
                                autocomplete="off" />
                        </div>
                        <div class="mb-2">
                            <label>Línea de Negocio:</label>
                            <input
                                v-model="newNodeForm.lineaNegocio"
                                type="text"
                                class="form-control form-control-sm"
                                autocomplete="off" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-warning text-white" type="button" @click="cerrar">
                            Cancelar
                        </button>
                        <button class="btn btn-primary" type="button" @click="confirmar">
                            Crear Nodo
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Backdrop FUERA del modal principal -->
        <div v-if="show" class="modal-backdrop fade show"></div>
    </div>
</template>

<style scoped>
    .modal {
        z-index: 1060;
    }
    .modal-backdrop {
        z-index: 1050;
    }
</style>
