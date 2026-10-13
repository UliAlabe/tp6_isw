class RepositorioInscripcionesEnMemoria:
    def __init__(self) -> None:
        self._inscripciones: list[dict] = []

    def guardar(self, inscripcion: dict) -> None:
        self._inscripciones.append(inscripcion)

    def listar(self) -> list[dict]:
        return list(self._inscripciones)
