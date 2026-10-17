// Solo valida el formato de cada campo para avisar al instante; la decisión final es del backend.
const PATRON_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PATRON_DNI = /^\d{7,8}$/;
const PATRON_ENTERO = /^\d+$/;
const EDAD_MAXIMA = 120;

function validarEmail(email) {
  const valor = email.trim();
  if (valor === "") {
    return "Ingresá un email para recibir la confirmación.";
  }
  if (!PATRON_EMAIL.test(valor)) {
    return "Ese email no es válido. Revisá que tenga el formato nombre@correo.com.";
  }
  return "";
}

function validarNombre(nombre) {
  return nombre.trim() === "" ? "Ingresá el nombre y apellido." : "";
}

function validarDni(dni, dnisAnteriores) {
  const valor = dni.trim();
  if (valor === "") {
    return "Ingresá el DNI.";
  }
  if (!PATRON_DNI.test(valor)) {
    return "El DNI tiene que tener 7 u 8 números, sin puntos ni espacios.";
  }
  if (dnisAnteriores.includes(valor)) {
    return "Este DNI ya está cargado en otro participante.";
  }
  return "";
}

function validarEdad(edad, actividad) {
  const valor = edad.trim();
  if (valor === "") {
    return "Ingresá la edad.";
  }
  if (!PATRON_ENTERO.test(valor)) {
    return "La edad tiene que ser un número entero.";
  }
  if (Number(valor) > EDAD_MAXIMA) {
    return `La edad no puede ser mayor a ${EDAD_MAXIMA} años.`;
  }
  if (Number(valor) < actividad.edadMinima) {
    return `Para ${actividad.nombre} hay que tener ${actividad.edadMinima} años o más.`;
  }
  return "";
}

function validarTalle(talle, requiereTalle) {
  return requiereTalle && !talle ? "Elegí un talle." : "";
}

function validarParticipante(participante, actividad, dnisAnteriores) {
  return {
    nombre: validarNombre(participante.nombre),
    dni: validarDni(participante.dni, dnisAnteriores),
    edad: validarEdad(participante.edad, actividad),
    talle: validarTalle(participante.talle, actividad.requiereTalle),
  };
}

export function validarInscripcion({ email, participantes, aceptaTerminos, actividad }) {
  return {
    email: validarEmail(email),
    terminos: aceptaTerminos ? "" : "Tenés que aceptar los términos y condiciones para inscribirte.",
    participantes: participantes.map((participante, indice) =>
      validarParticipante(
        participante,
        actividad,
        participantes.slice(0, indice).map((anterior) => anterior.dni.trim()),
      ),
    ),
  };
}

export function hayErrores(errores) {
  return (
    Boolean(errores.email || errores.terminos) ||
    errores.participantes.some((erroresDeParticipante) =>
      Object.values(erroresDeParticipante).some(Boolean),
    )
  );
}
