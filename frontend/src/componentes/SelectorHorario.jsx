import { useEffect, useState } from "react";

import { obtenerHorarios } from "../api/cliente.js";
import { obtenerMensajeDeError } from "../utilidades/errores.js";
import { formatearHora, obtenerFechasConsultables } from "../utilidades/fechas.js";
import Cargando from "./Cargando.jsx";
import MensajeError from "./MensajeError.jsx";

function describirTurno(turno) {
  if (!turno.inscripcionAbierta) {
    return "No disponible";
  }
  if (turno.cuposDisponibles === 0) {
    return "Sin cupo";
  }
  return `${turno.cuposDisponibles} ${turno.cuposDisponibles === 1 ? "lugar" : "lugares"}`;
}

function BotonTurno({ turno, alElegir }) {
  const estaHabilitado = turno.inscripcionAbierta && turno.cuposDisponibles > 0;
  return (
    <button
      type="button"
      disabled={!estaHabilitado}
      onClick={() => alElegir(turno)}
      className="flex min-h-16 flex-col items-center justify-center rounded-xl bg-white p-2 shadow-sm ring-1 ring-bosque/15 transition enabled:hover:ring-hoja enabled:active:scale-95 disabled:bg-stone-100 disabled:text-stone-400 disabled:shadow-none"
    >
      <span className="text-lg font-black">{formatearHora(turno.horario)}</span>
      <span className="text-xs font-bold">{describirTurno(turno)}</span>
    </button>
  );
}

export default function SelectorHorario({ actividad, mensajeInicial, alElegir }) {
  const [dias, setDias] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fechas = obtenerFechasConsultables();
    Promise.all(fechas.map(({ fecha }) => obtenerHorarios(actividad.id, fecha)))
      .then((turnosPorDia) =>
        setDias(fechas.map((dia, indice) => ({ ...dia, turnos: turnosPorDia[indice] }))),
      )
      .catch((errorApi) => setError(obtenerMensajeDeError(errorApi)));
  }, [actividad.id]);

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-black text-bosque">Elegí un horario</h2>
      <MensajeError mensaje={mensajeInicial || error} />
      {!dias && !error && <Cargando texto="Buscando horarios…" />}
      {dias?.map((dia) => (
        <div key={dia.fecha}>
          <h3 className="mb-2 font-bold text-hoja">{dia.titulo}</h3>
          {dia.turnos.length === 0 ? (
            <p className="rounded-xl bg-white/60 px-4 py-3 text-sm">El parque está cerrado ese día.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {dia.turnos.map((turno) => (
                <BotonTurno key={turno.horario} turno={turno} alElegir={alElegir} />
              ))}
            </div>
          )}
        </div>
      ))}
      <p className="text-xs text-stone-500">
        Podés inscribirte desde 24 horas antes hasta 15 minutos antes de cada turno.
      </p>
    </section>
  );
}
