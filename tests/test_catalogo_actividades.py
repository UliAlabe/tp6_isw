import unittest
from datetime import date, datetime

from app.dominio.catalogo_actividades import cupo_maximo, cupos_iniciales

MIERCOLES = date(2026, 10, 14)


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

    def test_debe_sembrar_todos_los_turnos_de_un_dia_abierto_con_el_cupo_maximo_de_cada_actividad(self):
        # Arrange: 4 actividades x 9 turnos (de 9 a 17), cada uno con el cupo de su actividad
        cupo_por_actividad = {
            "safari": 8,
            "palestra": 12,
            "jardineria": 12,
            "tirolesa": 10,
        }
        esperados = {
            (actividad_id, datetime(2026, 10, 14, hora, 0)): cupo
            for actividad_id, cupo in cupo_por_actividad.items()
            for hora in range(9, 18)
        }

        # Act
        cupos = cupos_iniciales([MIERCOLES])

        # Assert
        self.assertEqual(cupos, esperados)
