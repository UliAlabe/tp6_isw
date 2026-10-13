ACTIVIDADES_CON_TALLE = frozenset({"tirolesa", "palestra"})


def requiere_talle(actividad_id: str) -> bool:
    return actividad_id in ACTIVIDADES_CON_TALLE