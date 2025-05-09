sequenceDiagram
    participant Usuario
    participant UI as "Plataforma (UI)"
    participant Validacion as "Sistema de Validación de Requisitos"
    participant Perfil as "Módulo Perfil Social"
    participant Motor as "Motor de Postulación"

    Usuario->>UI: 1. Entra a la plataforma
    Usuario->>UI: 2. Selecciona un beneficio
    UI->>UI: 3. Muestra requisitos del beneficio
    UI->>Validacion: 4. Verifica: ¿Cumple requisitos?
    Validacion-->>UI: 5. Respuesta (Cumple / No Cumple)
    alt Si cumple requisitos
        UI->>UI: 6. Habilita botón "Postular"
    else Si no cumple requisitos
        UI->>Perfil: 7. Muestra mensaje "Actualiza tu RSH"
    end
    Usuario->>UI: 8. Presiona botón "Postular"
    UI->>Motor: 9. Envia la postulación
    Motor-->>UI: 10. Procesa la postulación
    Motor-->>UI: 11. Verifica: ¿Postulación enviada?
    UI-->>Usuario: 12. Muestra mensaje de éxito o error
    Usuario->>Usuario: 13. Fin del proceso
