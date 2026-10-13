from app.dominio.errores import TerminosNoAceptadosError


class InscripcionService:
    def inscribir(self, datos):
        if not datos["acepta_terminos"]:
            raise TerminosNoAceptadosError()