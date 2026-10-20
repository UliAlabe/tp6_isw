import { useState } from "react";

import ConfirmacionInscripcion from "./componentes/ConfirmacionInscripcion.jsx";
import FormularioInscripcion from "./componentes/FormularioInscripcion.jsx";
import {
  IconoArbol,
  IconoCheck,
  IconoFlechaVolver,
  IconoHoja,
  IconoPersonas,
  IconoReloj,
} from "./componentes/Iconos.jsx";
import ListaActividades from "./componentes/ListaActividades.jsx";
import SelectorHorario from "./componentes/SelectorHorario.jsx";
import logoParque from "./imagenes/logo.png";
import { USUARIO_LOGUEADO, obtenerIniciales } from "./utilidades/sesion.js";

const PASOS = ["actividad", "horario", "datos", "confirmacion"];
const PASOS_CONFIG = [
  { clave: "actividad", titulo: "Actividad", icono: IconoArbol },
  { clave: "horario", titulo: "Horario", icono: IconoReloj },
  { clave: "datos", titulo: "Datos", icono: IconoPersonas },
];

function IndicadorDePasos({ pasoActual }) {
  const indiceActual = PASOS.indexOf(pasoActual);

  return (
    <nav aria-label="Progreso de la inscripción" className="pt-1">
      <ol className="flex items-center justify-between gap-2">
        {PASOS_CONFIG.map(({ clave, titulo, icono: IconoPaso }, indice) => {
          const esCompletado = indice < indiceActual;
          const esActivo = clave === pasoActual;

          return (
            <li
              key={clave}
              aria-current={esActivo ? "step" : undefined}
              className="flex flex-1 items-center gap-2"
            >
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                  esActivo
                    ? "bg-brote text-bosque shadow-xs ring-2 ring-white/50"
                    : esCompletado
                      ? "bg-hoja text-white"
                      : "bg-white/15 text-white/50"
                }`}
              >
                {esCompletado ? <IconoCheck className="size-3.5" /> : indice + 1}
              </div>
              <span
                className={`truncate text-xs font-bold hidden sm:inline ${
                  esActivo ? "text-white" : esCompletado ? "text-white/80" : "text-white/40"
                }`}
              >
                {titulo}
              </span>
              {indice < PASOS_CONFIG.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded-full ${
                    indice < indiceActual ? "bg-brote/60" : "bg-white/15"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function UsuarioLogueado() {
  return (
    <div
      className="flex shrink-0 items-center gap-2.5 rounded-2xl bg-white/10 px-3 py-1.5 backdrop-blur-xs ring-1 ring-white/10"
      aria-label="Usuario logueado"
    >
      <div className="hidden text-right leading-tight sm:block">
        <span className="block text-[10px] font-bold text-crema/70 uppercase">Visitante</span>
        <span className="text-xs font-black text-white">{USUARIO_LOGUEADO.nombre}</span>
      </div>
      <span
        title={USUARIO_LOGUEADO.nombre}
        className="flex size-9 items-center justify-center rounded-xl bg-brote text-xs font-black text-bosque shadow-xs"
      >
        {obtenerIniciales(USUARIO_LOGUEADO.nombre)}
      </span>
    </div>
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
    <div className="flex min-h-dvh flex-col">
      {/* Header temático de EcoHarmony Park */}
      <header className="relative bg-gradient-to-b from-bosque to-[#2d5234] text-white shadow-md">
        {/* Barra superior de información ambiental */}
        <div className="border-b border-white/10 bg-black/15 px-4 py-1 text-center text-[11px] font-bold tracking-wide text-crema/80">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-brote animate-pulse" />
            Parque Abierto Hoy · Horario: 9:00 a 18:00 hs · Turismo Sostenible
          </span>
        </div>

        <div className="mx-auto max-w-2xl px-4 pt-4 pb-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {hayPasoAnterior && (
                <button
                  type="button"
                  onClick={volver}
                  aria-label="Volver al paso anterior"
                  className="-ml-2 flex size-10 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20 active:scale-90"
                >
                  <IconoFlechaVolver className="size-5" />
                </button>
              )}

              <div className="flex items-center gap-3">
                <div className="relative flex size-12 shrink-0 items-center justify-center">
                  <img
                    src={logoParque}
                    alt="Logo EcoHarmony Park"
                    className="size-full object-contain drop-shadow-md"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest text-brote uppercase">
                    EcoHarmony Park
                  </p>
                  <h1 className="text-xl font-black leading-tight sm:text-2xl">
                    Inscripción a Actividades
                  </h1>
                </div>
              </div>
            </div>

            <UsuarioLogueado />
          </div>

          {paso !== "confirmacion" && <IndicadorDePasos pasoActual={paso} />}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
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

      {/* Footer ecológico del parque */}
      <footer className="mt-auto border-t border-stone-200/60 bg-crema/40 py-6 text-center text-xs text-stone-600">
        <div className="mx-auto max-w-2xl px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-hoja">
            <img src={logoParque} alt="Logo" className="size-5 object-contain" />
            <span>EcoHarmony Park · Reserva Natural Protegida</span>
          </div>
          <p className="text-stone-500">
            Cuidemos nuestros senderos y fauna nativa. No arrojes residuos fuera de los cestos clasificadores.
          </p>
        </div>
      </footer>
    </div>
  );
}
