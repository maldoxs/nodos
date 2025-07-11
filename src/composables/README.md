# 🧩 Composables de Grafo Empresarial — Vue 3 + v-network-graph

Esta carpeta contiene los **composables** reutilizables y centralizados para la gestión del grafo interactivo en la aplicación.

---

## 💡 ¿Qué es un composable?

Un composable es una función que encapsula **estado reactivo, lógica o utilidades**, diseñada para la Composition API de Vue 3.
Permite **reutilizar, organizar y desacoplar** lógica compleja en archivos pequeños y fáciles de mantener.

---

## ✨ Composables principales

### 🟦 `useGraphState.ts`
- **Gestiona el estado central del grafo**:
  - Nodos (`nodes`)
  - Aristas (`edges`)
  - Layouts (`layouts`)
  - Índices (`nextNodeIndex`, `nextEdgeIndex`)
  - Selección actual (`selectedNodes`, `selectedEdges`)
- **Acceso centralizado y reactivo** al core del grafo.

---

### 🟩 `useGraphConfigs.ts`
- **Centraliza la configuración visual y lógica del layout**:
  - Estilos de nodos, aristas y vista (`configs`)
  - Alternancia entre layouts:
    - `ForceLayout` (D3)
    - `SimpleLayout`
  - Evento de movimiento de nodo: `onNodeMoved`

---

### 🟨 `useGraphTooltips.ts`
- **Gestiona tooltips persistentes** para nodos y aristas:
  - Posiciones, visibilidad y contenido reactivo de tooltips.
  - Métodos:
    - `showNodeTooltip`
    - `showEdgeTooltip`
    - `closeTooltip`
  - Estado reactivo para tooltip de nodo y de arista.

---

### 🟧 `useGraphCrud.ts`
- **Centraliza operaciones CRUD del grafo**:
  - **Nodos**: `addNode`, `openEditNodeModal`, `handleConfirmEditNode`, `removeNode`, `handleRemoveNode`, `updateNodeName`
  - **Aristas**: `addEdge`, `handleCreateEdge`, `removeEdge`, `handleRemoveEdge`
  - **Persistencia**: `saveNodes`, `loadNodes`
- Incluye **prompts de confirmación** y mensajes SweetAlert para interacción segura.

---

### 🟪 `useNodeModal.ts`
- **Controla el estado de los modales para nodos**:
  - Estado y helpers para abrir/cerrar el modal de edición (`showEditNodeModal`, `openEditNodeModal`, etc.)
  - Estado y helpers para abrir/cerrar el modal de creación (`showAddNodeModal`, `openAddNodeModal`, etc.)
  - Objeto reactivo de datos para edición (`editNodeData`)

---

## 🛠️ ¿Cómo usar un composable en tu componente?

```ts
import { useGraphState } from "@/composables/useGraphState";
const { nodes, edges, layouts, selectedNodes } = useGraphState();

import { useGraphConfigs } from "@/composables/useGraphConfigs";
const { configs, d3ForceEnabled, onNodeMoved } = useGraphConfigs();

import { useGraphTooltips } from "@/composables/useGraphTooltips";
const { showNodeTooltip, closeTooltip, ... } = useGraphTooltips(graph, layouts);

import { useGraphCrud } from "@/composables/useGraphCrud";
const { addNode, handleRemoveNode, saveNodes, ... } = useGraphCrud({ ... });

import { useNodeModal } from "@/composables/useNodeModal";
const { showEditNodeModal, editNodeData, openEditNodeModal, ... } = useNodeModal();



## 🏗️ Resumen de arquitectura de composables

| Composable         | Responsabilidad principal                      |
|--------------------|------------------------------------------------|
| 🟦 `useGraphState`     | **Fuente de la verdad**. Estado reactivo global del grafo: nodos, aristas, layouts, selección.        |
| 🟩 `useGraphConfigs`   | **Lógica visual y layout**. Configuración visual, alternancia de layouts y movimiento de nodos.        |
| 🟧 `useGraphCrud`      | **Operaciones y helpers CRUD**. Alta/baja/modificación de nodos y aristas, persistencia y prompts.      |
| 🟨 `useGraphTooltips`  | **Control de tooltips custom**. Visibilidad, posición, apertura/cierre y datos de tooltips.             |
| 🟪 `useNodeModal`      | **Gestión de modales de edición/creación** de nodos. Controla estado y datos para formularios de nodos.  |
