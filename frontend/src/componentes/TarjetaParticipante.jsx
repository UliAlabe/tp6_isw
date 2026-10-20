import { IconoDocumento, IconoEdad, IconoTalle, IconoUsuario } from "./Iconos.jsx";
import MensajeCampo from "./MensajeCampo.jsx";

const TALLES = ["XS", "S", "M", "L", "XL", "XXL"];

const ESTILO_INPUT_BASE =
  "mt-1 block min-h-12 w-full rounded-2xl border bg-white px-3.5 text-sm text-stone-800 transition placeholder:text-stone-400 focus:border-hoja focus:outline-hidden focus:ring-3 focus:ring-brote/40";

function obtenerEstiloCampo(mensajeDeError) {
  return `${ESTILO_INPUT_BASE} ${
    mensajeDeError ? "border-alerta ring-1 ring-alerta/50" : "border-stone-200 hover:border-stone-300"
  }`;
}

function obtenerPropsDeError(idError, mensajeDeError) {
  return {
    "aria-invalid": Boolean(mensajeDeError),
    "aria-describedby": mensajeDeError ? idError : undefined,
  };
}

export default function TarjetaParticipante({
  numero,
  participante,
  errores,
  requiereTalle,
  alCambiar,
}) {
  const cambiarCampo = (campo) => (evento) =>
    alCambiar({ ...participante, [campo]: evento.target.value }, campo);

  const idDeError = (campo) => `error-participante-${numero}-${campo}`;
  const esTitular = numero === 1;

  return (
    <fieldset className="rounded-3xl bg-white p-5 shadow-xs ring-1 ring-bosque/10 transition-all">
      <legend className="sr-only">Participante {numero}</legend>

      <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-crema font-black text-bosque">
            {numero}
          </div>
          <div>
            <p className="text-sm font-black text-bosque">
              Participante {numero} {esTitular && <span className="text-xs font-normal text-stone-500">(Titular)</span>}
            </p>
            <p className="text-[11px] text-stone-400">Datos para el seguro y acceso al sendero</p>
          </div>
        </div>
        <span className="rounded-full bg-crema/70 px-2.5 py-0.5 text-[11px] font-bold text-hoja">
          Visitante
        </span>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className="text-xs font-bold text-stone-700 sm:col-span-2">
          <span className="flex items-center gap-1.5 mb-1">
            <IconoUsuario className="size-3.5 text-hoja" />
            Nombre y apellido completo
          </span>
          <input
            className={obtenerEstiloCampo(errores.nombre)}
            value={participante.nombre}
            onChange={cambiarCampo("nombre")}
            placeholder="Ej. Sofía Martínez"
            autoComplete="name"
            {...obtenerPropsDeError(idDeError("nombre"), errores.nombre)}
          />
          <MensajeCampo id={idDeError("nombre")} mensaje={errores.nombre} />
        </label>

        <label className="text-xs font-bold text-stone-700">
          <span className="flex items-center gap-1.5 mb-1">
            <IconoDocumento className="size-3.5 text-hoja" />
            DNI (sin puntos)
          </span>
          <input
            className={obtenerEstiloCampo(errores.dni)}
            value={participante.dni}
            onChange={cambiarCampo("dni")}
            placeholder="Ej. 34567890"
            inputMode="numeric"
            {...obtenerPropsDeError(idDeError("dni"), errores.dni)}
          />
          <MensajeCampo id={idDeError("dni")} mensaje={errores.dni} />
        </label>

        <label className="text-xs font-bold text-stone-700">
          <span className="flex items-center gap-1.5 mb-1">
            <IconoEdad className="size-3.5 text-hoja" />
            Edad
          </span>
          <input
            className={obtenerEstiloCampo(errores.edad)}
            value={participante.edad}
            onChange={cambiarCampo("edad")}
            placeholder="Años cumplidos"
            inputMode="numeric"
            {...obtenerPropsDeError(idDeError("edad"), errores.edad)}
          />
          <MensajeCampo id={idDeError("edad")} mensaje={errores.edad} />
        </label>

        {requiereTalle && (
          <label className="text-xs font-bold text-stone-700 sm:col-span-2">
            <span className="flex items-center gap-1.5 mb-1">
              <IconoTalle className="size-3.5 text-hoja" />
              Talle para arnés y equipamiento de seguridad
            </span>
            <select
              className={obtenerEstiloCampo(errores.talle)}
              value={participante.talle}
              onChange={cambiarCampo("talle")}
              {...obtenerPropsDeError(idDeError("talle"), errores.talle)}
            >
              <option value="">Seleccioná un talle de equipamiento</option>
              {TALLES.map((talle) => (
                <option key={talle} value={talle}>
                  Talle {talle}
                </option>
              ))}
            </select>
            <MensajeCampo id={idDeError("talle")} mensaje={errores.talle} />
          </label>
        )}
      </div>
    </fieldset>
  );
}
