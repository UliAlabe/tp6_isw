from app.dominio.errores import TerminosNoAceptadosError


class InscripcionService:
    def inscribir(self, datos: dict) -> None:
        self._validar_terminos(datos)

    def _validar_terminos(self, datos: dict) -> None:
        if not datos["acepta_terminos"]:
            raise TerminosNoAceptadosError()