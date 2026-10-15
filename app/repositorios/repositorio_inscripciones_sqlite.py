from datetime import datetime

from app.repositorios.base_de_datos import BaseDeDatos


class RepositorioInscripcionesSqlite:
    def __init__(self, base_de_datos: BaseDeDatos) -> None:
        self._base_de_datos = base_de_datos

    def guardar(self, inscripcion: dict) -> None:
        codigo = inscripcion["codigo"]
        participantes = [
            (codigo, p["nombre"], p["dni"], p["edad"], p.get("talle"))
            for p in inscripcion["participantes"]
        ]
        with self._base_de_datos.conexion() as conexion:
            conexion.execute(
                "INSERT INTO inscripciones (codigo, actividad_id, horario, email, cantidad_personas) "
                "VALUES (?, ?, ?, ?, ?)",
                (
                    codigo,
                    inscripcion["actividad_id"],
                    inscripcion["horario"].isoformat(),
                    inscripcion["email"],
                    inscripcion["cantidad_personas"],
                ),
            )
            conexion.executemany(
                "INSERT INTO participantes (codigo, nombre, dni, edad, talle) VALUES (?, ?, ?, ?, ?)",
                participantes,
            )

    def listar(self) -> list[dict]:
        with self._base_de_datos.conexion() as conexion:
            inscripciones = conexion.execute(
                "SELECT codigo, actividad_id, horario, email, cantidad_personas "
                "FROM inscripciones ORDER BY rowid"
            ).fetchall()
            return [
                {
                    "codigo": fila["codigo"],
                    "actividad_id": fila["actividad_id"],
                    "horario": datetime.fromisoformat(fila["horario"]),
                    "email": fila["email"],
                    "cantidad_personas": fila["cantidad_personas"],
                    "participantes": [
                        dict(participante)
                        for participante in conexion.execute(
                            "SELECT nombre, dni, edad, talle FROM participantes "
                            "WHERE codigo = ? ORDER BY id",
                            (fila["codigo"],),
                        ).fetchall()
                    ],
                }
                for fila in inscripciones
            ]

    def tiene_inscripcion(self, dni: str, horario: datetime) -> bool:
        with self._base_de_datos.conexion() as conexion:
            fila = conexion.execute(
                "SELECT 1 FROM participantes p "
                "JOIN inscripciones i ON i.codigo = p.codigo "
                "WHERE p.dni = ? AND i.horario = ? LIMIT 1",
                (dni, horario.isoformat()),
            ).fetchone()
        return fila is not None
