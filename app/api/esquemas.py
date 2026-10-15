from datetime import datetime

from pydantic import BaseModel, Field, StrictInt

PATRON_EMAIL = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class ParticipanteEntrada(BaseModel):
    nombre: str
    dni: str
    edad: StrictInt
    talle: str | None = None


class InscripcionEntrada(BaseModel):
    actividad_id: str = Field(alias="actividadId")
    horario: datetime
    email: str = Field(pattern=PATRON_EMAIL)
    acepta_terminos: bool = Field(alias="aceptaTerminos")
    participantes: list[ParticipanteEntrada]
    cantidad_personas: int | None = Field(default=None, alias="cantidadPersonas")
