import unittest
from datetime import date, datetime

from app.dominio.catalogo_actividades import (
    cupo_maximo,
    cupos_iniciales,
    existe_actividad,
    listar_actividades,
)

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

    def test_debe_omitir_los_dias_cerrados_al_sembrar_varios_dias(self):
        # Arrange: el miércoles abre y el lunes siguiente cierra
        lunes = date(2026, 10, 19)

        # Act
        cupos = cupos_iniciales([MIERCOLES, lunes])

        # Assert: 4 actividades x 9 turnos, todos del miércoles
        self.assertEqual(len(cupos), 36)
        self.assertTrue(all(turno.date() == MIERCOLES for _, turno in cupos))

    def test_debe_reconocer_las_actividades_del_parque(self):
        for actividad_id in ["safari", "palestra", "jardineria", "tirolesa"]:
            with self.subTest(actividad=actividad_id):
                self.assertTrue(existe_actividad(actividad_id))

    def test_debe_rechazar_una_actividad_que_no_existe(self):
        self.assertFalse(existe_actividad("bungee"))

    def test_debe_listar_las_actividades_con_sus_reglas(self):
        # Arrange: el orden es el que muestra el front
        esperadas = [
            {
                "id": "tirolesa",
                "nombre": "Tirolesa",
                "requiere_talle": True,
                "edad_minima": 8,
                "cupo_maximo": 10,
            },
            {
                "id": "safari",
                "nombre": "Safari",
                "requiere_talle": False,
                "edad_minima": 0,
                "cupo_maximo": 8,
            },
            {
                "id": "palestra",
                "nombre": "Palestra",
                "requiere_talle": True,
                "edad_minima": 12,
                "cupo_maximo": 12,
            },
            {
                "id": "jardineria",
                "nombre": "Jardinería",
                "requiere_talle": False,
                "edad_minima": 0,
                "cupo_maximo": 12,
            },
        ]

        # Act
        actividades = listar_actividades()

        # Assert
        self.assertEqual(actividades, esperadas)
