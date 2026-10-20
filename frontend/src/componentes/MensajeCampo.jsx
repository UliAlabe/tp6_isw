import { IconoAlerta } from "./Iconos.jsx";

export default function MensajeCampo({ id, mensaje }) {
  if (!mensaje) {
    return null;
  }
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-alerta">
      <IconoAlerta className="size-3.5 shrink-0" />
      <span>{mensaje}</span>
    </p>
  );
}
