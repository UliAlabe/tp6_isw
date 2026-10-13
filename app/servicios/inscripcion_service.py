from app.dominio.errores import SinCupoError, TerminosNoAceptadosError
from app.repositorios.repositorio_cupos_en_memoria import RepositorioCuposEnMemoria


class InscripcionService:
    def __init__(self, repositorio_cupos: RepositorioCuposEnMemoria) -> None:
        self._repositorio_cupos = repositorio_cupos

    def inscribir(self, datos: dict) -> None:
        self._validar_terminos(datos)
        self._validar_cupo(datos)

    def _validar_terminos(self, datos: dict) -> None:
        if not datos["acepta_terminos"]:
            raise TerminosNoAceptadosError()

    def _validar_cupo(self, datos: dict) -> None:
        cupo = self._repositorio_cupos.obtener_cupo(datos["actividad_id"], datos["horario"])
        if datos["cantidad_personas"] > cupo:
            raise SinCupoError()