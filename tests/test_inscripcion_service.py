import unittest
from unittest.mock import MagicMock

from app.dominio.errores import (
    DatosInvalidosError,
    HorarioNoDisponibleError,
    SinCupoError,
    TalleRequeridoError,
    TerminosNoAceptadosError,
)
from app.repositorios.repositorio_cupos_en_memoria import RepositorioCuposEnMemoria
from app.repositorios.repositorio_inscripciones_en_memoria import (
    RepositorioInscripcionesEnMemoria,
)
from app.servicios.inscripcion_service import InscripcionService


class TestInscripcionService(unittest.TestCase):
    def setUp(self):
        self.repositorio = RepositorioCuposEnMemoria(
            {
                ("tirolesa", "10:00"): 2,
                ("safari", "11:00"): 5,
            }
        )
        self.repositorio_inscripciones = RepositorioInscripcionesEnMemoria()
        self.servicio_email = MagicMock()
        self.generador_qr = MagicMock()
        self.servicio = InscripcionService(
            self.repositorio,
            self.repositorio_inscripciones,
            self.servicio_email,
            self.generador_qr,
        )

    def _participante_valido(self, **cambios):
        participante = {"nombre": "Ana Pérez", "dni": "30111222", "edad": 28, "talle": "M"}
        participante.update(cambios)
        return participante

    def _datos_validos(self, **cambios):
        datos = {
            "acepta_terminos": True,
            "actividad_id": "tirolesa",
            "horario": "10:00",
            "email": "visitante@correo.com",
            "cantidad_personas": 2,
            "participantes": [
                self._participante_valido(),
                self._participante_valido(nombre="Luis Gómez", dni="28555666", edad=31, talle="L"),
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
        datos = self._datos_validos(
            cantidad_personas=1,
            participantes=[self._participante_valido(talle=None)],
        )

        # Act y Assert
        with self.assertRaises(TalleRequeridoError):
            self.servicio.inscribir(datos)

    def test_debe_aceptar_la_inscripcion_sin_talle_cuando_la_actividad_no_lo_requiere(self):
        # Arrange: el safari no exige talle y la participante no lo informa
        datos = self._datos_validos(
            actividad_id="safari",
            horario="11:00",
            cantidad_personas=1,
            participantes=[self._participante_valido(talle=None)],
        )

        # Act: no debe levantar ningún error
        self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_el_nombre_del_participante_esta_vacio(self):
        # Arrange: todos los datos son válidos salvo el nombre
        datos = self._datos_validos(
            cantidad_personas=1,
            participantes=[self._participante_valido(nombre="")],
        )

        # Act y Assert
        with self.assertRaises(DatosInvalidosError):
            self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_el_dni_del_participante_no_es_valido(self):
        # Arrange: el DNI tiene la longitud correcta pero incluye una letra
        datos = self._datos_validos(
            cantidad_personas=1,
            participantes=[self._participante_valido(dni="3011122A")],
        )

        # Act y Assert
        with self.assertRaises(DatosInvalidosError):
            self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_el_dni_tiene_longitud_invalida(self):
        # Arrange: el DNI tiene solo dígitos pero es demasiado corto
        datos = self._datos_validos(
            cantidad_personas=1,
            participantes=[self._participante_valido(dni="123")],
        )

        # Act y Assert
        with self.assertRaises(DatosInvalidosError):
            self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_la_edad_del_participante_no_es_valida(self):
        # Arrange: todos los datos son válidos salvo la edad
        datos = self._datos_validos(
            cantidad_personas=1,
            participantes=[self._participante_valido(edad=0)],
        )

        # Act y Assert
        with self.assertRaises(DatosInvalidosError):
            self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_la_edad_supera_el_maximo(self):
        # Arrange: la edad es positiva pero supera el máximo permitido
        datos = self._datos_validos(
            cantidad_personas=1,
            participantes=[self._participante_valido(edad=150)],
        )

        # Act y Assert
        with self.assertRaises(DatosInvalidosError):
            self.servicio.inscribir(datos)

    def test_debe_rechazar_la_inscripcion_cuando_la_cantidad_no_coincide_con_los_participantes(self):
        # Arrange: se declaran 2 personas pero se carga solo 1 participante
        datos = self._datos_validos(
            cantidad_personas=2,
            participantes=[self._participante_valido()],
        )

        # Act y Assert
        with self.assertRaises(DatosInvalidosError):
            self.servicio.inscribir(datos)

    def test_debe_registrar_la_inscripcion_cuando_los_datos_son_validos(self):
        # Arrange
        datos = self._datos_validos()

        # Act
        self.servicio.inscribir(datos)

        # Assert
        self.assertEqual(len(self.repositorio_inscripciones.listar()), 1)

    def test_debe_descontar_el_cupo_del_horario_al_inscribirse(self):
        # Arrange: la tirolesa de las 10:00 tiene 2 lugares y se inscriben 2 personas
        datos = self._datos_validos()

        # Act
        self.servicio.inscribir(datos)

        # Assert
        self.assertEqual(self.repositorio.obtener_cupo("tirolesa", "10:00"), 0)


    def test_debe_enviar_el_email_de_confirmacion_al_visitante_al_inscribirse(self):
        # Arrange
        datos = self._datos_validos()

        # Act
        self.servicio.inscribir(datos)

        # Assert
        destinatario = self.servicio_email.enviar_confirmacion.call_args.kwargs["destinatario"]
        self.assertEqual(destinatario, "visitante@correo.com")


    def test_debe_incluir_el_codigo_qr_en_el_email_de_confirmacion(self):
        # Arrange
        datos = self._datos_validos()
        self.generador_qr.generar.return_value = b"imagen-qr"

        # Act
        self.servicio.inscribir(datos)

        # Assert
        qr_enviado = self.servicio_email.enviar_confirmacion.call_args.kwargs["qr"]
        self.assertEqual(qr_enviado, b"imagen-qr")


if __name__ == "__main__":
    unittest.main()