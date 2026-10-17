from dataclasses import dataclass
from threading import Lock


@dataclass(frozen=True)
class Comprobante:
    qr: bytes
    es_enviado_por_email: bool


class ComprobantesDeReserva:
    def __init__(self) -> None:
        self._comprobantes: dict[str, Comprobante] = {}
        self._candado = Lock()

    def guardar(self, codigo: str, comprobante: Comprobante) -> None:
        with self._candado:
            self._comprobantes[codigo] = comprobante

    def retirar(self, codigo: str) -> Comprobante | None:
        with self._candado:
            return self._comprobantes.pop(codigo, None)
