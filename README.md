# Estructura del Grupo Empresarial XYZ

A continuación se muestra la estructura del **Grupo Empresarial XYZ** en formato JSON:

```json
{
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
}
