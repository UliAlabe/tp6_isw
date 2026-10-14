ACTIVIDADES_CON_TALLE = frozenset({"tirolesa", "palestra"})
EDAD_MINIMA_GENERAL = 0
EDAD_MINIMA_POR_ACTIVIDAD = {"palestra": 12, "tirolesa": 8}

def requiere_talle(actividad_id: str) -> bool:
    return actividad_id in ACTIVIDADES_CON_TALLE

def edad_minima(actividad_id: str) -> int:
    return EDAD_MINIMA_POR_ACTIVIDAD.get(actividad_id, EDAD_MINIMA_GENERAL)