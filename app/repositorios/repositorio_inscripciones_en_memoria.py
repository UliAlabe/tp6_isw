from datetime import datetime


class RepositorioInscripcionesEnMemoria:
    def __init__(self) -> None:
        self._inscripciones: list[dict] = []

    def guardar(self, inscripcion: dict) -> None:
        self._inscripciones.append(inscripcion)

    def listar(self) -> list[dict]:
        return list(self._inscripciones)

    def tiene_inscripcion(self, dni: str, horario: datetime) -> bool:
        return any(
            inscripcion["horario"] == horario
            and any(p["dni"] == dni for p in inscripcion["participantes"])
            for inscripcion in self._inscripciones
        )
