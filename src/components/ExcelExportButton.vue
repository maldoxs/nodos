<script setup lang="ts">
    import { defineProps } from "vue";
    import ExcelJS from "exceljs";
    import { saveAs } from "file-saver";

    // 1) Defino las props que vienen desde el padre
    const props = defineProps<{
        isBoxMode: boolean;
        selectedNodes: string[];
        nodes: Record<string, any>;
        layouts: Record<string, { x: number; y: number }>;
    }>();

    /**
     * exportToExcel
     *
     * Exporta los nodos seleccionados a un archivo .xlsx.
     * Utiliza ExcelJS para generar el workbook y File‑Saver para descargar el archivo.
     */
    const exportToExcel = async () => {
        // Validación: sólo en modo “Selección por Caja” y con al menos un nodo seleccionado
        if (!props.isBoxMode || props.selectedNodes.length === 0) {
            alert("No hay nodos seleccionados para exportar.");
            return;
        }

        // 2.1) Títulos
        const headers = [
            "ID",
            "Nombre",
            "RUT",
            "Tipo",
            "Capital Enterado",
            "Línea de Negocio",
            "X",
            "Y",
        ];

        // 2.2) Filas
        const rows = props.selectedNodes.map((id) => {
            const n = props.nodes[id]; // Datos del nodo
            const lay = props.layouts[id]; // Posición del nodo en el layout
            return [
                id,
                n.name,
                n.data?.rut ?? "",
                n.data?.tipo ?? "",
                n.data?.capitalEnterado ?? 0,
                n.data?.lineaNegocio ?? "",
                lay.x.toFixed(2),
                lay.y.toFixed(2),
            ];
        });

        // 3) Crear el libro (Workbook) y la hoja (Worksheet)
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Nodos");

        // 4) Añadir la fila de encabezados a la hoja
        ws.addRow(headers);

        // 5) Estilo cabecera
        ws.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "D3D3D3" },
            };
            cell.font = { bold: true };
        });

        // 6) Insertar las filas de datos subsiguientess
        rows.forEach((r) => ws.addRow(r));

        // 7) Serializar el workbook a un ArrayBuffer
        const buf = await wb.xlsx.writeBuffer();
        // 8) Crear un Blob y disparar la descarga con File‑Saver
        const blob = new Blob([buf], { type: "application/octet-stream" });
        saveAs(blob, "nodos_seleccionados.xlsx");
    };
</script>

<template>
    <button
        v-if="isBoxMode"
        class="sii-btn sii-btn-primary btn-sm"
        @click="exportToExcel"
        :disabled="!isBoxMode">
        Exportar a Excel
    </button>
</template>
