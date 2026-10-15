import { useEffect, useState } from "react";

import { obtenerActividades } from "../api/cliente.js";
import { obtenerMensajeDeError } from "../utilidades/errores.js";
import Cargando from "./Cargando.jsx";
import MensajeError from "./MensajeError.jsx";

function describirEdad(edadMinima) {
  return edadMinima > 0 ? `Desde ${edadMinima} años` : "Para todas las edades";
}

export default function ListaActividades({ alElegir }) {
  const [actividades, setActividades] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerActividades()
      .then(setActividades)
      .catch((errorApi) => setError(obtenerMensajeDeError(errorApi)));
  }, []);

  if (error) {
    return <MensajeError mensaje={error} />;
  }
  if (!actividades) {
    return <Cargando texto="Buscando actividades…" />;
  }
  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-bosque">¿Qué querés hacer?</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {actividades.map((actividad) => (
          <li key={actividad.id}>
            <button
              type="button"
              onClick={() => alElegir(actividad)}
              className="w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-bosque/10 transition hover:ring-hoja focus-visible:outline-3 focus-visible:outline-brote active:scale-[0.99]"
            >
              <span className="block text-lg font-black text-bosque">{actividad.nombre}</span>
              <span className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full bg-crema px-3 py-1">
                  {describirEdad(actividad.edadMinima)}
                </span>
                <span className="rounded-full bg-crema px-3 py-1">
                  Hasta {actividad.cupoMaximo} personas por turno
                </span>
                {actividad.requiereTalle && (
                  <span className="rounded-full bg-brote/40 px-3 py-1 text-bosque">
                    Requiere talle
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
