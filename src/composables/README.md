# 🧩 Composables de Grafo Empresarial — Vue 3 + v-network-graph

Esta carpeta contiene los **composables** reutilizables y centralizados para la gestión del grafo interactivo en la aplicación.

## 📦 ¿Qué es un composable?

Un composable es una función que encapsula estado reactivo, lógica o utilidades, diseñada para ser usada con la Composition API de Vue 3. Permite **reutilizar, organizar y desacoplar** lógica compleja en archivos pequeños y fáciles de mantener.

---

## ✨ Composables principales

### 1. `useGraphState.ts`
Gestiona el **estado central del grafo**:
- Nodos y aristas (edges), layouts, índices incrementales y selección de elementos.
- Provee acceso centralizado, reactivo y seguro al "core" de la red.

### 2. `useGraphConfigs.ts`
Define y centraliza la **configuración visual y de layout**:
- Estilos de nodos, aristas y la vista.
- Permite alternar entre ForceLayout (d3) y SimpleLayout.
- Maneja el evento de movimiento de nodos (`onNodeMoved`).


- **useGraphTooltips**
  Lógica de tooltips para nodos y aristas, manejo de refs, posiciones, apertura/cierre.

---

## 🛠️ ¿Cómo usar un composable en tu componente?

```ts
import { useGraphState } from "@/composables/useGraphState";
const { nodes, edges, layouts, selectedNodes } = useGraphState();

import { useGraphConfigs } from "@/composables/useGraphConfigs";
const { configs, d3ForceEnabled, onNodeMoved } = useGraphConfigs();
