import { formatearDia, formatearHora } from "../utilidades/fechas.js";

function AvisoDeEmail({ email, esEnviado }) {
  if (esEnviado) {
    return (
      <p className="mt-1 text-sm">
        Te enviamos el detalle y el código QR a <strong>{email}</strong>.
      </p>
    );
  }
  return (
    <p className="mt-2 rounded-xl bg-alerta/10 px-4 py-3 text-sm font-bold text-alerta">
      Tu lugar está reservado, pero no pudimos enviar el mail a {email}. Guardá este QR para
      presentarlo en el parque.
    </p>
  );
}

export default function ConfirmacionInscripcion({ reserva, actividad, alTerminar }) {
  return (
    <section className="space-y-5 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brote text-3xl text-bosque">
        ✓
      </div>
      <div>
        <h2 className="text-2xl font-black text-bosque">¡Inscripción confirmada!</h2>
        <AvisoDeEmail email={reserva.email} esEnviado={reserva.emailEnviado} />
      </div>

      {reserva.qr && (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-bosque/10">
          <img
            src={reserva.qr}
            alt={`Código QR de la reserva ${reserva.codigo}`}
            className="mx-auto size-56 [image-rendering:pixelated]"
          />
          <a
            href={reserva.qr}
            download={`qr-${reserva.codigo}.png`}
            className="mt-3 inline-flex min-h-12 items-center rounded-xl px-5 font-bold text-bosque ring-1 ring-bosque/30"
          >
            Descargar QR
          </a>
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-bosque/10">
        <p className="text-xs font-bold tracking-wide text-hoja uppercase">Código de reserva</p>
        <p className="font-mono text-3xl font-black tracking-widest text-bosque">{reserva.codigo}</p>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="font-bold">Actividad</dt>
          <dd>{actividad.nombre}</dd>
          <dt className="font-bold">Día</dt>
          <dd className="capitalize">{formatearDia(reserva.horario)}</dd>
          <dt className="font-bold">Hora</dt>
          <dd>{formatearHora(reserva.horario)} hs</dd>
          <dt className="font-bold">Personas</dt>
          <dd>
            <ul>
              {reserva.participantes.map((participante) => (
                <li key={participante.dni}>
                  {participante.nombre}
                  {participante.talle && ` · talle ${participante.talle}`}
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      </div>

      <p className="text-sm">Presentá el QR al llegar a la actividad.</p>
      <button
        type="button"
        onClick={alTerminar}
        className="min-h-12 w-full rounded-2xl font-bold text-bosque ring-1 ring-bosque/30"
      >
        Hacer otra inscripción
      </button>
    </section>
  );
}
