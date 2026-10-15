from datetime import date

from app.dominio.calendario_parque import turnos_del_dia
from app.dominio.catalogo_actividades import existe_actividad
from app.dominio.errores import ActividadInexistenteError
from app.dominio.ventana_inscripcion import esta_dentro_de_la_ventana
from app.repositorios.repositorio_cupos import RepositorioCupos
from app.servicios.reloj import Reloj


class ConsultaDisponibilidadService:
    def __init__(self, repositorio_cupos: RepositorioCupos, reloj: Reloj) -> None:
        self._repositorio_cupos = repositorio_cupos
        self._reloj = reloj

    def horarios(self, actividad_id: str, fecha: date) -> list[dict]:
        if not existe_actividad(actividad_id):
            raise ActividadInexistenteError()
        ahora = self._reloj.ahora()
        return [
            {
                "horario": turno,
                "cupos_disponibles": self._repositorio_cupos.obtener_cupo(actividad_id, turno),
                "inscripcion_abierta": esta_dentro_de_la_ventana(turno - ahora),
            }
            for turno in turnos_del_dia(fecha)
        ]
