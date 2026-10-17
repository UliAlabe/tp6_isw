export default function MensajeCampo({ id, mensaje }) {
  if (!mensaje) {
    return null;
  }
  return (
    <p id={id} className="mt-1 text-sm font-bold text-alerta">
      {mensaje}
    </p>
  );
}
