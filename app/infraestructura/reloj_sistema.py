from datetime import datetime, timedelta, timezone

# Argentina no tiene horario de verano, por eso alcanza con un desfase fijo.
ZONA_HORARIA_PARQUE = timezone(timedelta(hours=-3))


def a_hora_del_parque(momento: datetime) -> datetime:
    if momento.tzinfo is None:
        return momento
    return momento.astimezone(ZONA_HORARIA_PARQUE).replace(tzinfo=None)


class RelojSistema:
    def ahora(self) -> datetime:
        return a_hora_del_parque(datetime.now(ZONA_HORARIA_PARQUE))
