from app.dominio.catalogo_actividades import requiere_talle
from app.dominio.errores import (
    DatosInvalidosError,
    HorarioNoDisponibleError,
    SinCupoError,
    TalleRequeridoError,
    TerminosNoAceptadosError,
)
from app.dominio.participante import tiene_datos_validos, tiene_talle
from app.repositorios.repositorio_cupos_en_memoria import RepositorioCuposEnMemoria
from app.repositorios.repositorio_inscripciones_en_memoria import (
    RepositorioInscripcionesEnMemoria,
)


class InscripcionService:
    def __init__(
        self,
        repositorio_cupos: RepositorioCuposEnMemoria,
        repositorio_inscripciones: RepositorioInscripcionesEnMemoria,
    ) -> None:
        self._repositorio_cupos = repositorio_cupos
        self._repositorio_inscripciones = repositorio_inscripciones

    def inscribir(self, datos: dict) -> None:
        actividad_id = datos["actividad_id"]
        horario = datos["horario"]
        participantes = datos["participantes"]

        self._validar_terminos(datos["acepta_terminos"])
        self._validar_horario(actividad_id, horario)
        self._validar_cupo(actividad_id, horario, datos["cantidad_personas"])
        self._validar_talle(actividad_id, participantes)
        self._validar_datos_participantes(participantes)
        self._validar_cantidad_personas(datos["cantidad_personas"], participantes)
        self._repositorio_cupos.descontar_cupo(actividad_id, horario, len(participantes))
        self._repositorio_inscripciones.guardar(datos)

    def _validar_terminos(self, acepta_terminos: bool) -> None:
        if not acepta_terminos:
            raise TerminosNoAceptadosError()

    def _validar_horario(self, actividad_id: str, horario: str) -> None:
        if not self._repositorio_cupos.existe_horario(actividad_id, horario):
            raise HorarioNoDisponibleError()

    def _validar_cupo(self, actividad_id: str, horario: str, cantidad_personas: int) -> None:
        cupo = self._repositorio_cupos.obtener_cupo(actividad_id, horario)
        if cantidad_personas > cupo:
            raise SinCupoError()

    def _validar_talle(self, actividad_id: str, participantes: list[dict]) -> None:
        if requiere_talle(actividad_id) and not all(tiene_talle(p) for p in participantes):
            raise TalleRequeridoError()

    def _validar_datos_participantes(self, participantes: list[dict]) -> None:
        if not all(tiene_datos_validos(p) for p in participantes):
            raise DatosInvalidosError()

    def _validar_cantidad_personas(
        self, cantidad_personas: int, participantes: list[dict]
    ) -> None:
        if cantidad_personas != len(participantes):
            raise DatosInvalidosError(
                "La cantidad de personas no coincide con los participantes ingresados"
            )
