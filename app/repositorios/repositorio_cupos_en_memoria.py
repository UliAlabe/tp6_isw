from datetime import datetime


class RepositorioCuposEnMemoria:
    def __init__(self, cupos: dict[tuple[str, datetime], int]) -> None:
        self._cupos = dict(cupos)

    def existe_horario(self, actividad_id: str, horario: datetime) -> bool:
        return (actividad_id, horario) in self._cupos

    def obtener_cupo(self, actividad_id: str, horario: datetime) -> int:
        return self._cupos[(actividad_id, horario)]

    def descontar_cupo(self, actividad_id: str, horario: datetime, cantidad: int) -> None:
        self._cupos[(actividad_id, horario)] -= cantidad
