import unittest
from datetime import date, datetime

from app.dominio.calendario_parque import turnos_del_dia

MIERCOLES = date(2026, 10, 14)


class TestCalendarioParque(unittest.TestCase):
    def test_debe_generar_un_turno_por_hora_de_9_a_17_cuando_el_parque_esta_abierto(self):
        # Arrange: son 9 turnos, uno por hora, y el de las 18 no existe
        esperados = [datetime(2026, 10, 14, hora, 0) for hora in range(9, 18)]

        # Act
        turnos = turnos_del_dia(MIERCOLES)

        # Assert
        self.assertEqual(turnos, esperados)
