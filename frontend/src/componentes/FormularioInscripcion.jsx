import { useState } from "react";

import { crearInscripcion } from "../api/cliente.js";
import { esErrorDeHorario, obtenerMensajeDeError } from "../utilidades/errores.js";
import { formatearDia, formatearHora } from "../utilidades/fechas.js";
import MensajeError from "./MensajeError.jsx";
import ModalTerminos from "./ModalTerminos.jsx";
import TarjetaParticipante from "./TarjetaParticipante.jsx";

const PARTICIPANTE_VACIO = { nombre: "", dni: "", edad: "", talle: "" };

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
    "size-12 rounded-xl bg-white text-2xl font-black text-bosque ring-1 ring-bosque/20 disabled:opacity-40";
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
      <span className="min-w-8 text-center text-2xl font-black" aria-live="polite">
        {cantidad}
      </span>
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
  const [email, setEmail] = useState("");
  const [participantes, setParticipantes] = useState([PARTICIPANTE_VACIO]);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [hayModalAbierto, setHayModalAbierto] = useState(false);
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [error, setError] = useState("");

  const cambiarCantidad = (cantidad) =>
    setParticipantes((actuales) =>
      Array.from({ length: cantidad }, (_, indice) => actuales[indice] ?? PARTICIPANTE_VACIO),
    );

  const cambiarParticipante = (indice) => (participante) =>
    setParticipantes((actuales) =>
      actuales.map((actual, posicion) => (posicion === indice ? participante : actual)),
    );

  const enviar = async (evento) => {
    evento.preventDefault();
    setError("");
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
    <form onSubmit={enviar} noValidate className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-bosque">Completá la inscripción</h2>
        <p className="mt-1 text-sm">
          {actividad.nombre} · <span className="capitalize">{formatearDia(turno.horario)}</span> ·{" "}
          {formatearHora(turno.horario)} hs
        </p>
      </div>
      <MensajeError mensaje={error} />

      <label className="block text-sm font-bold">
        Email para recibir la confirmación
        <input
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          autoComplete="email"
          inputMode="email"
          placeholder="nombre@correo.com"
          className="mt-1 block min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base focus:border-hoja focus:outline-2 focus:outline-brote"
        />
      </label>

      <div>
        <p className="mb-2 text-sm font-bold">¿Cuántas personas participan?</p>
        <SelectorCantidad
          cantidad={participantes.length}
          maximo={turno.cuposDisponibles}
          alCambiar={cambiarCantidad}
        />
        <p className="mt-1 text-xs text-stone-500">
          Quedan {turno.cuposDisponibles} lugares en este turno.
        </p>
      </div>

      {participantes.map((participante, indice) => (
        <TarjetaParticipante
          key={indice}
          numero={indice + 1}
          participante={participante}
          requiereTalle={actividad.requiereTalle}
          alCambiar={cambiarParticipante(indice)}
        />
      ))}

      <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-bosque/10">
        <input
          id="acepta-terminos"
          type="checkbox"
          checked={aceptaTerminos}
          onChange={(evento) => setAceptaTerminos(evento.target.checked)}
          className="mt-0.5 size-6 shrink-0 accent-bosque"
        />
        <label htmlFor="acepta-terminos" className="text-sm">
          Leí y acepto los{" "}
          <button
            type="button"
            onClick={() => setHayModalAbierto(true)}
            className="font-bold text-bosque underline underline-offset-2"
          >
            términos y condiciones de {actividad.nombre}
          </button>
        </label>
      </div>

      <button
        type="submit"
        disabled={estaEnviando}
        className="min-h-14 w-full rounded-2xl bg-bosque text-lg font-black text-white shadow-md transition active:scale-[0.99] disabled:opacity-60"
      >
        {estaEnviando ? "Inscribiendo…" : "Confirmar inscripción"}
      </button>

      {hayModalAbierto && (
        <ModalTerminos
          actividad={actividad}
          alCerrar={() => setHayModalAbierto(false)}
          alAceptar={() => {
            setAceptaTerminos(true);
            setHayModalAbierto(false);
          }}
        />
      )}
    </form>
  );
}
