export interface Persona {
  nombre: string;
  edad: number;
  email?: string;
}

//interface = una plantilla para que tus objetos sigan una estructura clara

/**
interface: es una palabra clave de TypeScript que se usa para definir una estructura de datos.
Persona: es el nombre de esa estructura.
export: significa que esta interfaz se puede usar en otros archivos si la importas.


El objeto debe tener un campo nombre que sea texto (string).
El objeto debe tener un campo edad que sea un número (number).



*El campo email es opcional (por eso el ?).
*Si está presente, debe ser texto (string).
*Pero no es obligatorio incluirlo en todos los objetos.
 */
