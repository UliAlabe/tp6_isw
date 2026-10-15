import smtplib
from email.message import EmailMessage

from app.infraestructura.cuerpo_email import asunto_confirmacion, texto_confirmacion


class ServicioEmailSmtp:
    def __init__(
        self, host: str, puerto: int, usuario: str, clave: str, remitente: str
    ) -> None:
        self._host = host
        self._puerto = puerto
        self._usuario = usuario
        self._clave = clave
        self._remitente = remitente

    def enviar_confirmacion(self, destinatario: str, qr: bytes, reserva: dict) -> None:
        mensaje = EmailMessage()
        mensaje["Subject"] = asunto_confirmacion(reserva)
        mensaje["From"] = self._remitente
        mensaje["To"] = destinatario
        mensaje.set_content(texto_confirmacion(reserva))
        mensaje.add_attachment(
            qr, maintype="image", subtype="png", filename=f"qr-{reserva['codigo']}.png"
        )
        with smtplib.SMTP(self._host, self._puerto, timeout=15) as servidor:
            if self._usuario:
                servidor.starttls()
                servidor.login(self._usuario, self._clave)
            servidor.send_message(mensaje)
