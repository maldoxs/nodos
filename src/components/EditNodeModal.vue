<script setup lang="ts">
    const props = defineProps<{
        show: boolean;
        node: {
            nodeId: string;
            nombre: string;
            rut: string;
            tipo: string;
            capitalEnterado: number;
            lineaNegocio: string;
        };
        onClose: () => void;
        onConfirm: (data: any) => void;
    }>();

    import { reactive, watch } from "vue";

    const editNodeForm = reactive({
        nodeId: "",
        nombre: "",
        rut: "",
        tipo: "",
        capitalEnterado: 0,
        lineaNegocio: "",
    });

    // Cada vez que cambia la prop show, actualiza el form:
    watch(
        () => props.show,
        (visible) => {
            if (visible && props.node) {
                Object.assign(editNodeForm, props.node);
            }
        },
        { immediate: true }
    );

    function confirmar() {
        if (!editNodeForm.nombre || !editNodeForm.rut) {
            alert("Por favor completa al menos el nombre y el RUT.");
            return;
        }
        props.onConfirm({ ...editNodeForm });
    }

    function cerrar() {
        props.onClose();
    }

    watch(
        () => props.show,
        (visible) => {
            console.log("Modal show changed:", visible, props.node);
            if (visible && props.node) {
                Object.assign(editNodeForm, props.node);
            }
        },
        { immediate: true }
    );
</script>

<template>
    <Teleport to="body">
        <Teleport to="body">
            <div>EDIT NODE MODAL VISIBLE {{ show }}</div>
            ...
        </Teleport>
        <div v-if="show" class="custom-modal-overlay">
            <div class="custom-modal-dialog">
                <div class="custom-modal-content">
                    <div class="custom-modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-pencil-square text-primary"></i> Editar Nodo
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="cerrar"
                            aria-label="Close"></button>
                    </div>
                    <div class="custom-modal-body">
                        <div class="mb-2">
                            <label>Nombre:</label>
                            <input
                                v-model="editNodeForm.nombre"
                                type="text"
                                class="form-control form-control-sm" />
                        </div>
                        <div class="mb-2">
                            <label>RUT:</label>
                            <input
                                v-model="editNodeForm.rut"
                                type="text"
                                class="form-control form-control-sm" />
                        </div>
                        <div class="mb-2">
                            <label>Tipo:</label>
                            <input
                                v-model="editNodeForm.tipo"
                                type="text"
                                class="form-control form-control-sm" />
                        </div>
                        <div class="mb-2">
                            <label>Capital Enterado:</label>
                            <input
                                v-model.number="editNodeForm.capitalEnterado"
                                type="number"
                                class="form-control form-control-sm" />
                        </div>
                        <div class="mb-2">
                            <label>Línea de Negocio:</label>
                            <input
                                v-model="editNodeForm.lineaNegocio"
                                type="text"
                                class="form-control form-control-sm" />
                        </div>
                    </div>
                    <div class="custom-modal-footer">
                        <button class="btn btn-warning text-white" type="button" @click="cerrar">
                            Cancelar
                        </button>
                        <button class="btn btn-primary" type="button" @click="confirmar">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
    .custom-modal-overlay {
        position: fixed;
        z-index: 5000 !important;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .custom-modal-dialog {
        background: white;
        border-radius: 7px;
        box-shadow: 0 12px 64px 0 rgba(0, 0, 0, 0.16);
        width: 400px;
        max-width: 98vw;
        animation: popIn 0.15s;
    }
    @keyframes popIn {
        from {
            transform: scale(0.9);
            opacity: 0.5;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    .custom-modal-content {
        padding: 18px 24px 16px 24px;
    }
    .custom-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        padding-bottom: 6px;
        margin-bottom: 12px;
    }
    .custom-modal-footer {
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        margin-top: 14px;
    }
</style>
