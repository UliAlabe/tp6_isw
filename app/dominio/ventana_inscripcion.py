from datetime import timedelta

ANTICIPACION_MAXIMA = timedelta(hours=24)
ANTICIPACION_MINIMA = timedelta(minutes=15)


def esta_dentro_de_la_ventana(anticipacion: timedelta) -> bool:
    return ANTICIPACION_MINIMA <= anticipacion <= ANTICIPACION_MAXIMA
