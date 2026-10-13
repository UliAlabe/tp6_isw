def tiene_talle(participante: dict) -> bool:
    return bool(participante.get("talle"))


def tiene_nombre(participante: dict) -> bool:
    return bool(participante.get("nombre", "").strip())


def tiene_dni_valido(participante: dict) -> bool:
    return str(participante.get("dni", "")).isdigit()


def tiene_datos_validos(participante: dict) -> bool:
    return tiene_nombre(participante) and tiene_dni_valido(participante)