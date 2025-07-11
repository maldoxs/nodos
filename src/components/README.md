# 🧱 Componentes de la UI — Grafo Empresarial

Este directorio contiene los **componentes Vue 3** reutilizables para la visualización y gestión del grafo empresarial.

## 📋 Tabla de componentes

| Nombre                           | Rol / Responsabilidad principal                                                                           |
|-----------------------------------|----------------------------------------------------------------------------------------------------------|
| 🟦 **ArmaNodoGraf.vue**           | Vista principal del grafo. Muestra nodos/aristas, toolbars, tooltips, panel de acciones y exportaciones. |
| 🟧 **NodeModal.vue**              | Modal Bootstrap para **crear** un nodo. Formulario con validación de campos obligatorios.                 |
| 🟨 **EditNodeModal.vue**          | Modal personalizado para **editar** nodo existente. Actualiza atributos con validación.                   |
| 🟩 **ExcelExportButton.vue**      | Botón para exportar nodos seleccionados a Excel (`xlsx`). Solo visible en modo selección por caja.        |
| 🟫 **FormularioPersonas.vue**     | Formulario de ejemplo para alta/listado de personas, usando un JSON de base.                              |
| 🟪 **NodoExpandirContraer.vue**   | Demo: Grafo en forma de árbol, nodos colapsables/expandibles, badges y control de jerarquía.             |

---

## ✨ Descripción rápida de cada componente

### 🟦 ArmaNodoGraf.vue
- **Vista principal**: Visualización interactiva del grafo, gestión CRUD, toolbars, modales y exportación.
- Usa los composables principales para estado, tooltips, configs y CRUD.
- Integración avanzada con v-network-graph y SweetAlert2.

### 🟧 NodeModal.vue
- **Modal de creación** de nodos.
- Campos: Nombre, RUT, Tipo, Capital Enterado, Línea de Negocio.
- Validación básica y feedback visual.

### 🟨 EditNodeModal.vue
- **Modal de edición** de nodo.
- Permite actualizar cualquier campo del nodo, validando datos mínimos.
- Alerta de confirmación antes de aplicar cambios.

### 🟩 ExcelExportButton.vue
- **Botón** para exportar nodos seleccionados (modo caja) a Excel (`xlsx`).
- Implementación con ExcelJS y FileSaver.

### 🟫 FormularioPersonas.vue
- **Formulario ejemplo** para agregar/listar personas desde un JSON.
- Demuestra el uso de listas reactivas y validación sencilla.

### 🟪 NodoExpandirContraer.vue
- **Grafo tipo árbol**: permite expandir/colapsar ramas.
- Ejemplo avanzado de layouts jerárquicos y control visual de badges (+/-).

---

## 🛠️ Cómo utilizar estos componentes

Todos los componentes pueden ser importados y usados en cualquier vista del proyecto:

```vue
<template>
  <ArmaNodoGraf />
  <NodeModal ... />
  <EditNodeModal ... />
  <ExcelExportButton ... />
  <FormularioPersonas />
  <NodoExpandirContraer />
</template>
