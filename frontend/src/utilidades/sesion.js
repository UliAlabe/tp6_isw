// La US no incluye login: se simula un visitante ya logueado para que sea independiente.
export const USUARIO_LOGUEADO = {
  nombre: "John Doe",
  email: "john.doe@correo.com",
};

export function obtenerIniciales(nombre) {
  return nombre
    .split(" ")
    .map((palabra) => palabra[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
