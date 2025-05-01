flowchart TD
A["Inicio"] --> B{"¿Ingreso con ClaveÚnica o con RUN?"}

B -- ClaveÚnica --> C["Inicia sesión con ClaveÚnica"]
B -- RUN --> D["Inicia sesión con RUT"]

C --> E{"¿Login correcto?"}
D --> F{"¿RUT válido?"}

E -- Sí --> G["Selecciona un beneficio"]
E -- No --> H["Muestra opciones: 'Recuperar ClaveÚnica' / 'Solicitar ClaveÚnica'"]

F -- Sí --> G
F -- No --> I["Muestra mensaje 'El RUT no es válido'"]

H --> J["Recuperar ClaveÚnica"]
H --> K["Solicitar ClaveÚnica"]

I --> D
J --> C
K --> C

G --> L["Muestra requisitos del beneficio"]
L --> M{"¿Cumple requisitos?"}

M -- Sí --> N["Habilita botón 'Postular'"]
M -- No --> O["Muestra mensaje 'Actualiza tu RSH'"]

N --> P["Presiona botón 'Postular'"]
P --> Q["Envía la postulación"]
Q --> R["Procesa la postulación"]

R --> S{"¿Postulación enviada?"}

S -- Sí --> T["Muestra mensaje 'Postulación enviada exitosamente'"]
S -- No --> U["Muestra mensaje 'Error al enviar. Intenta nuevamente.'"]

T --> V["Fin"]
U --> V
