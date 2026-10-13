from typing import Protocol


class GeneradorQr(Protocol):
    def generar(self, contenido: str) -> bytes: ...
