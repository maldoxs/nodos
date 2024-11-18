import { reactive, watchEffect } from 'vue'
import { Nodes, Edges, Layouts, defineConfigs } from 'v-network-graph'

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
const nodes: Nodes = {
  node1: { name: 'Node1' },

  // Puedes agregar más nodos aquí en el futuro
}

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
    layouts.nodes[nodeId].x = newPosition.x
    layouts.nodes[nodeId].y = newPosition.y
    // Guardar los nuevos layouts en localStorage
    localStorage.setItem('layouts', JSON.stringify(layouts))
    console.log(`Posición de ${nodeId} actualizada a (${newPosition.x}, ${newPosition.y})`)
  } else {
    // Si el nodo no existe, lo agregamos con sus coordenadas
    layouts.nodes[nodeId] = newPosition
    nodes[nodeId] = { name: `Nuevo Nodo ${nodeId.charAt(nodeId.length - 1)}` }
    // Guardamos la nueva información
    localStorage.setItem('layouts', JSON.stringify(layouts))
    console.log(`Nodo ${nodeId} agregado con posición (${newPosition.x}, ${newPosition.y})`)
  }
}

// Función para agregar un nuevo nodo con posiciones predeterminadas
const addNode = (nodeId: string, name: string, position: { x: number, y: number }) => {
  if (!nodes[nodeId]) {
    // Agregar solo el nombre del nodo al objeto nodes
    nodes[nodeId] = { name: name }
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
const configs = defineConfigs({
  node: {
    selectable: 2,
    label: {
      fontSize: 15,
      color: 'black',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      textAlign: 'left',
      textDecoration: 'line-through',
      visible: true,
      direction: 'south',
      directionAutoAdjustment: true,
    },
    normal: {
      radius: 20,
      color: '#0d6efd',
    },
    shape: 'rectangle',
    color: 'orange',
    opacity: 0.8,
    image: 'url/to/image.png',
    tooltip: {
      text: 'Información adicional',
      showOnHover: true,
    },
  },
  edge: {
    selectable: true,
    label: {
      fontSize: 40,
      color: '#ccc',
      position: 'start',
    },
    marker: {
      target: { type: 'arrow' },
    },
    normal: {
      width: 2,
    },
  },
})

export default {
  nodes,
  edges,
  layouts,
  configs,
  updateNodePosition, // exporta la función para actualizar las coordenadas
  addNode, // exporta la función para agregar un nuevo nodo
}
