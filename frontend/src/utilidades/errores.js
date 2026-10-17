const MENSAJES_POR_CODIGO = {
  SIN_CUPO: "Ese horario ya no tiene cupo, elegí otro.",
  HORARIO_NO_DISPONIBLE: "Ese horario no está disponible, elegí otro.",
  FUERA_DE_VENTANA:
    "La inscripción a ese turno no está habilitada: se abre 24 h antes y cierra 15 minutos antes de empezar.",
  SUPERPOSICION_HORARIA: "Algún participante ya tiene otra actividad en ese mismo horario.",
  TERMINOS_NO_ACEPTADOS: "Para inscribirte tenés que aceptar los términos y condiciones.",
  TALLE_REQUERIDO: "Esta actividad necesita el talle de cada participante.",
  ACTIVIDAD_NO_ENCONTRADA: "Esa actividad no existe. Volvé a elegir una de la lista.",
  SIN_CONEXION: "No pudimos conectarnos con el parque. Revisá tu conexión e intentá de nuevo.",
};

// Con estos errores el horario elegido dejó de servir y hay que volver a elegir uno.
const CODIGOS_DE_HORARIO = new Set(["SIN_CUPO", "HORARIO_NO_DISPONIBLE", "FUERA_DE_VENTANA"]);

export function obtenerMensajeDeError(error) {
  return MENSAJES_POR_CODIGO[error.codigo] ?? error.message;
}

export function esErrorDeHorario(error) {
  return CODIGOS_DE_HORARIO.has(error.codigo);
}
