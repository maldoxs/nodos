import { reactive, watchEffect } from 'vue'
import { Nodes, Edges, Layouts, defineConfigs } from 'v-network-graph'
import * as vNG from "v-network-graph"


// Interfaz del nodo
interface Node {
    name: string;
    x: number;
    y: number;
    size: number; // Definir el tamaño
    color: string; // Definir el color
    label?: boolean
}


// Interfaz del borde
interface Edge extends vNG.Edge {
  color: string
  dashed?: boolean
}

// Función para generar las coordenadas de los nodos dinámicamente
const generateNodeCoordinates = (totalNodes) => {
  const nodes = {};
  let x = 50;
  let y = 0;

  for (let i = 1; i <= totalNodes; i++) {
    nodes[`node${i}`] = { x, y };

    // Ajuste de coordenadas: se aumenta el valor de `x` cada 4 nodos y `y` después de cada 5 nodos
    if (i % 5 === 0) {
      y += 75; // Incrementa la coordenada `y` cada 5 nodos
      x = 50;  // Resetea la coordenada `x` cada vez que se incrementa `y`
    } else {
      x += 100; // Incrementa la coordenada `x` para la siguiente posición
    }
  }

  return nodes;
};

// Recuperar el objeto layouts del localStorage o establecer valores predeterminados
const savedLayouts = localStorage.getItem('layouts');
const initialLayouts = savedLayouts ? JSON.parse(savedLayouts) : {
  nodes: generateNodeCoordinates(40),  // Generamos las coordenadas dinámicas para 40 nodos
}

// Definir el estado reactivo para los nodos y las coordenadas
// Los nodos reactivos
const nodes = reactive<Record<string, Node>>({
  node1: { name: "Node 5", size: 25, color: "#eb510d", x: 400, y: 0, label: true },

})


// Función para agregar un nodo de color "hotpink"
// data.ts
export const addHotPinkNode = (nodes: any, nextNodeIndex: any) => {
    const nodeId = `node${nextNodeIndex.value}`;
    const name = `Nodo Padre ${nextNodeIndex.value}`;
    const x = Math.random() * 400;
    const y = Math.random() * 400;

    // Crear el nodo con las propiedades necesarias, y asignar color HotPink
    nodes[nodeId] = {
        name,
        x,
        y,
        size: 25,
        color: "#eb510d", // Establecer el color a HotPink
        label: true,
    };

    nextNodeIndex.value++;
    console.log(`Nodo HotPink creado: ${name}, Coordenadas: (${x}, ${y})`);
};


// Configuración reactiva de los nodos y bordes
const configs = reactive(
  defineConfigs<Node, Edge>({
    node: {
      normal: {
        type: "circle",
        radius: node => node.size,
        color: node => node.color,
      },
      hover: {
        radius: node => node.size + 2,
        color: node => node.color,
      },
      selectable: true,
      label: {
          visible: node => !!node.label,
          directionAutoAdjustment: true,
          fontSize: 15,
      color: 'black',
      fontFamily: 'Arial',
      direction: 'south',


      },
      focusring: {
        color: "darkgray",
    },

    },
    edge: {
      normal: {
        width: 2,
        color: edge => edge.color,
        dasharray: edge => (edge.dashed ? "4" : "0"),

        },
         marker: {
         target: { type: 'arrow' },
        },

    label: {
     fontSize: 40,
    },

      },

  })
)



const edges: Edges = {
  edge1: { source: 'node1', target: 'node2' },
}

// Hacer que layouts sea reactivo
const layouts: Layouts = reactive({
  nodes: {
    ...initialLayouts.nodes, // Copiar las coordenadas iniciales desde localStorage o valores predeterminados
  }
})

// Función para actualizar la posición de un nodo en layouts
const updateNodePosition = (nodeId: string, newPosition: { x: number, y: number }) => {
  if (layouts.nodes[nodeId]) {
    layouts.nodes[nodeId].x = newPosition.x;
    layouts.nodes[nodeId].y = newPosition.y;
    // Guardar los nuevos layouts en localStorage
    localStorage.setItem('layouts', JSON.stringify(layouts));
    console.log(`Posición de ${nodeId} actualizada a (${newPosition.x}, ${newPosition.y})`);
  } else {
    // Si el nodo no existe, lo agregamos con sus coordenadas
    layouts.nodes[nodeId] = newPosition;

    // Crear el nuevo nodo con las propiedades faltantes
    nodes[nodeId] = {
      name: `Nuevo Nodo ${nodeId.charAt(nodeId.length - 1)}`,
      x: newPosition.x,
      y: newPosition.y,
      size: 10, // Puedes definir el valor adecuado para el tamaño
      color: '#000000' // Definir un color por defecto o el que necesites
    };

    // Guardamos la nueva información
    localStorage.setItem('layouts', JSON.stringify(layouts));
    console.log(`Nodo ${nodeId} agregado con posición (${newPosition.x}, ${newPosition.y})`);
  }
}

// Función para agregar un nuevo nodo con posiciones predeterminadas
const addNode = (nodeId: string, name: string, position: { x: number, y: number }) => {
  if (!nodes[nodeId]) {
    // Agregar solo el nombre del nodo al objeto nodes
    nodes[nodeId] = { name: name, size: 16, color: "gray", x: position.x, y: position.y, label: false };
    // Asignar las coordenadas solo al objeto layouts
    layouts.nodes[nodeId] = position
    console.log(`Nodo ${nodeId} agregado en la posición (${position.x}, ${position.y})`)
    localStorage.setItem('layouts', JSON.stringify(layouts)) // Actualizar el localStorage
  }
}


// Verificar cambios en layouts y actualizar localStorage automáticamente
watchEffect(() => {
  localStorage.setItem('layouts', JSON.stringify(layouts))
})

// Configuración de la red
// const configs = defineConfigs({
//   node: {
//     selectable: 2,
//     label: {
    //   fontSize: 15,
    //   color: 'black',
    //   fontWeight: 'bold',
    //   fontFamily: 'Arial',
    //   textAlign: 'left',
    //   textDecoration: 'line-through',
    //   visible: true,
    //   direction: 'south',
    //   directionAutoAdjustment: true,
//     },
//     normal: {
//       radius: 20,
//       color: '#0d6efd',
//     },
//     shape: 'rectangle',
//     color: 'orange',
//     opacity: 0.8,
//     image: 'url/to/image.png',
//     tooltip: {
//       text: 'Información adicional',
//       showOnHover: true,
//     },
//   },
//   edge: {
//     selectable: true,
//     label: {
//       fontSize: 40,
//       color: '#ccc',
//       position: 'start',
//     },
//     marker: {
//       target: { type: 'arrow' },
//     },
//     normal: {
//       width: 2,
//     },
//   },
// })

export default {
  nodes,
  edges,
  layouts,
  configs,
  updateNodePosition, // exporta la función para actualizar las coordenadas
   addNode, // exporta la función para agregar un nuevo nodo
  addHotPinkNode
}
