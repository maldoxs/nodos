<script lang="ts" setup>
    import { ref } from "vue";
    import personasJson from "../data/personas.json";
    import type { Persona } from "../types/Persona";

    // Lista reactiva de personas (copiamos desde el JSON para no modificar el original)
    const personas = ref<Persona[]>([...personasJson]);

    // Persona que se está llenando en el formulario
    const nuevaPersona = ref<Persona>({
        nombre: "",
        edad: 0,
        email: "",
    });

    // Función para agregar persona a la lista
    function agregarPersona() {
        //Si el nombre está vacío o la edad no es válida, entonces no agregues la persona y muestra una alerta."
        if (nuevaPersona.value.nombre.trim() === "" || nuevaPersona.value.edad <= 0) {
            alert("Completa nombre y edad correctamente.");
            return;
        }

        personas.value.push({ ...nuevaPersona.value });

        // Limpiar formulario
        nuevaPersona.value.nombre = "";
        nuevaPersona.value.edad = 0;
        nuevaPersona.value.email = "";
    }
</script>

<template>
    <div class="formulario-personas">
        <h2>Agregar Persona</h2>
        <form @submit.prevent="agregarPersona">
            <input v-model="nuevaPersona.nombre" placeholder="Nombre" required />
            <input v-model.number="nuevaPersona.edad" type="number" placeholder="Edad" required />
            <input v-model="nuevaPersona.email" placeholder="Email (opcional)" />
            <button type="submit">Agregar</button>
        </form>

        <hr />

        <h3>Lista de Personas</h3>
        <ul>
            <li v-for="(persona, index) in personas" :key="index">
                {{ persona.nombre }} - {{ persona.edad }} años
                <span v-if="persona.email">({{ persona.email }})</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    input {
        display: block;
        margin-bottom: 0.5rem;
    }
</style>

<!-- 🧪 Resultado:
✔️ Al cargar el componente, se muestra la lista base del JSON.
✔️ Puedes agregar nuevas personas con el formulario.
✔️ Vue actualiza la interfaz automáticamente.
✔️ El JSON original no se modifica directamente (solo trabajamos con la copia).
 -->
