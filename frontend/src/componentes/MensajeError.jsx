export default function MensajeError({ mensaje }) {
  if (!mensaje) {
    return null;
  }
  return (
    <p
      role="alert"
      className="rounded-xl border border-alerta/30 bg-alerta/10 px-4 py-3 text-sm font-bold text-alerta"
    >
      {mensaje}
    </p>
  );
}
