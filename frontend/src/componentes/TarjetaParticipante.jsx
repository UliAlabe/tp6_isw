import MensajeCampo from "./MensajeCampo.jsx";

const TALLES = ["XS", "S", "M", "L", "XL", "XXL"];

const ESTILO_CAMPO =
  "mt-1 block min-h-12 w-full rounded-xl border bg-white px-3 text-base focus:border-hoja focus:outline-2 focus:outline-brote";

function obtenerEstiloCampo(mensajeDeError) {
  return `${ESTILO_CAMPO} ${mensajeDeError ? "border-alerta" : "border-stone-300"}`;
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

  return (
    <fieldset className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-bosque/10">
      <legend className="sr-only">Participante {numero}</legend>
      <p className="mb-3 font-black text-bosque">Participante {numero}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold sm:col-span-2">
          Nombre y apellido
          <input
            className={obtenerEstiloCampo(errores.nombre)}
            value={participante.nombre}
            onChange={cambiarCampo("nombre")}
            autoComplete="name"
            {...obtenerPropsDeError(idDeError("nombre"), errores.nombre)}
          />
          <MensajeCampo id={idDeError("nombre")} mensaje={errores.nombre} />
        </label>
        <label className="text-sm font-bold">
          DNI
          <input
            className={obtenerEstiloCampo(errores.dni)}
            value={participante.dni}
            onChange={cambiarCampo("dni")}
            inputMode="numeric"
            {...obtenerPropsDeError(idDeError("dni"), errores.dni)}
          />
          <MensajeCampo id={idDeError("dni")} mensaje={errores.dni} />
        </label>
        <label className="text-sm font-bold">
          Edad
          <input
            className={obtenerEstiloCampo(errores.edad)}
            value={participante.edad}
            onChange={cambiarCampo("edad")}
            inputMode="numeric"
            {...obtenerPropsDeError(idDeError("edad"), errores.edad)}
          />
          <MensajeCampo id={idDeError("edad")} mensaje={errores.edad} />
        </label>
        {requiereTalle && (
          <label className="text-sm font-bold sm:col-span-2">
            Talle de vestimenta
            <select
              className={obtenerEstiloCampo(errores.talle)}
              value={participante.talle}
              onChange={cambiarCampo("talle")}
              {...obtenerPropsDeError(idDeError("talle"), errores.talle)}
            >
              <option value="">Elegí un talle</option>
              {TALLES.map((talle) => (
                <option key={talle} value={talle}>
                  {talle}
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
