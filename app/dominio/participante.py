LONGITUDES_DNI_VALIDAS = (7, 8)
EDAD_MINIMA = 1
EDAD_MAXIMA = 120


def tiene_talle(participante: dict) -> bool:
    return bool(participante.get("talle"))


def tiene_nombre(participante: dict) -> bool:
    return bool(participante.get("nombre", "").strip())


def tiene_dni_valido(participante: dict) -> bool:
    dni = str(participante.get("dni", ""))
    return dni.isdigit() and len(dni) in LONGITUDES_DNI_VALIDAS


def tiene_edad_valida(participante: dict) -> bool:
    return EDAD_MINIMA <= participante.get("edad", 0) <= EDAD_MAXIMA


def tiene_datos_validos(participante: dict) -> bool:
    return (
        tiene_nombre(participante)
        and tiene_dni_valido(participante)
        and tiene_edad_valida(participante)
    )


