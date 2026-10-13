from typing import Protocol


class ServicioEmail(Protocol):
    def enviar_confirmacion(self, destinatario: str) -> None: ...
