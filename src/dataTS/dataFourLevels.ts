// dataFourLevels.ts
import * as vNG from "v-network-graph"

/* ---------------- Tipos ---------------- */
export interface TreeNode extends vNG.Node {
  id: string
  name: string
  collapse?: boolean
  children?: Record<string, TreeNode>
}
export type TreeNodes = Record<string, TreeNode>

/* ------------- 1) Árbol de nodos -------------- */
export const nodeTree: TreeNodes = {
  root: {
    id: "root",
    name: "Padre",
    collapse: false,
    children: {
      child1: {
        id: "root/child1",
        name: "Hijo 1",
        collapse: false,
        children: {
          grand1: {
            id: "root/child1/grand1",
            name: "Nieto 1",
            collapse: false,
            /* ⚫︎ 4.º nivel: bisnietos */
            children: {
              ggrand1: {
                id: "root/child1/grand1/ggrand1",
                name: "Bisnieto A",
              },
              ggrand2: {
                id: "root/child1/grand1/ggrand2",
                name: "Bisnieto B",
              },
            },
          },
          grand2: { id: "root/child1/grand2", name: "Nieto 2" },
          grand3: { id: "root/child1/grand3", name: "Nieto 3" },
        },
      },
      child2: { id: "root/child2", name: "Hijo 2" },
      child3: { id: "root/child3", name: "Hijo 3" },
      child4: { id: "root/child4", name: "Hijo 4" },
    },
  },
}

/* ------------- 2) Aristas --------------------- */
/* Regla: crea una arista por relación padre → hijo */
export const edges: vNG.Edges = {
  /* nivel 1 */
  e01: { source: "root", target: "root/child1" },
  e02: { source: "root", target: "root/child2" },
  e03: { source: "root", target: "root/child3" },
  e04: { source: "root", target: "root/child4" },

  /* nivel 2 */
  e11: { source: "root/child1", target: "root/child1/grand1" },
  e12: { source: "root/child1", target: "root/child1/grand2" },
  e13: { source: "root/child1", target: "root/child1/grand3" },

  /* nivel 3 */
  e21: { source: "root/child1/grand1", target: "root/child1/grand1/ggrand1" },
  e22: { source: "root/child1/grand1", target: "root/child1/grand1/ggrand2" },
}

/* ------------- 3) Posiciones iniciales -------- */
/* Valores aproximados; el ForceLayout los ajustará */
export const layouts: vNG.Layouts = {
  nodes: {
    /* padre */
    root: { x: 0, y: 0 },

    /* hijos */
    "root/child1": { x: -140, y: 140 },
    "root/child2": { x: 0,    y: 180 },
    "root/child3": { x: 140,  y: 140 },

    /* nietos (bajo child1) */
    "root/child1/grand1": { x: -220, y: 260 },
    "root/child1/grand2": { x: -140, y: 300 },
    "root/child1/grand3": { x: -60,  y: 260 },

    /* bisnietos (bajo grand1) */
    "root/child1/grand1/ggrand1": { x: -260, y: 380 },
    "root/child1/grand1/ggrand2": { x: -180, y: 400 },
  },
}
