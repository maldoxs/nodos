// dataFiveLevels.ts  ───────── DEMO 5 NIVELES (Padre→Hijo→Nieto→Bisnieto→Tataranieto)
import * as vNG from "v-network-graph"

/* ---------- Tipos base ---------- */
export interface TreeNode extends vNG.Node {
  id: string
  name: string
  collapse?: boolean
  children?: Record<string, TreeNode>
}
export type TreeNodes = Record<string, TreeNode>

/* ──────────────────────────────────────────────────────────────────────────
   1) ESTRUCTURA JERÁRQUICA (nodeTree)
   ------------------------------------------------------------------------ */
export const nodeTree: TreeNodes = {
  /* ── NIVEL 1 ··· PADRE ─────────────────────────────────────────────── */
  root: {
    id: "root",
    name: "Padre",
    collapse: false,

    /* ── NIVEL 2 ··· HIJOS ──────────────────────────────────────────── */
    children: {
      child1: {
        id: "root/child1",
        name: "Hijo 1",
        collapse: false,

        /* ── NIVEL 3 ··· NIETOS ───────────────────────────────────── */
        children: {
          grand1: {
            id: "root/child1/grand1",
            name: "Nieto 1",
            collapse: false,

            /* ── NIVEL 4 ··· BISNIETOS ──────────────────────────── */
            children: {
              ggrand1: {
                id: "root/child1/grand1/ggrand1",
                name: "Bisnieto A",
                collapse: false,

                /* ── NIVEL 5 ··· TATARANIETOS ────────────────── */
                children: {
                  gggrand1: {
                    id: "root/child1/grand1/ggrand1/gggrand1",
                    name: "Tataranieto I",
                  },
                  gggrand2: {
                    id: "root/child1/grand1/ggrand1/gggrand2",
                    name: "Tataranieto II",
                  },
                },
              },
              ggrand2: {
                id: "root/child1/grand1/ggrand2",
                name: "Bisnieto B",
              },
            },
          },
          grand2: { id: "root/child1/grand2", name: "Nieto 2" },
        },
      },
      child2: { id: "root/child2", name: "Hijo 2" },
    },
  },
}

/* ──────────────────────────────────────────────────────────────────────────
   2) ARISTAS  (edges)
   Regla: ➊ crea siempre UNA arista padre→hijo, ➋ usa mismo orden de niveles.
   ------------------------------------------------------------------------ */
export const edges: vNG.Edges = {
  /* -- Nivel 1 (Padre → Hijos) */
  e01: { source: "root", target: "root/child1" },
  e02: { source: "root", target: "root/child2" },

  /* -- Nivel 2 (Hijo 1 → Nietos) */
  e11: { source: "root/child1", target: "root/child1/grand1" },
  e12: { source: "root/child1", target: "root/child1/grand2" },

  /* -- Nivel 3 (Nieto 1 → Bisnietos) */
  e21: { source: "root/child1/grand1", target: "root/child1/grand1/ggrand1" },
  e22: { source: "root/child1/grand1", target: "root/child1/grand1/ggrand2" },

  /* -- Nivel 4 (Bisnieto A → Tataranietos) */
  e31: {
    source: "root/child1/grand1/ggrand1",
    target: "root/child1/grand1/ggrand1/gggrand1",
  },
  e32: {
    source: "root/child1/grand1/ggrand1",
    target: "root/child1/grand1/ggrand1/gggrand2",
  },
}

/* ──────────────────────────────────────────────────────────────────────────
   3) LAYOUTS  (posiciones iniciales)
   Usa valores aproximados; el ForceLayout los refina.
   ------------------------------------------------------------------------ */
export const layouts: vNG.Layouts = {
  nodes: {
    /* Nivel 1 */
    root: { x: 0, y: 0 },

    /* Nivel 2 */
    "root/child1": { x: -180, y: 140 },
    "root/child2": { x: 120, y: 180 },

    /* Nivel 3 */
    "root/child1/grand1": { x: -260, y: 280 },
    "root/child1/grand2": { x: -180, y: 320 },

    /* Nivel 4 */
    "root/child1/grand1/ggrand1": { x: -340, y: 420 },
    "root/child1/grand1/ggrand2": { x: -260, y: 460 },

    /* Nivel 5 */
    "root/child1/grand1/ggrand1/gggrand1": { x: -400, y: 560 },
    "root/child1/grand1/ggrand1/gggrand2": { x: -320, y: 600 },
  },
}
