import os
from dataclasses import dataclass
from datetime import timedelta

from app.dominio.catalogo_actividades import cupos_iniciales
from app.infraestructura.comprobantes_de_reserva import ComprobantesDeReserva
from app.infraestructura.generador_qr_png import GeneradorQrPng
from app.infraestructura.reloj_sistema import RelojSistema
from app.infraestructura.servicio_email_con_comprobante import ServicioEmailConComprobante
from app.infraestructura.servicio_email_consola import ServicioEmailConsola
from app.infraestructura.servicio_email_smtp import ServicioEmailSmtp
from app.repositorios.base_de_datos import BaseDeDatos
from app.repositorios.repositorio_cupos_sqlite import RepositorioCuposSqlite
from app.repositorios.repositorio_inscripciones_sqlite import RepositorioInscripcionesSqlite
from app.servicios.consulta_disponibilidad_service import ConsultaDisponibilidadService
from app.servicios.inscripcion_service import InscripcionService
from app.servicios.reloj import Reloj
from app.servicios.servicio_email import ServicioEmail

DIAS_DE_CUPOS_INICIALES = 7
RUTA_BASE_DE_DATOS_POR_DEFECTO = "parque.db"


@dataclass(frozen=True)
class Servicios:
    inscripcion: InscripcionService
    disponibilidad: ConsultaDisponibilidadService
    reloj: Reloj
    comprobantes: ComprobantesDeReserva


def crear_servicio_email() -> ServicioEmail:
    host = os.environ.get("SMTP_HOST")
    if not host:
        return ServicioEmailConsola()
    return ServicioEmailSmtp(
        host=host,
        puerto=int(os.environ.get("SMTP_PUERTO", "587")),
        usuario=os.environ.get("SMTP_USUARIO", ""),
        clave=os.environ.get("SMTP_CLAVE", ""),
        remitente=os.environ.get("SMTP_REMITENTE", "inscripciones@parque.local"),
    )


def crear_servicios(
    ruta_base_de_datos: str | None = None,
    servicio_email: ServicioEmail | None = None,
    reloj: Reloj | None = None,
) -> Servicios:
    ruta = ruta_base_de_datos or os.environ.get(
        "RUTA_BASE_DE_DATOS", RUTA_BASE_DE_DATOS_POR_DEFECTO
    )
    reloj = reloj or RelojSistema()
    base_de_datos = BaseDeDatos(ruta)
    base_de_datos.crear_esquema()
    repositorio_cupos = RepositorioCuposSqlite(base_de_datos)
    hoy = reloj.ahora().date()
    fechas = [hoy + timedelta(days=dia) for dia in range(DIAS_DE_CUPOS_INICIALES)]
    repositorio_cupos.sembrar(cupos_iniciales(fechas))
    comprobantes = ComprobantesDeReserva()
    return Servicios(
        inscripcion=InscripcionService(
            repositorio_cupos,
            RepositorioInscripcionesSqlite(base_de_datos),
            ServicioEmailConComprobante(servicio_email or crear_servicio_email(), comprobantes),
            GeneradorQrPng(),
            reloj,
        ),
        disponibilidad=ConsultaDisponibilidadService(repositorio_cupos, reloj),
        reloj=reloj,
        comprobantes=comprobantes,
    )
