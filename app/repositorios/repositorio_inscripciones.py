from datetime import datetime
from typing import Protocol


class RepositorioInscripciones(Protocol):
    def guardar(self, inscripcion: dict) -> None: ...

    def listar(self) -> list[dict]: ...

    def tiene_inscripcion(self, dni: str, horario: datetime) -> bool: ...
    