import unittest
from unittest.mock import MagicMock
from datetime import date, datetime

from app.dominio.catalogo_actividades import cupos_iniciales
from app.dominio.errores import ActividadInexistenteError
from app.repositorios.repositorio_cupos_en_memoria import RepositorioCuposEnMemoria
from app.servicios.consulta_disponibilidad_service import ConsultaDisponibilidadService

MIERCOLES = date(2026, 10, 14)


class TestConsultaDisponibilidadService(unittest.TestCase):
    def setUp(self):
        self.repositorio = RepositorioCuposEnMemoria(cupos_iniciales([MIERCOLES]))
        self.reloj = MagicMock()
        self.reloj.ahora.return_value = datetime(2026, 10, 14, 8, 0)
        self.servicio = ConsultaDisponibilidadService(self.repositorio, self.reloj)

    def test_debe_listar_un_turno_por_hora_con_el_cupo_de_la_actividad(self):
        # Arrange: el safari tiene 8 lugares y hay turnos de 9 a 17
        esperados = [
            {"horario": datetime(2026, 10, 14, hora, 0), "cupos_disponibles": 8}
            for hora in range(9, 18)
        ]

        # Act
        horarios = self.servicio.horarios("safari", MIERCOLES)

        # Assert
        self.assertEqual(horarios, esperados)

    def test_debe_devolver_una_lista_vacia_cuando_el_parque_esta_cerrado(self):
        # Arrange: los lunes el parque cierra
        lunes = date(2026, 10, 19)

        # Act
        horarios = self.servicio.horarios("safari", lunes)

        # Assert
        self.assertEqual(horarios, [])    

    def test_debe_rechazar_la_consulta_de_una_actividad_que_no_existe(self):
        # Act y Assert: "bungee" no es una actividad del parque
        with self.assertRaises(ActividadInexistenteError):
            self.servicio.horarios("bungee", MIERCOLES)

    def test_debe_reflejar_los_lugares_ocupados_por_una_inscripcion(self):
        # Arrange: se ocupan 3 de los 8 lugares del safari de las 10:00
        self.repositorio.descontar_cupo("safari", datetime(2026, 10, 14, 10, 0), 3)

        # Act
        horarios = self.servicio.horarios("safari", MIERCOLES)

        # Assert: el turno de las 10:00 queda con 5 y el de las 11:00 sigue con 8
        cupos = {h["horario"].hour: h["cupos_disponibles"] for h in horarios}
        self.assertEqual(cupos[10], 5)
        self.assertEqual(cupos[11], 8)
