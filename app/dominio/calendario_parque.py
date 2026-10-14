from datetime import date, datetime

LUNES = 0
FERIADOS_CERRADOS = frozenset({(12, 25), (1, 1)})  # (mes, día)
HORA_PRIMER_TURNO = 9
HORA_ULTIMO_TURNO = 17


def esta_abierto(fecha: date) -> bool:
    return fecha.weekday() != LUNES and (fecha.month, fecha.day) not in FERIADOS_CERRADOS


def es_turno_valido(horario: datetime) -> bool:
    return horario.minute == 0 and HORA_PRIMER_TURNO <= horario.hour <= HORA_ULTIMO_TURNO


def turnos_del_dia(fecha: date) -> list[datetime]:
    if not esta_abierto(fecha):
        return []
    return [
        datetime(fecha.year, fecha.month, fecha.day, hora)
        for hora in range(HORA_PRIMER_TURNO, HORA_ULTIMO_TURNO + 1)
    ]
