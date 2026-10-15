from datetime import date, datetime
from types import MappingProxyType

from app.dominio.calendario_parque import turnos_del_dia

ACTIVIDADES_CON_TALLE = frozenset({"tirolesa", "palestra"})
EDAD_MINIMA_GENERAL = 0
EDAD_MINIMA_POR_ACTIVIDAD = MappingProxyType({"palestra": 12, "tirolesa": 8})
CUPO_MAXIMO_POR_ACTIVIDAD = MappingProxyType(
    {"safari": 8, "palestra": 12, "jardineria": 12, "tirolesa": 10}
)


def requiere_talle(actividad_id: str) -> bool:
    return actividad_id in ACTIVIDADES_CON_TALLE


def edad_minima(actividad_id: str) -> int:
    return EDAD_MINIMA_POR_ACTIVIDAD.get(actividad_id, EDAD_MINIMA_GENERAL)


def cupo_maximo(actividad_id: str) -> int:
    return CUPO_MAXIMO_POR_ACTIVIDAD[actividad_id]


def cupos_iniciales(fechas: list[date]) -> dict[tuple[str, datetime], int]:
    return {
        (actividad_id, turno): cupo
        for fecha in fechas
        for turno in turnos_del_dia(fecha)
        for actividad_id, cupo in CUPO_MAXIMO_POR_ACTIVIDAD.items()
    }


def existe_actividad(actividad_id: str) -> bool:
    return actividad_id in CUPO_MAXIMO_POR_ACTIVIDAD
