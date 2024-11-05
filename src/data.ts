import { Nodes, Edges, Layouts, defineConfigs } from "v-network-graph"

const nodes: Nodes = {
  node1: { name: "N1" },

}

const edges: Edges = {
  edge1: { source: "node1", target: "node2" },

}

const layouts: Layouts = {
  nodes: {
    node1: { x: 50, y: 0 },
    node2: { x: 0, y: 75 },
    node3: { x: 100, y: 75 },
  },
}



const configs = defineConfigs({
  node: {
        selectable: 2, // Permite seleccionar hasta 2 nodos a la vez
       label: { // Configuración de la etiqueta del nodo
        fontSize: 14, // Tamaño de la fuente de la etiqueta
        color: "black", // Color del texto

        },


  },
  edge: {
      selectable: true, // Permite seleccionar aristas
       label: { // Configuración de la etiqueta de la arista
        fontSize: 40, // Tamaño de la fuente de la etiqueta
        color: "#ccc", // Color de la etiqueta
        position: "start", // Posición de la etiqueta (start, middle, end)
    },
    normal: {
      width: 3, // Ancho de las aristas
      },

    },


})

export default {
  nodes,
  edges,
  layouts,
  configs,
}
