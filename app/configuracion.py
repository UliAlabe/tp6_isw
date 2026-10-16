import os
from pathlib import Path

ARCHIVO_DE_ENTORNO = ".env"


# Lector mínimo de .env para no sumar python-dotenv a las dependencias del proyecto.
def cargar_variables_de_entorno(ruta: str = ARCHIVO_DE_ENTORNO) -> None:
    archivo = Path(ruta)
    if not archivo.is_file():
        return
    for linea in archivo.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, valor = linea.split("=", 1)
        os.environ.setdefault(clave.strip(), valor.strip().strip('"'))
