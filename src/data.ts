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
                        "rut": "34567890-1",
                        "nombre": "XYZ Distribución S.A.",
                        "tipo": "Operativa"
                    },
                    "porcentajeParticipacion": 60,
                    "porcentajeParticipacionUtilidades": 70
                },
                {
                    "empresa": {
                        "rut": "45678901-2",
                        "nombre": "XYZ Innovación S.A.",
                        "tipo": "Operativa"
                    },
                    "porcentajeParticipacion": 60,
                    "porcentajeParticipacionUtilidades": 70
                },
                {
                    "empresa": {
                        "rut": "56789012-3",
                        "nombre": "XYZ Nuevos Productos S.A.",
                        "tipo": "Operativa"
                    },
                    "porcentajeParticipacion": 50,
                    "porcentajeParticipacionUtilidades": 60
                },
                {
                    "empresa": {
                        "rut": "67890123-4",
                        "nombre": "XYZ Fabricación Avanzada S.A.",
                        "tipo": "Operativa"
                    },
                    "porcentajeParticipacion": 50,
                    "porcentajeParticipacionUtilidades": 60
                },
                {
                    "empresa": {
                        "rut": "78901234-5",
                        "nombre": "XYZ Innovaciones S.A.",
                        "tipo": "Operativa"
                    },
                    "porcentajeParticipacion": 50,
                    "porcentajeParticipacionUtilidades": 60
                }
            ]
        },
        {
            "rut": "34567890-1",
            "nombre": "XYZ Distribución S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 5000000,
            "lineaNegocio": "Distribución de productos",
            "participaciones": [
                {
                    "empresa": {
                        "rut": "45678901-2",
                        "nombre": "XYZ Innovación S.A.",
                        "tipo": "Operativa"
                    },
                    "porcentajeParticipacion": 60,
                    "porcentajeParticipacionUtilidades": 70
                }
            ]
        },
        {
            "rut": "45678901-2",
            "nombre": "XYZ Innovación S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 5000000,
            "lineaNegocio": "Desarrollo de tecnología",
            "participaciones": [
                {
                    "empresa": {
                        "rut": "23456789-0",
                        "nombre": "XYZ Producción S.A.",
                        "tipo": "Operativa"
                    },
                    "porcentajeParticipacion": 60,
                    "porcentajeParticipacionUtilidades": 70
                }
            ]
        },
        {
            "rut": "56789012-3",
            "nombre": "XYZ Nuevos Productos S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 6000000,
            "lineaNegocio": "Fabricación de productos avanzados",
            "participaciones": [
                 {
                    "empresa": {
                        "rut": "89012345-6",
                        "nombre": "XYZ Producto 1 S.A.",
                        "tipo": "Operativa",
                    },
                    "porcentajeParticipacion": 50,
                    "porcentajeParticipacionUtilidades": 60
                },
                    {
                    "empresa": {
                        "rut": "90123456-7",
                        "nombre": "XYZ Producto 2 S.A.",
                        "tipo": "Operativa",
                    },
                    "porcentajeParticipacion": 50,
                    "porcentajeParticipacionUtilidades": 60
                },
                   {
                    "empresa": {
                        "rut": "11223344-8",
                        "nombre": "XYZ Producto 3 S.A.",
                        "tipo": "Operativa"
                    },
                    "porcentajeParticipacion": 50,
                    "porcentajeParticipacionUtilidades": 60
                },

                     {
                    "empresa": {
                        "rut": "22334455-9",
                        "nombre": "XYZ Producto 4 S.A.",
                        "tipo": "Operativa",
                    },
                    "porcentajeParticipacion": 50,
                    "porcentajeParticipacionUtilidades": 60
                },
                {
                    "empresa": {
                        "rut": "33445566-0",
                         "nombre": "XYZ Producto 5 S.A.",
                         "tipo": "Operativa",
                    },
                    "porcentajeParticipacion": 50,
                    "porcentajeParticipacionUtilidades": 60
                },



            ]
        },
        {
            "rut": "67890123-4",
            "nombre": "XYZ Fabricación Avanzada S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 7000000,
            "lineaNegocio": "Producción avanzada",
            "participaciones": []
        },
        {
            "rut": "78901234-5",
            "nombre": "XYZ Innovaciones S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 8000000,
            "lineaNegocio": "Innovaciones tecnológicas",
            "participaciones": []
        },
        {
            "rut": "89012345-6",
            "nombre": "XYZ Producto 1 S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 2000000,
            "lineaNegocio": "Innovación en productos",
            "participaciones": [

            ]
        },
        {
            "rut": "90123456-7",
            "nombre": "XYZ Producto 2 S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 2500000,
            "lineaNegocio": "Innovación en productos",
            "participaciones": [

            ]
        },
        {
            "rut": "11223344-8",
            "nombre": "XYZ Producto 3 S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 3000000,
            "lineaNegocio": "Investigación de productos",
            "participaciones": [

            ]
        },
        {
            "rut": "22334455-9",
            "nombre": "XYZ Producto 4 S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 3500000,
            "lineaNegocio": "Desarrollo de productos",
            "participaciones": [

            ]
        },
        {
            "rut": "33445566-0",
            "nombre": "XYZ Producto 5 S.A.",
            "tipo": "Operativa",
            "capitalEnterado": 4000000,
            "lineaNegocio": "Productos avanzados",
            "participaciones": [

            ]
        }
    ]
};



// Función para cargar los nodos y aristas desde el JSON
// Función para cargar los nodos y aristas desde el nuevo formato JSON
function loadNodesFromJson() {
  // Recorrer las empresas que tienen relaciones de participación
  grupoEmpresarialData.empresas.forEach((empresa) => {
    const userIcon = "&#xe7fd;"; // Icono para las empresas

    // Crear o actualizar el nodo de la empresa
    const companyId = `node-${empresa.rut}`;
    nodes[companyId] = {
      ...nodes[companyId],
      name: empresa.nombre,
      x: nodes[companyId]?.x || Math.random() * 400,
      y: nodes[companyId]?.y || Math.random() * 400,
      size: 15,
      color: "#0064a0",
      label: true,
      icon: userIcon,
      data: {
        // id: empresa.id,
        rut: empresa.rut,
        nombre: empresa.nombre,
        tipo: empresa.tipo,
        capitalEnterado: empresa.capitalEnterado,
        lineaNegocio: empresa.lineaNegocio,
        participaciones: empresa.participaciones,
      },
    };

    // Recorrer las participaciones de la empresa
    empresa.participaciones.forEach((participacion) => {
      const participacionEmpresa = participacion.empresa; // La empresa con la que tiene participación
      const participacionRut = participacionEmpresa.rut;

      // Crear una arista entre la empresa actual y la empresa con la que tiene participación
      const edgeId = `edge-${companyId}-${participacionRut}`;
      edges[edgeId] = {
        ...edges[edgeId],
        source: companyId,
        target: `node-${participacionRut}`,
        color: "#002C48",
        porcentajeParticipacion: participacion.porcentajeParticipacion,
        porcentajeParticipacionUtilidades: participacion.porcentajeParticipacionUtilidades,
      };
    });
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
