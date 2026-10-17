from base64 import b64encode
from datetime import date

from fastapi import APIRouter, Request

from app.api.esquemas import InscripcionEntrada
from app.composicion import Servicios
from app.dominio.catalogo_actividades import listar_actividades
from app.dominio.terminos_y_condiciones import terminos_y_condiciones
from app.infraestructura.reloj_sistema import a_hora_del_parque

router = APIRouter(prefix="/api")


def _servicios(request: Request) -> Servicios:
    return request.app.state.servicios


@router.get("/actividades")
def listar_las_actividades() -> list[dict]:
    return [
        {
            "id": actividad["id"],
            "nombre": actividad["nombre"],
            "requiereTalle": actividad["requiere_talle"],
            "edadMinima": actividad["edad_minima"],
            "cupoMaximo": actividad["cupo_maximo"],
        }
        for actividad in listar_actividades()
    ]


@router.get("/actividades/{actividad_id}/terminos")
def obtener_terminos(actividad_id: str) -> dict:
    return {"actividadId": actividad_id, "texto": terminos_y_condiciones(actividad_id)}


@router.get("/actividades/{actividad_id}/horarios")
def listar_horarios(request: Request, actividad_id: str, fecha: date | None = None) -> list[dict]:
    servicios = _servicios(request)
    dia = fecha or servicios.reloj.ahora().date()
    return [
        {
            "horario": turno["horario"].isoformat(),
            "cuposDisponibles": turno["cupos_disponibles"],
            "inscripcionAbierta": turno["inscripcion_abierta"],
        }
        for turno in servicios.disponibilidad.horarios(actividad_id, dia)
    ]


@router.post("/inscripciones", status_code=201)
def crear_inscripcion(request: Request, entrada: InscripcionEntrada) -> dict:
    participantes = [p.model_dump() for p in entrada.participantes]
    reserva = _servicios(request).inscripcion.inscribir(
        {
            "actividad_id": entrada.actividad_id,
            "horario": a_hora_del_parque(entrada.horario),
            "email": entrada.email,
            "acepta_terminos": entrada.acepta_terminos,
            "cantidad_personas": entrada.cantidad_personas or len(participantes),
            "participantes": participantes,
        }
    )
    comprobante = _servicios(request).comprobantes.retirar(reserva["codigo"])
    return {
        "codigo": reserva["codigo"],
        "actividadId": reserva["actividad_id"],
        "horario": reserva["horario"].isoformat(),
        "email": reserva["email"],
        "participantes": reserva["participantes"],
        "qr": _convertir_a_data_url(comprobante.qr) if comprobante else None,
        "emailEnviado": comprobante.es_enviado_por_email if comprobante else False,
    }


def _convertir_a_data_url(png: bytes) -> str:
    return f"data:image/png;base64,{b64encode(png).decode('ascii')}"
