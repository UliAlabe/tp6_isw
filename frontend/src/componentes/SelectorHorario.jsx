import { useEffect, useState } from "react";

import { obtenerHorarios } from "../api/cliente.js";
import { obtenerDetallesVisuales } from "../utilidades/actividadesVisuales.js";
import { obtenerMensajeDeError } from "../utilidades/errores.js";
import { formatearHora, obtenerFechasConsultables } from "../utilidades/fechas.js";
import Cargando from "./Cargando.jsx";
import {
  IconoCalendario,
  IconoEdad,
  IconoPersonas,
  IconoReloj,
  IconoTalle,
} from "./Iconos.jsx";
import MensajeError from "./MensajeError.jsx";

function describirTurno(turno) {
  if (!turno.inscripcionAbierta) {
    return "No disponible";
  }
  if (turno.cuposDisponibles === 0) {
    return "Sin cupo";
  }
  if (turno.cuposDisponibles <= 2) {
    return `¡Últimos ${turno.cuposDisponibles}!`;
  }
  return `${turno.cuposDisponibles} ${turno.cuposDisponibles === 1 ? "lugar" : "lugares"}`;
}

function BotonTurno({ turno, alElegir }) {
  const estaHabilitado = turno.inscripcionAbierta && turno.cuposDisponibles > 0;
  const esUltimosLugares = estaHabilitado && turno.cuposDisponibles <= 2;

  return (
    <button
      type="button"
      disabled={!estaHabilitado}
      onClick={() => alElegir(turno)}
      className={`group relative flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all duration-200 ${
        estaHabilitado
          ? "bg-white shadow-xs ring-1 ring-bosque/15 hover:-translate-y-0.5 hover:shadow-md hover:ring-2 hover:ring-hoja active:scale-95"
          : "bg-stone-100/70 text-stone-400 ring-1 ring-stone-200/80 cursor-not-allowed"
      }`}
    >
      <span
        className={`text-lg font-black tracking-tight ${
          estaHabilitado ? "text-bosque group-hover:text-hoja" : "text-stone-400"
        }`}
      >
        {formatearHora(turno.horario)}
      </span>
      <span
        className={`mt-1 text-[11px] font-bold ${
          esUltimosLugares
            ? "rounded-md bg-brote/35 px-1.5 py-0.5 text-bosque"
            : estaHabilitado
              ? "text-hoja"
              : "text-stone-400"
        }`}
      >
        {describirTurno(turno)}
      </span>
    </button>
  );
}

export default function SelectorHorario({ actividad, mensajeInicial, alElegir }) {
  const [dias, setDias] = useState(null);
  const [error, setError] = useState("");
  const visual = obtenerDetallesVisuales(actividad.id);

  useEffect(() => {
    const fechas = obtenerFechasConsultables();
    Promise.all(fechas.map(({ fecha }) => obtenerHorarios(actividad.id, fecha)))
      .then((turnosPorDia) =>
        setDias(fechas.map((dia, indice) => ({ ...dia, turnos: turnosPorDia[indice] }))),
      )
      .catch((errorApi) => setError(obtenerMensajeDeError(errorApi)));
  }, [actividad.id]);

  return (
    <section className="space-y-6">
      {/* Resumen de la actividad elegida */}
      <div className="flex flex-col gap-4 overflow-hidden rounded-3xl bg-white p-4 shadow-sm ring-1 ring-bosque/10 sm:flex-row sm:items-center sm:p-5">
        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:h-24 sm:w-32">
          <img
            src={visual.imagen}
            alt={actividad.nombre}
            className="h-full w-full object-cover"
          />
          <span className="absolute top-2 left-2 rounded-full bg-bosque/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
            {visual.categoria}
          </span>
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-xs font-black tracking-wider text-hoja uppercase">Actividad seleccionada</p>
          <h2 className="text-2xl font-black text-bosque">{actividad.nombre}</h2>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-stone-600">
            <span className="inline-flex items-center gap-1 rounded-lg bg-crema px-2.5 py-1">
              <IconoEdad className="size-3.5 text-hoja" />
              {actividad.edadMinima > 0 ? `Desde ${actividad.edadMinima} años` : "Todas las edades"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-crema px-2.5 py-1">
              <IconoPersonas className="size-3.5 text-hoja" />
              Hasta {actividad.cupoMaximo} personas
            </span>
            {actividad.requiereTalle && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-brote/35 px-2.5 py-1 text-bosque">
                <IconoTalle className="size-3.5 text-bosque" />
                Requiere talle
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-black text-bosque">Seleccioná fecha y turno</h3>
        <p className="text-xs text-stone-600">
          Los turnos se habilitan con 24 hs de anticipación y cierran 15 minutos antes.
        </p>
      </div>

      <MensajeError mensaje={mensajeInicial || error} />
      {!dias && !error && <Cargando texto="Consultando disponibilidad en tiempo real…" />}

      {dias?.map((dia) => (
        <div
          key={dia.fecha}
          className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-bosque/10 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-crema text-hoja">
              <IconoCalendario className="size-4" />
            </div>
            <div>
              <h4 className="font-black text-bosque">{dia.titulo}</h4>
              <p className="text-xs text-stone-500 capitalize">{dia.fecha}</p>
            </div>
          </div>

          {dia.turnos.length === 0 ? (
            <div className="rounded-2xl bg-crema/40 p-4 text-center text-sm font-bold text-stone-600">
              El parque se encuentra cerrado en esta fecha.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6">
              {dia.turnos.map((turno) => (
                <BotonTurno key={turno.horario} turno={turno} alElegir={alElegir} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Nota amigable de sustentabilidad y puntualidad */}
      <div className="flex items-start gap-3 rounded-2xl bg-crema/60 p-4 text-xs leading-relaxed text-stone-700">
        <IconoReloj className="mt-0.5 size-4 shrink-0 text-hoja" />
        <p>
          <strong>Consejo para tu visita:</strong> Te sugerimos presentarte en el punto de encuentro
          10 minutos antes del inicio de la actividad con calzado apropiado para senderos.
        </p>
      </div>
    </section>
  );
}
