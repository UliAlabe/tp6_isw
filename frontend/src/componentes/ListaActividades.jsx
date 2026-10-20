import { useEffect, useState } from "react";

import { obtenerActividades } from "../api/cliente.js";
import logoParque from "../imagenes/logo.png";
import { obtenerDetallesVisuales } from "../utilidades/actividadesVisuales.js";
import { obtenerMensajeDeError } from "../utilidades/errores.js";
import Cargando from "./Cargando.jsx";
import {
  IconoEdad,
  IconoFlechaAdelante,
  IconoHoja,
  IconoPersonas,
  IconoTalle,
} from "./Iconos.jsx";
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
    return <Cargando texto="Cargando experiencias del ecoparque…" />;
  }

  return (
    <section className="space-y-6">
      {/* Banner de bienvenida al ecoparque */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bosque via-[#2d5234] to-hoja p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brote/25 px-3 py-1 text-xs font-black tracking-wide text-crema uppercase">
              <IconoHoja className="size-3.5 text-brote" />
              Experiencias en la Naturaleza
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Viví la armonía del parque
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-crema/90">
              Elegí tu próxima actividad al aire libre. Todas nuestras propuestas están diseñadas
              con guías especializados y respetando los ciclos del entorno natural.
            </p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <div className="size-24">
              <img
                src={logoParque}
                alt="EcoHarmony Park"
                className="size-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
        {/* Decoración botánica de fondo */}
        <div className="pointer-events-none absolute -right-6 -bottom-8 opacity-10">
          <IconoHoja className="size-48 text-brote" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-xl font-black text-bosque">Actividades disponibles</h3>
          <p className="text-xs text-stone-600">Seleccioná una para consultar horarios y cupos</p>
        </div>
        <span className="rounded-full bg-hoja/15 px-3 py-1 text-xs font-bold text-bosque">
          {actividades.length} opciones
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {actividades.map((actividad) => {
          const visual = obtenerDetallesVisuales(actividad.id);
          return (
            <article
              key={actividad.id}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-bosque/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-hoja/40 focus-within:ring-2 focus-within:ring-brote"
            >
              {/* Imagen con badges */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                <img
                  src={visual.imagen}
                  alt={`Actividad ${actividad.nombre} en EcoHarmony Park`}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-bosque/90 px-3 py-1 text-xs font-black tracking-wide text-white shadow-sm backdrop-blur-xs">
                    {visual.categoria}
                  </span>
                </div>

                <div className="absolute right-3 bottom-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-bosque shadow-sm backdrop-blur-xs">
                    {visual.destacado}
                  </span>
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-2.5">
                  <h4 className="text-xl font-black text-bosque transition-colors group-hover:text-hoja">
                    {actividad.nombre}
                  </h4>
                  <p className="text-xs leading-relaxed text-stone-600">{visual.lema}</p>

                  {/* Etiquetas / Atributos de la actividad */}
                  <div className="flex flex-wrap gap-2 pt-1 text-xs font-bold">
                    <span className="inline-flex items-center gap-1 rounded-xl bg-crema px-2.5 py-1 text-stone-800">
                      <IconoEdad className="size-3.5 text-hoja" />
                      {describirEdad(actividad.edadMinima)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-crema px-2.5 py-1 text-stone-800">
                      <IconoPersonas className="size-3.5 text-hoja" />
                      Hasta {actividad.cupoMaximo} pers.
                    </span>
                    {actividad.requiereTalle && (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-brote/35 px-2.5 py-1 text-bosque">
                        <IconoTalle className="size-3.5 text-bosque" />
                        Requiere talle
                      </span>
                    )}
                  </div>
                </div>

                {/* Botón de acción */}
                <div className="pt-5">
                  <button
                    type="button"
                    onClick={() => alElegir(actividad)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-bosque px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-hoja active:scale-[0.98] focus:outline-hidden"
                  >
                    <span>Ver horarios disponibles</span>
                    <IconoFlechaAdelante className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
