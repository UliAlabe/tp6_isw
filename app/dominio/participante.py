LONGITUDES_DNI_VALIDAS = (7, 8)
EDAD_MAXIMA = 120
TALLES_VALIDOS = ("XS", "S", "M", "L", "XL", "XXL")


def tiene_talle(participante: dict) -> bool:
    return bool(participante.get("talle"))


def tiene_nombre(participante: dict) -> bool:
    return bool(participante.get("nombre", "").strip())


def tiene_dni_valido(participante: dict) -> bool:
    dni = str(participante.get("dni", ""))
    return dni.isdigit() and len(dni) in LONGITUDES_DNI_VALIDAS


def tiene_edad_valida(participante: dict, edad_minima: int) -> bool:
    edad = participante.get("edad")
    return isinstance(edad, int) and edad_minima <= edad <= EDAD_MAXIMA


def tiene_datos_validos(participante: dict, edad_minima: int) -> bool:
    return (
        tiene_nombre(participante)
        and tiene_dni_valido(participante)
        and tiene_edad_valida(participante, edad_minima)
    )

def tiene_talle_valido(participante: dict) -> bool:
    return participante.get("talle") in TALLES_VALIDOS

def tiene_dni_repetido(participantes: list[dict]) -> bool:
    dnis = [p["dni"] for p in participantes]
    return len(dnis) != len(set(dnis))