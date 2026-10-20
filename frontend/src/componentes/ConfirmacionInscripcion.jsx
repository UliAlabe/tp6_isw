import logoParque from "../imagenes/logo.png";
import { obtenerDetallesVisuales } from "../utilidades/actividadesVisuales.js";
import { formatearDia, formatearHora } from "../utilidades/fechas.js";
import {
  IconoCalendario,
  IconoCheck,
  IconoDescargar,
  IconoHoja,
  IconoPersonas,
  IconoReloj,
  IconoTicket,
} from "./Iconos.jsx";

function AvisoDeEmail({ email, esEnviado }) {
  if (esEnviado) {
    return (
      <p className="mt-1 text-sm text-stone-600">
        Te enviamos el comprobante y el código QR a <strong className="text-bosque">{email}</strong>.
      </p>
    );
  }
  return (
    <div className="mt-2 rounded-2xl bg-alerta/10 p-3.5 text-xs font-bold text-alerta">
      Tu lugar está reservado, pero no pudimos enviar el mail a {email}. Guardá este QR para
      presentarlo en el parque.
    </div>
  );
}

export default function ConfirmacionInscripcion({ reserva, actividad, alTerminar }) {
  const visual = obtenerDetallesVisuales(actividad.id);

  return (
    <section className="space-y-6 text-center animate-in fade-in duration-300">
      {/* Icono de éxito */}
      <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-brote text-bosque shadow-md">
        <IconoCheck className="size-8" />
      </div>

      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-hoja/15 px-3 py-1 text-xs font-bold text-hoja uppercase">
          <IconoHoja className="size-3.5 text-hoja" />
          EcoHarmony Pass
        </span>
        <h2 className="mt-2 text-2xl font-black text-bosque sm:text-3xl">¡Inscripción confirmada!</h2>
        <AvisoDeEmail email={reserva.email} esEnviado={reserva.emailEnviado} />
      </div>

      {/* Ticket / Pase de entrada */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-bosque/10 text-left">
        {/* Cabecera del ticket */}
        <div className="flex items-center justify-between bg-gradient-to-r from-bosque to-hoja px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center">
              <img src={logoParque} alt="Logo" className="size-full object-contain drop-shadow-sm" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-crema/80">
                Pase Oficial · EcoHarmony Park
              </p>
              <p className="text-base font-black leading-tight">{actividad.nombre}</p>
            </div>
          </div>
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold backdrop-blur-xs">
            {reserva.participantes.length}{" "}
            {reserva.participantes.length === 1 ? "lugar" : "lugares"}
          </span>
        </div>

        {/* QR y código */}
        <div className="p-6">
          {reserva.qr && (
            <div className="flex flex-col items-center justify-center border-b border-stone-100 pb-6">
              <div className="rounded-2xl bg-white p-3 shadow-inner ring-1 ring-stone-200">
                <img
                  src={reserva.qr}
                  alt={`Código QR de la reserva ${reserva.codigo}`}
                  className="size-48 [image-rendering:pixelated]"
                />
              </div>
              <p className="mt-3 text-xs font-bold text-stone-400 uppercase tracking-widest">
                Código de reserva
              </p>
              <p className="font-mono text-3xl font-black tracking-widest text-bosque">
                {reserva.codigo}
              </p>

              <a
                href={reserva.qr}
                download={`qr-${reserva.codigo}.png`}
                className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-crema px-4 py-2.5 text-xs font-black text-bosque transition hover:bg-brote/60 active:scale-95"
              >
                <IconoDescargar className="size-4" />
                Descargar pase QR
              </a>
            </div>
          )}

          {/* Datos de la visita */}
          <div className="pt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl bg-crema/40 p-3">
                <span className="flex items-center gap-1 font-bold text-stone-500 uppercase text-[10px]">
                  <IconoCalendario className="size-3 text-hoja" /> Día
                </span>
                <p className="mt-1 font-black text-bosque capitalize">
                  {formatearDia(reserva.horario)}
                </p>
              </div>

              <div className="rounded-2xl bg-crema/40 p-3">
                <span className="flex items-center gap-1 font-bold text-stone-500 uppercase text-[10px]">
                  <IconoReloj className="size-3 text-hoja" /> Horario
                </span>
                <p className="mt-1 font-black text-bosque">
                  {formatearHora(reserva.horario)} hs
                </p>
              </div>
            </div>

            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase">
                <IconoPersonas className="size-3.5 text-hoja" />
                Participantes inscriptos
              </p>
              <ul className="mt-2 divide-y divide-stone-100 rounded-2xl border border-stone-100 bg-stone-50/50">
                {reserva.participantes.map((participante, indice) => (
                  <li
                    key={participante.dni || indice}
                    className="flex items-center justify-between p-3 text-xs"
                  >
                    <span className="font-bold text-stone-800">{participante.nombre}</span>
                    {participante.talle && (
                      <span className="rounded-lg bg-brote/40 px-2 py-0.5 font-bold text-bosque">
                        Talle {participante.talle}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer del ticket */}
        <div className="border-t border-dashed border-stone-200 bg-crema/30 px-5 py-3 text-xs text-stone-600">
          🌱 Presentá este pase al llegar al sendero de inicio. ¡Gracias por cuidar la reserva!
        </div>
      </div>

      <button
        type="button"
        onClick={alTerminar}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 font-bold text-bosque shadow-xs ring-1 ring-bosque/20 transition hover:bg-stone-50 active:scale-95"
      >
        <span>Realizar otra inscripción</span>
      </button>
    </section>
  );
}
