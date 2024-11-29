import { onMounted, reactive, watchEffect } from 'vue';
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
  size: number;
  color: string;
  label?: boolean;
  data?: NodeData;
  icon?: string; // Añadir esta línea para incluir la propiedad 'icon'
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
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 60,
            "porcentajeParticipacionUtilidades": 70
          }
        ]
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
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 80,
            "porcentajeParticipacionUtilidades": 50
          }
        ]
      },
      {
        "rut": "45678901-2",
        "nombre": "XYZ Innovación S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 3000000,
        "lineaNegocio": "Desarrollo de tecnología y soluciones innovadoras",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 50,
            "porcentajeParticipacionUtilidades": 60
          }
        ]
      },
      {
        "rut": "56789012-3",
        "nombre": "XYZ Servicios Financieros S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 1500000,
        "lineaNegocio": "Servicios de asesoría financiera",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 70,
            "porcentajeParticipacionUtilidades": 80
          }
        ]
      },
      {
        "rut": "67890123-4",
        "nombre": "XYZ Logística S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 4000000,
        "lineaNegocio": "Servicios logísticos y transporte",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 65,
            "porcentajeParticipacionUtilidades": 75
          }
        ]
      },
      {
        "rut": "78901234-5",
        "nombre": "XYZ Comercio Exterior S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 3500000,
        "lineaNegocio": "Comercio exterior y exportaciones",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 55,
            "porcentajeParticipacionUtilidades": 65
          }
        ]
      },
      {
        "rut": "89012345-6",
        "nombre": "XYZ Energía Renovable S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 6000000,
        "lineaNegocio": "Energía renovable y sostenible",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 45,
            "porcentajeParticipacionUtilidades": 70
          }
        ]
      },
      {
        "rut": "90123456-7",
        "nombre": "XYZ Telecomunicaciones S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 2500000,
        "lineaNegocio": "Servicios de telecomunicaciones",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 85,
            "porcentajeParticipacionUtilidades": 90
          }
        ]
      },
      {
        "rut": "01234567-8",
        "nombre": "XYZ Automotriz S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 8000000,
        "lineaNegocio": "Fabricación de vehículos y autopartes",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 60,
            "porcentajeParticipacionUtilidades": 75
          }
        ]
      },
      {
        "rut": "12345678-9",
        "nombre": "XYZ Inmobiliaria S.A.",
        "tipo": "Operativa",
        "capitalEnterado": 4500000,
        "lineaNegocio": "Desarrollo inmobiliario",
        "participaciones": [
          {
            "empresa": {
              "rut": "12345678-9",
              "nombre": "Grupo Empresarial XYZ S.A.",
              "tipo": "Matriz"
            },
            "porcentajeParticipacion": 90,
            "porcentajeParticipacionUtilidades": 85
          }
        ]
      }
    ]
}

};

// Función para cargar los nodos y aristas desde el JSON
function loadNodesFromJson() {
  const grupoEmpresarial = grupoEmpresarialData.grupoEmpresarial;

  const warehouseIcon = "&#xe8b8;";
  const userIcon = "&#xe7fd;";

  // Crear o actualizar nodo padre
  const parentId = `node-${grupoEmpresarial.id}`;
  nodes[parentId] = {
    ...nodes[parentId],
    name: grupoEmpresarial.nombre,
    x: nodes[parentId]?.x || 0,
    y: nodes[parentId]?.y || 0,
    size: 25,
    color: "#eb510d",
    label: true,
    icon: warehouseIcon,
    data: {
      id: grupoEmpresarial.id,
      nombre: grupoEmpresarial.nombre,
      rut: grupoEmpresarial.rut,
      tipo: grupoEmpresarial.tipo,
      capitalEnterado: grupoEmpresarial.capitalEnterado,
      lineaNegocio: grupoEmpresarial.lineaNegocio,
    },
  };

  // Crear o actualizar nodos hijos y aristas
  grupoEmpresarial.empresas.forEach((empresa) => {
    const childId = `node-${empresa.rut}`;
    nodes[childId] = {
      ...nodes[childId],
      name: empresa.nombre,
      x: nodes[childId]?.x || Math.random() * 400,
      y: nodes[childId]?.y || Math.random() * 400,
      size: 15,
      color: "#0064a0",
      label: true,
      icon: userIcon,
      data: {
        id: empresa.id,
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

    // Crear o actualizar la arista
    const edgeId = `edge-${parentId}-${childId}`;
    edges[edgeId] = {
      ...edges[edgeId],
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
const updateNodePosition = (nodeId, newPosition) => {
  layouts.nodes[nodeId] = { x: newPosition.x, y: newPosition.y };
  // Guardar los nuevos layouts en localStorage
  localStorage.setItem('layouts', JSON.stringify(layouts));
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

onMounted(() => {
  loadNodesFromJson();
  // Cargar layouts guardados
  const savedLayouts = localStorage.getItem('layouts');
  if (savedLayouts) {
    const parsedLayouts = JSON.parse(savedLayouts);
    Object.assign(layouts.nodes, parsedLayouts.nodes);
  }
});

export default {
  nodes,
  edges,
  layouts,
  configs,
  updateNodePosition,
};
