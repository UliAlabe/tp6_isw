import unittest

from app.dominio.terminos_y_condiciones import terminos_y_condiciones

ACTIVIDADES = ["safari", "palestra", "jardineria", "tirolesa"]


class TestTerminosYCondiciones(unittest.TestCase):
    def test_debe_tener_terminos_propios_para_cada_actividad(self):
        # Arrange y Act
        terminos = [terminos_y_condiciones(actividad_id) for actividad_id in ACTIVIDADES]

        # Assert: todas tienen texto y ninguna comparte los términos de otra
        self.assertTrue(all(terminos))
        self.assertEqual(len(set(terminos)), len(ACTIVIDADES))
