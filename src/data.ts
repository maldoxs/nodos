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
        fontSize: 15, // Tamaño de la fuente de la etiqueta
        color: "RED", // Color del texto
        fontWeight: "bold", // Peso de la fuente: 'normal', 'bold', etc.
        fontFamily: "Arial", // Tipo de letra
        textAlign: "left", // Alineación del texto: 'left', 'center', 'right'
        textDecoration: "line-through", // Decoración del texto: 'none', 'underline', 'line-through'
    },
    size: { // Configuración del tamaño del nodo
        width: 700, // Ancho del nodo
        height: 700, // Alto del nodo
        },
    shape: "square", // Forma del nodo: 'circle', 'square', 'rectangle', etc.
    color: "lightblue", // Color de fondo del nodo
    border: { // Configuración del borde del nodo
        width: 2, // Ancho del borde
        color: "black", // Color del borde
        style: "solid", // Estilo del borde: 'solid', 'dashed', 'dotted'
        },
     opacity: 0.8, // Opacidad del nodo: 0 (transparente) a 1 (opaco)
    image: "url/to/image.png", // URL de una imagen para usar como fondo del nodo
    tooltip: { // Configuración del tooltip (información sobre herramientas)
        text: "Información adicional", // Texto que se muestra en el tooltip
        showOnHover: true, // Muestra el tooltip al pasar el ratón
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
