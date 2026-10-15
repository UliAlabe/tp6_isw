import sqlite3
from collections.abc import Iterator
from contextlib import contextmanager

ESQUEMA = """
CREATE TABLE IF NOT EXISTS cupos (
    actividad_id TEXT NOT NULL,
    horario TEXT NOT NULL,
    disponibles INTEGER NOT NULL CHECK (disponibles >= 0),
    PRIMARY KEY (actividad_id, horario)
);

CREATE TABLE IF NOT EXISTS inscripciones (
    codigo TEXT PRIMARY KEY,
    actividad_id TEXT NOT NULL,
    horario TEXT NOT NULL,
    email TEXT NOT NULL,
    cantidad_personas INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS participantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL REFERENCES inscripciones (codigo),
    nombre TEXT NOT NULL,
    dni TEXT NOT NULL,
    edad INTEGER NOT NULL,
    talle TEXT
);

CREATE INDEX IF NOT EXISTS idx_participantes_dni ON participantes (dni);
"""


class BaseDeDatos:
    def __init__(self, ruta: str) -> None:
        self._ruta = ruta

    def crear_esquema(self) -> None:
        with self.conexion() as conexion:
            conexion.executescript(ESQUEMA)

    @contextmanager
    def conexion(self) -> Iterator[sqlite3.Connection]:
        conexion = sqlite3.connect(self._ruta)
        conexion.row_factory = sqlite3.Row
        try:
            with conexion:
                yield conexion
        finally:
            conexion.close()
            