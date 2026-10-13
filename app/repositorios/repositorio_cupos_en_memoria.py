class RepositorioCuposEnMemoria:
    def __init__(self, cupos: dict[tuple[str, str], int]) -> None:
        self._cupos = dict(cupos)

    def existe_horario(self, actividad_id: str, horario: str) -> bool:
        return (actividad_id, horario) in self._cupos

    def obtener_cupo(self, actividad_id: str, horario: str) -> int:
        return self._cupos[(actividad_id, horario)]

    def descontar_cupo(self, actividad_id: str, horario: str, cantidad: int) -> None:
        self._cupos[(actividad_id, horario)] -= cantidad
