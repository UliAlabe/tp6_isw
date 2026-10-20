import { IconoAlerta } from "./Iconos.jsx";

export default function MensajeError({ mensaje }) {
  if (!mensaje) {
    return null;
  }
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-alerta/30 bg-alerta/10 p-4 text-sm font-bold text-alerta shadow-sm animate-in fade-in duration-200"
    >
      <IconoAlerta className="mt-0.5 size-5 shrink-0 text-alerta" />
      <div className="flex-1 leading-snug">{mensaje}</div>
    </div>
  );
}
