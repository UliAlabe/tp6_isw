function formatearComoIso(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function obtenerFechasConsultables() {
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  return [
    { fecha: formatearComoIso(hoy), titulo: "Hoy" },
    { fecha: formatearComoIso(manana), titulo: "Mañana" },
  ];
}

// El backend manda los horarios en hora del parque y sin zona: se leen tal cual, sin convertir.
export function formatearHora(horario) {
  return horario.slice(11, 16);
}

export function formatearDia(horario) {
  const [anio, mes, dia] = horario.slice(0, 10).split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
