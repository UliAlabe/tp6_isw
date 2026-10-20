import { IconoHoja } from "./Iconos.jsx";

export default function Cargando({ texto = "Cargando…" }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
      aria-live="polite"
    >
      <div className="relative flex size-12 items-center justify-center">
        <span className="absolute size-12 animate-spin rounded-full border-3 border-hoja/20 border-t-bosque" />
        <IconoHoja className="size-6 text-hoja animate-pulse" />
      </div>
      <p className="text-sm font-bold text-bosque/80">{texto}</p>
    </div>
  );
}
