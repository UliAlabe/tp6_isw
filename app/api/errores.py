from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.dominio.errores import (
    ActividadInexistenteError,
    DatosInvalidosError,
    FueraDeVentanaDeInscripcionError,
    HorarioNoDisponibleError,
    SinCupoError,
    SuperposicionHorariaError,
    TalleRequeridoError,
    TerminosNoAceptadosError,
)

ERRORES_DE_NEGOCIO: dict[type[Exception], tuple[str, int]] = {
    DatosInvalidosError: ("DATOS_INVALIDOS", 400),
    TerminosNoAceptadosError: ("TERMINOS_NO_ACEPTADOS", 400),
    TalleRequeridoError: ("TALLE_REQUERIDO", 400),
    ActividadInexistenteError: ("ACTIVIDAD_NO_ENCONTRADA", 404),
    SinCupoError: ("SIN_CUPO", 409),
    HorarioNoDisponibleError: ("HORARIO_NO_DISPONIBLE", 409),
    FueraDeVentanaDeInscripcionError: ("FUERA_DE_VENTANA", 409),
    SuperposicionHorariaError: ("SUPERPOSICION_HORARIA", 409),
}


def respuesta_de_error(codigo: str, mensaje: str, estado: int) -> JSONResponse:
    return JSONResponse(
        status_code=estado, content={"error": {"codigo": codigo, "mensaje": mensaje}}
    )


def _manejar_error_de_negocio(_: Request, error: Exception) -> JSONResponse:
    codigo, estado = ERRORES_DE_NEGOCIO[type(error)]
    return respuesta_de_error(codigo, str(error), estado)


def _manejar_error_de_formato(_: Request, __: Exception) -> JSONResponse:
    return respuesta_de_error(
        "DATOS_INVALIDOS", "Los datos enviados no tienen el formato esperado", 400
    )


def registrar_manejadores_de_errores(app: FastAPI) -> None:
    for clase_de_error in ERRORES_DE_NEGOCIO:
        app.add_exception_handler(clase_de_error, _manejar_error_de_negocio)
    app.add_exception_handler(RequestValidationError, _manejar_error_de_formato)