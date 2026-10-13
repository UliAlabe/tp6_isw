def tiene_talle(participante: dict) -> bool:
    return bool(participante.get("talle"))


def tiene_nombre(participante: dict) -> bool:
    return bool(participante.get("nombre", "").strip())