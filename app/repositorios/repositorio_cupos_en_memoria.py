class RepositorioCuposEnMemoria:
    def __init__(self, cupos: dict) -> None:
        self._cupos = cupos

    def obtener_cupo(self, actividad_id: str, horario: str) -> int:
        return self._cupos[(actividad_id, horario)]