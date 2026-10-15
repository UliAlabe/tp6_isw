from io import BytesIO

import qrcode


class GeneradorQrPng:
    def generar(self, contenido: str) -> bytes:
        imagen = qrcode.make(contenido)
        buffer = BytesIO()
        imagen.save(buffer, format="PNG")
        return buffer.getvalue()
