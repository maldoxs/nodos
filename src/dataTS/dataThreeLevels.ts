// dataThreeLevels.ts
import * as vNG from "v-network-graph"

export interface TreeNode extends vNG.Node {
  id: string
  name: string
  collapse?: boolean
  children?: Record<string, TreeNode>
}
export type TreeNodes = Record<string, TreeNode>

/* --- 1) Estructura jerárquica ----------------------------------------- */
export const nodeTree: TreeNodes = {
  root: {
    id: "root",
    name: "Nodo Padre",
    collapse: false,
    children: {
      child1: {
        id: "root/child1",
        name: "Hijo 1",
        collapse: false,
        /* ← tercer nivel: tres nietos */
        children: {
          grand1: { id: "root/child1/grand1", name: "Nieto 1" },
          grand2: { id: "root/child1/grand2", name: "Nieto 2" },
          grand3: { id: "root/child1/grand3", name: "Nieto 3" },
        },
      },
      child2: { id: "root/child2", name: "Hijo 2" },
      child3: { id: "root/child3", name: "Hijo 3" },
    },
  },
}

/* --- 2) Aristas -------------------------------------------------------- */
/*  ▸ Una arista por relación padre-hijo                                     */
/*  ▸ Si añades más niveles repite la regla                                 */
export const edges: vNG.Edges = {
  /* nivel 1 */
  e1: { source: "root", target: "root/child1" },
  e2: { source: "root", target: "root/child2" },
  e3: { source: "root", target: "root/child3" },
  /* nivel 2 (nietos) */
  e1a: { source: "root/child1", target: "root/child1/grand1" },
  e1b: { source: "root/child1", target: "root/child1/grand2" },
  e1c: { source: "root/child1", target: "root/child1/grand3" },
}

/* --- 3) Posiciones iniciales (layouts) -------------------------------- */
export const layouts: vNG.Layouts = {
  nodes: {
    /* padre */
    root: { x: 0, y: 0 },

    /* hijos */
    "root/child1": { x: -120, y: 120 },
    "root/child2": { x: 0,   y: 150 },
    "root/child3": { x: 120, y: 120 },

    /* nietos (cerca de child1) */
    "root/child1/grand1": { x: -200, y: 240 },
    "root/child1/grand2": { x: -120, y: 260 },
    "root/child1/grand3": { x: -40,  y: 240 },
  },
}
