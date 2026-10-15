const TALLES = ["XS", "S", "M", "L", "XL", "XXL"];

const ESTILO_CAMPO =
  "mt-1 block min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base focus:border-hoja focus:outline-2 focus:outline-brote";

export default function TarjetaParticipante({ numero, participante, requiereTalle, alCambiar }) {
  const cambiarCampo = (campo) => (evento) =>
    alCambiar({ ...participante, [campo]: evento.target.value });

  return (
    <fieldset className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-bosque/10">
      <legend className="sr-only">Participante {numero}</legend>
      <p className="mb-3 font-black text-bosque">Participante {numero}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold sm:col-span-2">
          Nombre y apellido
          <input
            className={ESTILO_CAMPO}
            value={participante.nombre}
            onChange={cambiarCampo("nombre")}
            autoComplete="name"
          />
        </label>
        <label className="text-sm font-bold">
          DNI
          <input
            className={ESTILO_CAMPO}
            value={participante.dni}
            onChange={cambiarCampo("dni")}
            inputMode="numeric"
          />
        </label>
        <label className="text-sm font-bold">
          Edad
          <input
            className={ESTILO_CAMPO}
            value={participante.edad}
            onChange={cambiarCampo("edad")}
            inputMode="numeric"
          />
        </label>
        {requiereTalle && (
          <label className="text-sm font-bold sm:col-span-2">
            Talle de vestimenta
            <select
              className={ESTILO_CAMPO}
              value={participante.talle}
              onChange={cambiarCampo("talle")}
            >
              <option value="">Elegí un talle</option>
              {TALLES.map((talle) => (
                <option key={talle} value={talle}>
                  {talle}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </fieldset>
  );
}
