import { useEffect, useState } from "react";

import { obtenerTerminos } from "../api/cliente.js";
import { obtenerMensajeDeError } from "../utilidades/errores.js";
import Cargando from "./Cargando.jsx";
import MensajeError from "./MensajeError.jsx";

export default function ModalTerminos({ actividad, alAceptar, alCerrar }) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");

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
      className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={alCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-terminos"
        onClick={(evento) => evento.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-3xl bg-white sm:rounded-3xl"
      >
        <h2 id="titulo-terminos" className="px-5 pt-5 text-lg font-black text-bosque">
          Términos y condiciones · {actividad.nombre}
        </h2>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm leading-relaxed">
          <MensajeError mensaje={error} />
          {!texto && !error && <Cargando />}
          {texto.split("\n").map((clausula) => (
            <p key={clausula}>{clausula}</p>
          ))}
        </div>
        <div className="flex gap-3 border-t border-stone-100 p-4">
          <button
            type="button"
            onClick={alCerrar}
            className="min-h-12 flex-1 rounded-xl font-bold text-bosque ring-1 ring-bosque/30"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={alAceptar}
            disabled={!texto}
            className="min-h-12 flex-1 rounded-xl bg-bosque font-bold text-white disabled:opacity-50"
          >
            Acepto
          </button>
        </div>
      </div>
    </div>
  );
}
