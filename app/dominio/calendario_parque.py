from datetime import date

LUNES = 0
FERIADOS_CERRADOS = frozenset({(12, 25)})  # (mes, día)


def esta_abierto(fecha: date) -> bool:
    return fecha.weekday() != LUNES and (fecha.month, fecha.day) not in FERIADOS_CERRADOS
