import { useRef, useState } from "react";

import { crearInscripcion } from "../api/cliente.js";
import { obtenerDetallesVisuales } from "../utilidades/actividadesVisuales.js";
import { esErrorDeHorario, obtenerMensajeDeError } from "../utilidades/errores.js";
import { formatearDia, formatearHora } from "../utilidades/fechas.js";
import { USUARIO_LOGUEADO } from "../utilidades/sesion.js";
import { hayErrores, validarInscripcion } from "../utilidades/validaciones.js";
import {
  IconoCalendario,
  IconoDocumento,
  IconoHoja,
  IconoMail,
  IconoPersonas,
  IconoReloj,
} from "./Iconos.jsx";
import MensajeCampo from "./MensajeCampo.jsx";
import MensajeError from "./MensajeError.jsx";
import ModalTerminos from "./ModalTerminos.jsx";
import TarjetaParticipante from "./TarjetaParticipante.jsx";

const PARTICIPANTE_VACIO = { nombre: "", dni: "", edad: "", talle: "" };
const ERRORES_DE_PARTICIPANTE_VACIOS = { nombre: "", dni: "", edad: "", talle: "" };

function crearErroresVacios(cantidadParticipantes) {
  return {
    email: "",
    terminos: "",
    participantes: Array(cantidadParticipantes).fill(ERRORES_DE_PARTICIPANTE_VACIOS),
  };
}

function enfocarPrimerCampoConError(formulario) {
  formulario?.querySelector('[aria-invalid="true"]')?.focus();
}

function convertirEdad(edad) {
  return edad.trim() === "" ? null : Number(edad);
}

function armarInscripcion(actividad, turno, email, aceptaTerminos, participantes) {
  return {
    actividadId: actividad.id,
    horario: turno.horario,
    email: email.trim(),
    aceptaTerminos,
    cantidadPersonas: participantes.length,
    participantes: participantes.map((participante) => ({
      nombre: participante.nombre.trim(),
      dni: participante.dni.trim(),
      edad: convertirEdad(participante.edad),
      talle: actividad.requiereTalle ? participante.talle || null : null,
    })),
  };
}

function SelectorCantidad({ cantidad, maximo, alCambiar }) {
  const estiloBoton =
    "flex size-11 items-center justify-center rounded-2xl bg-crema text-2xl font-black text-bosque transition hover:bg-brote/60 active:scale-90 disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        className={estiloBoton}
        onClick={() => alCambiar(cantidad - 1)}
        disabled={cantidad <= 1}
        aria-label="Una persona menos"
      >
        −
      </button>
      <div className="flex min-w-12 flex-col items-center justify-center">
        <span className="text-2xl font-black text-bosque" aria-live="polite">
          {cantidad}
        </span>
        <span className="text-[10px] font-bold text-stone-500 uppercase">
          {cantidad === 1 ? "persona" : "personas"}
        </span>
      </div>
      <button
        type="button"
        className={estiloBoton}
        onClick={() => alCambiar(cantidad + 1)}
        disabled={cantidad >= maximo}
        aria-label="Una persona más"
      >
        +
      </button>
    </div>
  );
}

export default function FormularioInscripcion({ actividad, turno, alConfirmar, alFallarHorario }) {
  const [email, setEmail] = useState(USUARIO_LOGUEADO.email);
  const [participantes, setParticipantes] = useState([PARTICIPANTE_VACIO]);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [hayModalAbierto, setHayModalAbierto] = useState(false);
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [error, setError] = useState("");
  const [errores, setErrores] = useState(crearErroresVacios(1));
  const formulario = useRef(null);

  const visual = obtenerDetallesVisuales(actividad.id);

  const limpiarError = (campo) => setErrores((actuales) => ({ ...actuales, [campo]: "" }));

  const limpiarErrorDeParticipante = (indice, campo) =>
    setErrores((actuales) => ({
      ...actuales,
      participantes: actuales.participantes.map((erroresDeParticipante, posicion) =>
        posicion === indice ? { ...erroresDeParticipante, [campo]: "" } : erroresDeParticipante,
      ),
    }));

  const cambiarEmail = (nuevoEmail) => {
    setEmail(nuevoEmail);
    limpiarError("email");
  };

  const cambiarAceptaTerminos = (acepta) => {
    setAceptaTerminos(acepta);
    limpiarError("terminos");
  };

  const cambiarCantidad = (cantidad) => {
    setParticipantes((actuales) =>
      Array.from({ length: cantidad }, (_, indice) => actuales[indice] ?? PARTICIPANTE_VACIO),
    );
    setErrores((actuales) => ({
      ...actuales,
      participantes: Array.from(
        { length: cantidad },
        (_, indice) => actuales.participantes[indice] ?? ERRORES_DE_PARTICIPANTE_VACIOS,
      ),
    }));
  };

  const cambiarParticipante = (indice) => (participante, campo) => {
    setParticipantes((actuales) =>
      actuales.map((actual, posicion) => (posicion === indice ? participante : actual)),
    );
    limpiarErrorDeParticipante(indice, campo);
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setError("");
    const erroresEncontrados = validarInscripcion({
      email,
      participantes,
      aceptaTerminos,
      actividad,
    });
    setErrores(erroresEncontrados);
    if (hayErrores(erroresEncontrados)) {
      requestAnimationFrame(() => enfocarPrimerCampoConError(formulario.current));
      return;
    }
    setEstaEnviando(true);
    try {
      const inscripcion = armarInscripcion(actividad, turno, email, aceptaTerminos, participantes);
      alConfirmar(await crearInscripcion(inscripcion));
    } catch (errorApi) {
      if (esErrorDeHorario(errorApi)) {
        alFallarHorario(obtenerMensajeDeError(errorApi));
        return;
      }
      setError(obtenerMensajeDeError(errorApi));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setEstaEnviando(false);
    }
  };

  return (
    <form ref={formulario} onSubmit={enviar} noValidate className="space-y-6">
      {/* Resumen superior elegante con foto */}
      <div className="flex flex-col gap-4 overflow-hidden rounded-3xl bg-white p-4 shadow-sm ring-1 ring-bosque/10 sm:flex-row sm:items-center sm:p-5">
        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:w-28">
          <img
            src={visual.imagen}
            alt={actividad.nombre}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-black tracking-wider text-hoja uppercase">Completá los datos</p>
          <h2 className="text-2xl font-black text-bosque">{actividad.nombre}</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-stone-600">
            <span className="flex items-center gap-1">
              <IconoCalendario className="size-3.5 text-hoja" />
              <span className="capitalize">{formatearDia(turno.horario)}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <IconoReloj className="size-3.5 text-hoja" />
              {formatearHora(turno.horario)} hs
            </span>
          </div>
        </div>
      </div>

      <MensajeError mensaje={error} />

      {/* Tarjeta de Correo Electrónico */}
      <div className="rounded-3xl bg-white p-5 shadow-xs ring-1 ring-bosque/10">
        <label className="block text-xs font-bold text-stone-700">
          <span className="flex items-center gap-1.5 mb-1 text-sm font-black text-bosque">
            <IconoMail className="size-4 text-hoja" />
            Email para recibir el pase y confirmación
          </span>
          <p className="mb-2 text-xs font-normal text-stone-500">
            Te enviaremos el comprobante oficial con código QR para ingresar a la actividad.
          </p>
          <input
            type="email"
            value={email}
            onChange={(evento) => cambiarEmail(evento.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="visitante@correo.com"
            aria-invalid={Boolean(errores.email)}
            aria-describedby={errores.email ? "error-email" : undefined}
            className={`mt-1 block min-h-12 w-full rounded-2xl border bg-white px-3.5 text-sm transition placeholder:text-stone-400 focus:border-hoja focus:outline-hidden focus:ring-3 focus:ring-brote/40 ${
              errores.email ? "border-alerta ring-1 ring-alerta/50" : "border-stone-200"
            }`}
          />
          <MensajeCampo id="error-email" mensaje={errores.email} />
        </label>
      </div>

      {/* Selector de cantidad de personas */}
      <div className="rounded-3xl bg-white p-5 shadow-xs ring-1 ring-bosque/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="flex items-center gap-1.5 text-sm font-black text-bosque">
              <IconoPersonas className="size-4 text-hoja" />
              Cantidad de participantes
            </span>
            <p className="mt-0.5 text-xs text-stone-500">
              Quedan <strong className="text-bosque">{turno.cuposDisponibles} lugares</strong> en este turno.
            </p>
          </div>
          <SelectorCantidad
            cantidad={participantes.length}
            maximo={turno.cuposDisponibles}
            alCambiar={cambiarCantidad}
          />
        </div>
      </div>

      {/* Participantes */}
      <div className="space-y-4">
        {participantes.map((participante, indice) => (
          <TarjetaParticipante
            key={indice}
            numero={indice + 1}
            participante={participante}
            errores={errores.participantes[indice]}
            requiereTalle={actividad.requiereTalle}
            alCambiar={cambiarParticipante(indice)}
          />
        ))}
      </div>

      {/* Términos y condiciones */}
      <div
        className={`rounded-3xl bg-white p-5 shadow-xs ring-1 transition-all ${
          errores.terminos ? "ring-2 ring-alerta" : "ring-bosque/10"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <input
            id="acepta-terminos"
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(evento) => cambiarAceptaTerminos(evento.target.checked)}
            aria-invalid={Boolean(errores.terminos)}
            aria-describedby={errores.terminos ? "error-terminos" : undefined}
            className="mt-1 size-5 shrink-0 rounded-lg accent-bosque cursor-pointer"
          />
          <label htmlFor="acepta-terminos" className="text-xs leading-relaxed text-stone-700 cursor-pointer">
            He leído y acepto el{" "}
            <button
              type="button"
              onClick={() => setHayModalAbierto(true)}
              className="font-bold text-bosque underline underline-offset-3 hover:text-hoja"
            >
              reglamento de seguridad y términos de {actividad.nombre}
            </button>
            , comprometiéndome a respetar las pautas de cuidado ambiental del parque.
          </label>
        </div>
        <MensajeCampo id="error-terminos" mensaje={errores.terminos} />
      </div>

      {/* Botón principal */}
      <button
        type="submit"
        disabled={estaEnviando}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bosque px-6 text-base font-black text-white shadow-md transition-all hover:bg-hoja active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {estaEnviando ? (
          <>
            <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Confirmando reserva…</span>
          </>
        ) : (
          <>
            <IconoHoja className="size-5 text-brote" />
            <span>Confirmar inscripción</span>
          </>
        )}
      </button>

      {hayModalAbierto && (
        <ModalTerminos
          actividad={actividad}
          alCerrar={() => setHayModalAbierto(false)}
          alAceptar={() => {
            cambiarAceptaTerminos(true);
            setHayModalAbierto(false);
          }}
        />
      )}
    </form>
  );
}
