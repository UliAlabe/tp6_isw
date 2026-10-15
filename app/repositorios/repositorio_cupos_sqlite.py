from datetime import datetime

from app.dominio.errores import SinCupoError
from app.repositorios.base_de_datos import BaseDeDatos


class RepositorioCuposSqlite:
    def __init__(self, base_de_datos: BaseDeDatos) -> None:
        self._base_de_datos = base_de_datos

    def sembrar(self, cupos: dict[tuple[str, datetime], int]) -> None:
        filas = [
            (actividad_id, horario.isoformat(), disponibles)
            for (actividad_id, horario), disponibles in cupos.items()
        ]
        with self._base_de_datos.conexion() as conexion:
            conexion.executemany(
                "INSERT OR IGNORE INTO cupos (actividad_id, horario, disponibles) VALUES (?, ?, ?)",
                filas,
            )

    def existe_horario(self, actividad_id: str, horario: datetime) -> bool:
        with self._base_de_datos.conexion() as conexion:
            fila = conexion.execute(
                "SELECT 1 FROM cupos WHERE actividad_id = ? AND horario = ?",
                (actividad_id, horario.isoformat()),
            ).fetchone()
        return fila is not None

    def obtener_cupo(self, actividad_id: str, horario: datetime) -> int:
        with self._base_de_datos.conexion() as conexion:
            fila = conexion.execute(
                "SELECT disponibles FROM cupos WHERE actividad_id = ? AND horario = ?",
                (actividad_id, horario.isoformat()),
            ).fetchone()
        return fila["disponibles"] if fila else 0

    def descontar_cupo(self, actividad_id: str, horario: datetime, cantidad: int) -> None:
        with self._base_de_datos.conexion() as conexion:
            resultado = conexion.execute(
                "UPDATE cupos SET disponibles = disponibles - ? "
                "WHERE actividad_id = ? AND horario = ? AND disponibles >= ?",
                (cantidad, actividad_id, horario.isoformat(), cantidad),
            )
            if resultado.rowcount == 0:
                raise SinCupoError()
                