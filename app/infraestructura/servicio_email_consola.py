import logging
from pathlib import Path

from app.infraestructura.cuerpo_email import asunto_confirmacion, texto_confirmacion

logger = logging.getLogger("parque.email")


class ServicioEmailConsola:
    def __init__(self, carpeta_salida: str = "emails_enviados") -> None:
        self._carpeta_salida = Path(carpeta_salida)

    def enviar_confirmacion(self, destinatario: str, qr: bytes, reserva: dict) -> None:
        self._carpeta_salida.mkdir(parents=True, exist_ok=True)
        ruta_qr = self._carpeta_salida / f"{reserva['codigo']}.png"
        ruta_qr.write_bytes(qr)
        logger.info(
            "Email simulado a %s\nAsunto: %s\n%s\nQR guardado en %s",
            destinatario,
            asunto_confirmacion(reserva),
            texto_confirmacion(reserva),
            ruta_qr,
        )
