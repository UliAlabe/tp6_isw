import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.errores import registrar_manejadores_de_errores
from app.api.rutas import router
from app.composicion import Servicios, crear_servicios
from app.configuracion import cargar_variables_de_entorno

ORIGENES_PERMITIDOS = ["http://localhost:5173", "http://127.0.0.1:5173"]


def crear_app(servicios: Servicios | None = None) -> FastAPI:
    logging.basicConfig(level=logging.INFO)
    cargar_variables_de_entorno()
    app = FastAPI(title="Inscripción a actividades del parque")
    app.state.servicios = servicios or crear_servicios()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ORIGENES_PERMITIDOS,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    registrar_manejadores_de_errores(app)
    app.include_router(router)
    return app


app = crear_app()
