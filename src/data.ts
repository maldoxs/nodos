import { reactive, watchEffect } from 'vue'
import { Nodes, Edges, Layouts, defineConfigs } from 'v-network-graph'

// Definir el estado reactivo para los nodos y las coordenadas
const nodes: Nodes = {
  node1: { name: 'N1' },
  node2: { name: 'N2' },
  node3: { name: 'N3' },
  // Puedes agregar más nodos aquí en el futuro
}

const edges: Edges = {
  edge1: { source: 'node1', target: 'node2' },
}

// Recuperar el objeto layouts del localStorage o establecer valores predeterminados
const savedLayouts = localStorage.getItem('layouts')
const initialLayouts = savedLayouts ? JSON.parse(savedLayouts) : {
  nodes: {
    node1: { x: 50, y: 0 },
    node2: { x: 0, y: 75 },
    node3: { x: 100, y: 75 },
  },
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
