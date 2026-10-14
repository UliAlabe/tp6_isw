import unittest

from app.dominio.catalogo_actividades import cupo_maximo


class TestCatalogoActividades(unittest.TestCase):
    def test_debe_informar_el_cupo_maximo_de_cada_actividad(self):
        # Arrange: cupos definidos por la cátedra
        cupos_esperados = {
            "safari": 8,
            "palestra": 12,
            "jardineria": 12,
            "tirolesa": 10,
        }

        for actividad_id, cupo in cupos_esperados.items():
            with self.subTest(actividad=actividad_id):
                # Act y Assert
                self.assertEqual(cupo_maximo(actividad_id), cupo)