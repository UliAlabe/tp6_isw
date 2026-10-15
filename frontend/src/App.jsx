import { useState } from "react";

import ConfirmacionInscripcion from "./componentes/ConfirmacionInscripcion.jsx";
import FormularioInscripcion from "./componentes/FormularioInscripcion.jsx";
import ListaActividades from "./componentes/ListaActividades.jsx";
import SelectorHorario from "./componentes/SelectorHorario.jsx";

const PASOS = ["actividad", "horario", "datos", "confirmacion"];
const TITULOS_DE_PASO = { actividad: "Actividad", horario: "Horario", datos: "Datos" };

function IndicadorDePasos({ pasoActual }) {
  const posicionActual = PASOS.indexOf(pasoActual);
  return (
    <ol className="flex gap-2 text-xs font-bold">
      {Object.entries(TITULOS_DE_PASO).map(([paso, titulo], posicion) => (
        <li
          key={paso}
          aria-current={paso === pasoActual ? "step" : undefined}
          className={`flex-1 border-b-4 pb-1 ${
            posicion <= posicionActual ? "border-brote text-white" : "border-white/20 text-white/60"
          }`}
        >
          {posicion + 1}. {titulo}
        </li>
      ))}
    </ol>
  );
}

export default function App() {
  const [paso, setPaso] = useState("actividad");
  const [actividad, setActividad] = useState(null);
  const [turno, setTurno] = useState(null);
  const [reserva, setReserva] = useState(null);
  const [mensajeDeHorario, setMensajeDeHorario] = useState("");

  const elegirActividad = (actividadElegida) => {
    setActividad(actividadElegida);
    setMensajeDeHorario("");
    setPaso("horario");
  };

  const elegirTurno = (turnoElegido) => {
    setTurno(turnoElegido);
    setPaso("datos");
  };

  const volverAHorarios = (mensaje) => {
    setMensajeDeHorario(mensaje);
    setPaso("horario");
  };

  const confirmar = (reservaCreada) => {
    setReserva(reservaCreada);
    setPaso("confirmacion");
  };

  const volver = () => {
    setMensajeDeHorario("");
    setPaso(PASOS[PASOS.indexOf(paso) - 1]);
  };

  const reiniciar = () => {
    setActividad(null);
    setTurno(null);
    setReserva(null);
    setPaso("actividad");
  };

  const hayPasoAnterior = paso === "horario" || paso === "datos";

  return (
    <div className="min-h-dvh">
      <header className="bg-bosque px-4 pt-5 pb-4 text-white">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center gap-3">
            {hayPasoAnterior && (
              <button
                type="button"
                onClick={volver}
                aria-label="Volver al paso anterior"
                className="-ml-2 flex size-10 items-center justify-center rounded-full text-2xl hover:bg-white/10"
              >
                ←
              </button>
            )}
            <div>
              <p className="text-xs font-bold tracking-widest text-brote uppercase">
                EcoHarmony Park
              </p>
              <h1 className="text-2xl font-black">Inscripción a actividades</h1>
            </div>
          </div>
          {paso !== "confirmacion" && <IndicadorDePasos pasoActual={paso} />}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {paso === "actividad" && <ListaActividades alElegir={elegirActividad} />}
        {paso === "horario" && (
          <SelectorHorario
            actividad={actividad}
            mensajeInicial={mensajeDeHorario}
            alElegir={elegirTurno}
          />
        )}
        {paso === "datos" && (
          <FormularioInscripcion
            actividad={actividad}
            turno={turno}
            alConfirmar={confirmar}
            alFallarHorario={volverAHorarios}
          />
        )}
        {paso === "confirmacion" && (
          <ConfirmacionInscripcion reserva={reserva} actividad={actividad} alTerminar={reiniciar} />
        )}
      </main>
    </div>
  );
}
