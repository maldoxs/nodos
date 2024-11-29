import { reactive, watchEffect } from 'vue';
import { Nodes, Edges, Layouts, defineConfigs } from 'v-network-graph';
import * as vNG from "v-network-graph";

// Definir una interfaz para los datos adicionales del nodo
interface NodeData {
  id?: number;
  nombre?: string;
  rut?: string;
  tipo?: string;
  capitalEnterado?: number;
  lineaNegocio?: string;
  empresas?: any[];
  participaciones?: any[];
}

// Actualizar la interfaz del nodo
interface Node {
  name: string;
  x: number;
  y: number;
  size: number; // Definir el tamaño
  color: string; // Definir el color
  label?: boolean;
  data?: NodeData; // Añadir esta línea para incluir la propiedad 'data'
}

// Interfaz del borde
interface Edge extends vNG.Edge {
  color: string;
  dashed?: boolean;
  porcentajeParticipacion?: number;
  porcentajeParticipacionUtilidades?: number;
}



// Nodos y aristas reactivos
const nodes = reactive<Record<string, Node>>({});
const edges: Edges = reactive({});

// Recuperar el objeto layouts del localStorage o establecer valores predeterminados
const savedLayouts = localStorage.getItem('layouts');
const initialLayouts = savedLayouts ? JSON.parse(savedLayouts) : {
  nodes: {},
};

// JSON proporcionado
const grupoEmpresarialData = {
  "grupoEmpresarial": {
    "id": 1,
    "nombre": "Grupo Empresarial XYZ",
    "rut": "12345678-9",
    "tipo": "Matriz",
    "capitalEnterado": 10000000,
    "lineaNegocio": "Holding de empresas",
    "empresas": [
      {
        "rut": "23456789-0",
        "nombre": "XYZ Producción S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 5000000,
        "lineaNegocio": "Fabricación de productos",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz",
            },
            "porcentajeParticipacion": 60,
            "porcentajeParticipacionUtilidades": 70,
          },
        ],
      },
      {
        "rut": "34567890-1",
        "nombre": "XYZ Distribución S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 2000000,
        "lineaNegocio": "Distribución y ventas de productos",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz",
            },
            "porcentajeParticipacion": 80,
            "porcentajeParticipacionUtilidades": 50,
          },
        ],
      },
    ],
  },
};

// Función para cargar los nodos y aristas desde el JSON
function loadNodesFromJson() {
  const grupoEmpresarial = grupoEmpresarialData.grupoEmpresarial;

  // Crear nodo padre
  const parentId = `node${grupoEmpresarial.id}`;
  nodes[parentId] = {
    name: grupoEmpresarial.nombre,
    x: 0,
    y: 0,
    size: 25,
    color: "#eb510d", // Color para nodos padres
    label: true,
    data: {
      id: grupoEmpresarial.id,
      nombre: grupoEmpresarial.nombre,
      rut: grupoEmpresarial.rut,
      tipo: grupoEmpresarial.tipo,
      capitalEnterado: grupoEmpresarial.capitalEnterado,
      lineaNegocio: grupoEmpresarial.lineaNegocio,
    },
  };

  // Crear nodos hijos y aristas
  grupoEmpresarial.empresas.forEach((empresa, index) => {
    const childId = `node${index + 2}`; // Aseguramos que los IDs no se repitan
    nodes[childId] = {
      name: empresa.nombre,
      x: 200 * (index + 1), // Posición X ajustada
      y: 150, // Posición Y fija para todos los hijos
      size: 15,
      color: "#0064a0", // Color para nodos hijos
      label: true,
      data: {
        rut: empresa.rut,
        nombre: empresa.nombre,
        tipo: empresa.tipo,
        capitalEnterado: empresa.capitalEnterado,
        lineaNegocio: empresa.lineaNegocio,
        participaciones: empresa.participaciones,
      },
    };

    // Obtener los porcentajes de participación
    const participacion = empresa.participaciones?.find(
      (p) => p.empresa.rut === grupoEmpresarial.rut
    );

    const porcentajeParticipacion = participacion?.porcentajeParticipacion ?? 0;
    const porcentajeParticipacionUtilidades =
      participacion?.porcentajeParticipacionUtilidades ?? 0;

    // Crear arista entre el nodo padre y el nodo hijo, incluyendo los porcentajes
    const edgeId = `edge${index + 1}`;
    edges[edgeId] = {
      source: parentId,
      target: childId,
      color: "#002C48",
      porcentajeParticipacion,
      porcentajeParticipacionUtilidades,
    };
  });
}

// Llamamos a la función para cargar los nodos desde el JSON
loadNodesFromJson();

// Layouts reactivos
const layouts: Layouts = reactive({
  nodes: {},
});

// Asignar posiciones guardadas o por defecto
Object.keys(nodes).forEach((nodeId) => {
  if (initialLayouts.nodes[nodeId]) {
    // Si hay posiciones guardadas, las usamos
    layouts.nodes[nodeId] = initialLayouts.nodes[nodeId];
  } else {
    // Si no, usamos las posiciones del nodo y las guardamos
    layouts.nodes[nodeId] = { x: nodes[nodeId].x, y: nodes[nodeId].y };
  }
});

// Función para actualizar la posición de un nodo en layouts
const updateNodePosition = (
  nodeId: string,
  newPosition: { x: number; y: number }
) => {
  if (layouts.nodes[nodeId]) {
    layouts.nodes[nodeId].x = newPosition.x;
    layouts.nodes[nodeId].y = newPosition.y;
    // Guardar los nuevos layouts en localStorage
    localStorage.setItem('layouts', JSON.stringify(layouts));
  }
};

// Verificar cambios en layouts y actualizar localStorage automáticamente
watchEffect(() => {
  localStorage.setItem('layouts', JSON.stringify(layouts));
});

// Configuración reactiva de los nodos y bordes
const configs = reactive(
  defineConfigs<Node, Edge>({
    node: {
      normal: {
        type: "circle",
        radius: (node) => node.size,
        color: (node) => node.color,
      },
      hover: {
        radius: (node) => node.size + 2,
        color: (node) => node.color,
      },
      selectable: true,
      label: {
        visible: (node) => !!node.label,
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
        color: (edge) => edge.color,
        dasharray: (edge) => (edge.dashed ? "4" : "0"),
      },
      selectable: true,
      marker: {
        target: { type: 'arrow' },
      },
      label: {
        fontSize: 40,
      },
    },
  })
);

export default {
  nodes,
  edges,
  layouts,
  configs,
  updateNodePosition,
};
