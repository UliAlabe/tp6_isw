import logging
import smtplib

from app.infraestructura.comprobantes_de_reserva import Comprobante, ComprobantesDeReserva
from app.servicios.servicio_email import ServicioEmail

logger = logging.getLogger("parque.email")


class ServicioEmailConComprobante:
    def __init__(self, servicio_email: ServicioEmail, comprobantes: ComprobantesDeReserva) -> None:
        self._servicio_email = servicio_email
        self._comprobantes = comprobantes

    def enviar_confirmacion(self, destinatario: str, qr: bytes, reserva: dict) -> None:
        es_enviado = self._intentar_enviar(destinatario, qr, reserva)
        self._comprobantes.guardar(reserva["codigo"], Comprobante(qr, es_enviado))

    def _intentar_enviar(self, destinatario: str, qr: bytes, reserva: dict) -> bool:
        try:
            self._servicio_email.enviar_confirmacion(destinatario, qr, reserva)
        except (smtplib.SMTPException, OSError):
            # Al enviar el mail la reserva ya está guardada: si el correo falla, el visitante
            # igual recibe el QR en pantalla en lugar de un error.
            logger.exception("No se pudo enviar la confirmación de la reserva %s", reserva["codigo"])
            return False
        return True
