from datetime import date, datetime

LUNES = 0
FERIADOS_CERRADOS = frozenset({(12, 25), (1, 1)})  # (mes, día)
HORA_ULTIMO_TURNO = 17


def esta_abierto(fecha: date) -> bool:
    return fecha.weekday() != LUNES and (fecha.month, fecha.day) not in FERIADOS_CERRADOS


def es_turno_valido(horario: datetime) -> bool:
    return horario.hour <= HORA_ULTIMO_TURNO
