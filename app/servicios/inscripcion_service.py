from app.dominio.catalogo_actividades import (
    edad_minima, 
    requiere_talle,
)
from app.dominio.errores import (
    DatosInvalidosError,
    FueraDeVentanaDeInscripcionError,
    HorarioNoDisponibleError,
    SinCupoError,
    SuperposicionHorariaError,
    TalleRequeridoError,
    TerminosNoAceptadosError,
)
from app.dominio.participante import (
    tiene_datos_validos,
    tiene_dni_repetido,
    tiene_talle,
    tiene_talle_valido,
)
from app.repositorios.repositorio_cupos import RepositorioCupos
from app.repositorios.repositorio_inscripciones import RepositorioInscripciones
from app.servicios.generador_qr import GeneradorQr
from app.servicios.servicio_email import ServicioEmail
from datetime import datetime
from app.servicios.reloj import Reloj
from app.dominio.ventana_inscripcion import esta_dentro_de_la_ventana

class InscripcionService:
    def __init__(
        self,
        repositorio_cupos: RepositorioCupos,
        repositorio_inscripciones: RepositorioInscripciones,
        servicio_email: ServicioEmail,
        generador_qr: GeneradorQr,
        reloj: Reloj,
    ) -> None:
        self._repositorio_cupos = repositorio_cupos
        self._repositorio_inscripciones = repositorio_inscripciones
        self._servicio_email = servicio_email
        self._generador_qr = generador_qr
        self._reloj = reloj

    def inscribir(self, datos: dict) -> None:
        actividad_id = datos["actividad_id"]
        horario = datos["horario"]
        cantidad_personas = datos["cantidad_personas"]
        participantes = datos["participantes"]

        self._validar_terminos(datos["acepta_terminos"])
        self._validar_horario(actividad_id, horario)
        self._validar_ventana(horario)
        self._validar_cupo(actividad_id, horario, cantidad_personas)
        self._validar_cantidad_participantes(cantidad_personas, participantes)
        self._validar_talle(actividad_id, participantes)
        self._validar_datos_participantes(actividad_id, participantes)
        self._validar_dni_unicos(participantes)
        self._validar_superposicion(horario, participantes)
        self._repositorio_cupos.descontar_cupo(actividad_id, horario, cantidad_personas)
        self._repositorio_inscripciones.guardar(datos)
        self._enviar_confirmacion(actividad_id, horario, datos["email"])

    def _enviar_confirmacion(self, actividad_id: str, horario: datetime, email: str) -> None:
        qr = self._generador_qr.generar(f"{actividad_id} {horario} {email}")
        self._servicio_email.enviar_confirmacion(destinatario=email, qr=qr)

    def _validar_terminos(self, acepta_terminos: bool) -> None:
        if not acepta_terminos:
            raise TerminosNoAceptadosError()

    def _validar_horario(self, actividad_id: str, horario: datetime) -> None:
        if not self._repositorio_cupos.existe_horario(actividad_id, horario):
            raise HorarioNoDisponibleError()

    def _validar_cupo(self, actividad_id: str, horario: datetime, cantidad_personas: int) -> None:
        cupo = self._repositorio_cupos.obtener_cupo(actividad_id, horario)
        if cantidad_personas > cupo:
            raise SinCupoError()

    def _validar_talle(self, actividad_id: str, participantes: list[dict]) -> None:
        if not requiere_talle(actividad_id):
            return
        if not all(tiene_talle(p) for p in participantes):
            raise TalleRequeridoError()
        if not all(tiene_talle_valido(p) for p in participantes):
            raise DatosInvalidosError("El talle no pertenece a la escala disponible")

    def _validar_datos_participantes(self, actividad_id: str, participantes: list[dict]) -> None:
        minima = edad_minima(actividad_id)
        if not all(tiene_datos_validos(p, minima) for p in participantes):
            raise DatosInvalidosError()

    def _validar_cantidad_participantes(
        self, cantidad_personas: int, participantes: list[dict]
    ) -> None:
        if cantidad_personas != len(participantes):
            raise DatosInvalidosError(
                "La cantidad de personas no coincide con los participantes cargados"
            )

    def _validar_ventana(self, horario: datetime) -> None:
        anticipacion = horario - self._reloj.ahora()
        if not esta_dentro_de_la_ventana(anticipacion):
            raise FueraDeVentanaDeInscripcionError()

    def _validar_superposicion(self, horario: datetime, participantes: list[dict]) -> None:
        repositorio = self._repositorio_inscripciones
        if any(repositorio.tiene_inscripcion(p["dni"], horario) for p in participantes):
            raise SuperposicionHorariaError()

    def _validar_dni_unicos(self, participantes: list[dict]) -> None:
        if tiene_dni_repetido(participantes):
            raise DatosInvalidosError("Hay participantes con el mismo DNI")