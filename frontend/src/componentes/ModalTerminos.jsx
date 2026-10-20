import { useEffect, useState } from "react";

import { obtenerTerminos } from "../api/cliente.js";
import { obtenerDetallesVisuales } from "../utilidades/actividadesVisuales.js";
import { obtenerMensajeDeError } from "../utilidades/errores.js";
import Cargando from "./Cargando.jsx";
import { IconoDocumento, IconoHoja } from "./Iconos.jsx";
import MensajeError from "./MensajeError.jsx";

export default function ModalTerminos({ actividad, alAceptar, alCerrar }) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");
  const visual = obtenerDetallesVisuales(actividad.id);

  useEffect(() => {
    obtenerTerminos(actividad.id)
      .then((terminos) => setTexto(terminos.texto))
      .catch((errorApi) => setError(obtenerMensajeDeError(errorApi)));
  }, [actividad.id]);

  useEffect(() => {
    const cerrarConEscape = (evento) => evento.key === "Escape" && alCerrar();
    window.addEventListener("keydown", cerrarConEscape);
    return () => window.removeEventListener("keydown", cerrarConEscape);
  }, [alCerrar]);

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={alCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-terminos"
        onClick={(evento) => evento.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Cabecera del modal */}
        <div className="flex items-center gap-3 border-b border-stone-100 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-crema text-bosque">
            <IconoDocumento className="size-5 text-hoja" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black tracking-wider text-hoja uppercase">
              Reglamento del Parque
            </p>
            <h2 id="titulo-terminos" className="truncate text-lg font-black text-bosque">
              Términos · {actividad.nombre}
            </h2>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar ventana"
            className="flex size-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            ✕
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 space-y-3 overflow-y-auto p-5 text-xs leading-relaxed text-stone-700">
          <MensajeError mensaje={error} />
          {!texto && !error && <Cargando texto="Cargando normas de seguridad…" />}

          {/* Banner informativo de seguridad */}
          {texto && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-crema/60 p-3 text-stone-700">
              <IconoHoja className="mt-0.5 size-4 shrink-0 text-hoja" />
              <p>
                <strong>Compromiso EcoHarmony:</strong> Cuidamos a los visitantes y preservamos la
                biodiversidad del parque. Por favor leé las siguientes cláusulas con atención.
              </p>
            </div>
          )}

          {texto.split("\n").map((clausula, indice) => (
            <p key={indice} className="border-l-2 border-hoja/30 pl-3">
              {clausula}
            </p>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex gap-3 border-t border-stone-100 p-4 bg-stone-50/50 rounded-b-3xl">
          <button
            type="button"
            onClick={alCerrar}
            className="min-h-12 flex-1 rounded-2xl font-bold text-stone-600 transition hover:bg-stone-200/60 active:scale-95"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={alAceptar}
            disabled={!texto}
            className="min-h-12 flex-1 rounded-2xl bg-bosque font-black text-white shadow-sm transition hover:bg-hoja active:scale-95 disabled:opacity-50"
          >
            Acepto los términos
          </button>
        </div>
      </div>
    </div>
  );
}
