import unittest

from app.dominio.errores import TerminosNoAceptadosError
from app.servicios.inscripcion_service import InscripcionService


class TestInscripcionService(unittest.TestCase):
    def test_debe_rechazar_la_inscripcion_sin_aceptar_terminos(self):
        # Arrange
        servicio = InscripcionService()
        datos = {"acepta_terminos": False}

        # Act y Assert
        with self.assertRaises(TerminosNoAceptadosError):
            servicio.inscribir(datos)


if __name__ == "__main__":
    unittest.main()