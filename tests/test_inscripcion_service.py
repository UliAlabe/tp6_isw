import unittest

from app.dominio.errores import (
    DatosInvalidosError,
    HorarioNoDisponibleError,
    SinCupoError,
    TalleRequeridoError,
    TerminosNoAceptadosError,
)
from app.repositorios.repositorio_cupos_en_memoria import RepositorioCuposEnMemoria
from app.servicios.inscripcion_service import InscripcionService


class TestInscripcionService(unittest.TestCase):
    def setUp(self):
        self.repositorio = RepositorioCuposEnMemoria(
            {
                ("tirolesa", "10:00"): 2,
                ("safari", "11:00"): 5,
            }
        )
        self.servicio = InscripcionService(self.repositorio)

    def _datos_validos(self, **cambios):
        datos = {
            "acepta_terminos": True,
            "actividad_id": "tirolesa",
            "horario": "10:00",
            "cantidad_personas": 2,
            "participantes": [
                {"nombre": "Ana Pérez", "dni": "30111222", "edad": 28, "talle": "M"},
                {"nombre": "Luis Gómez", "dni": "28555666", "edad": 31, "talle": "L"},
            ],
        }
        datos.update(cambios)
        return datos

    def test_debe_rechazar_la_inscripcion_sin_aceptar_terminos(self):
        # Arrange
        datos = self._datos_validos(acepta_terminos=False)

        # Act y Assert
        with self.assertRaises(TerminosNoAceptadosError):
            self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_no_hay_cupo_para_el_horario(self):
        # Arrange: hay 2 lugares y se piden 3
        datos = self._datos_validos(cantidad_personas=3)

        # Act y Assert
        with self.assertRaises(SinCupoError):
            self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_el_horario_no_esta_disponible(self):
        # Arrange: a las 22:00 el parque está cerrado
        datos = self._datos_validos(horario="22:00")

        # Act y Assert
        with self.assertRaises(HorarioNoDisponibleError):
            self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_sin_talle_cuando_la_actividad_lo_requiere(self):
        # Arrange: la tirolesa exige talle y la participante no lo informa
        participante_sin_talle = {"nombre": "Ana Pérez", "dni": "30111222", "edad": 28}
        datos = self._datos_validos(
            cantidad_personas=1,
            participantes=[participante_sin_talle],
        )

        # Act y Assert
        with self.assertRaises(TalleRequeridoError):
            self.servicio.inscribir(datos)
    
    def test_debe_aceptar_la_inscripcion_sin_talle_cuando_la_actividad_no_lo_requiere(self):
        # Arrange: el safari no exige talle y la participante no lo informa
        participante_sin_talle = {"nombre": "Ana Pérez", "dni": "30111222", "edad": 28}
        datos = self._datos_validos(
            actividad_id="safari",
            horario="11:00",
            cantidad_personas=1,
            participantes=[participante_sin_talle],
        )

        # Act: no debe levantar ningún error
        self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_el_nombre_del_participante_esta_vacio(self):
        # Arrange: todos los datos son válidos salvo el nombre
        participante_sin_nombre = {"nombre": "", "dni": "30111222", "edad": 28, "talle": "M"}
        datos = self._datos_validos(
            cantidad_personas=1,
            participantes=[participante_sin_nombre],
        )

        # Act y Assert
        with self.assertRaises(DatosInvalidosError):
            self.servicio.inscribir(datos)

if __name__ == "__main__":
    unittest.main()