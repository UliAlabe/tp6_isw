from datetime import date

from app.dominio.calendario_parque import turnos_del_dia
from app.dominio.catalogo_actividades import existe_actividad
from app.dominio.errores import ActividadInexistenteError
from app.repositorios.repositorio_cupos import RepositorioCupos


class ConsultaDisponibilidadService:
    def __init__(self, repositorio_cupos: RepositorioCupos) -> None:
        self._repositorio_cupos = repositorio_cupos

    def horarios(self, actividad_id: str, fecha: date) -> list[dict]:
        if not existe_actividad(actividad_id):
            raise ActividadInexistenteError()
        return [
            {
                "horario": turno,
                "cupos_disponibles": self._repositorio_cupos.obtener_cupo(actividad_id, turno),
            }
            for turno in turnos_del_dia(fecha)
        ]
