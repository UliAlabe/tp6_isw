from datetime import date

LUNES = 0


def esta_abierto(fecha: date) -> bool:
    return fecha.weekday() != LUNES
