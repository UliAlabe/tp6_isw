export default function Cargando({ texto = "Cargando…" }) {
  return (
    <p className="flex items-center justify-center gap-3 py-10 text-hoja" aria-live="polite">
      <span className="size-5 animate-spin rounded-full border-2 border-brote border-t-bosque" />
      {texto}
    </p>
  );
}
