from datetime import datetime
from typing import Protocol


class RepositorioCupos(Protocol):
    def existe_horario(self, actividad_id: str, horario: datetime) -> bool: ...

    def obtener_cupo(self, actividad_id: str, horario: datetime) -> int: ...

    def descontar_cupo(self, actividad_id: str, horario: datetime, cantidad: int) -> None: ...
    