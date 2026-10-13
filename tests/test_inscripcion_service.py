import unittest

from app.dominio.errores import SinCupoError, TerminosNoAceptadosError
from app.repositorios.repositorio_cupos_en_memoria import RepositorioCuposEnMemoria
from app.servicios.inscripcion_service import InscripcionService


class TestInscripcionService(unittest.TestCase):
    def test_debe_rechazar_la_inscripcion_sin_aceptar_terminos(self):
        # Arrange
        servicio = InscripcionService()
        datos = {"acepta_terminos": False}

        # Act y Assert
        with self.assertRaises(TerminosNoAceptadosError):
            servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_no_hay_cupo_para_el_horario(self):
        # Arrange: la tirolesa de las 10:00 tiene 2 lugares y se piden 3
        repositorio = RepositorioCuposEnMemoria({("tirolesa", "10:00"): 2})
        servicio = InscripcionService(repositorio)
        datos = {
            "acepta_terminos": True,
            "actividad_id": "tirolesa",
            "horario": "10:00",
            "cantidad_personas": 3,
        }

        # Act y Assert
        with self.assertRaises(SinCupoError):
            servicio.inscribir(datos)


if __name__ == "__main__":
    unittest.main()