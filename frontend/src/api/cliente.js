const URL_BASE = "/api";

export class ErrorApi extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.codigo = codigo;
  }
}

async function pedir(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      headers: { "Content-Type": "application/json" },
      ...opciones,
    });
  } catch {
    throw new ErrorApi("SIN_CONEXION", "No pudimos conectarnos con el parque.");
  }
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    const error = cuerpo?.error;
    throw new ErrorApi(
      error?.codigo ?? "ERROR_INESPERADO",
      error?.mensaje ?? "Ocurrió un error inesperado.",
    );
  }
  return cuerpo;
}

export function obtenerActividades() {
  return pedir("/actividades");
}

export function obtenerHorarios(actividadId, fecha) {
  return pedir(`/actividades/${encodeURIComponent(actividadId)}/horarios?fecha=${fecha}`);
}

export function obtenerTerminos(actividadId) {
  return pedir(`/actividades/${encodeURIComponent(actividadId)}/terminos`);
}

export function crearInscripcion(inscripcion) {
  return pedir("/inscripciones", { method: "POST", body: JSON.stringify(inscripcion) });
}
