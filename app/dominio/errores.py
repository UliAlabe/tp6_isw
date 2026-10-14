class TerminosNoAceptadosError(Exception):
    def __init__(self) -> None:
        super().__init__("Debe aceptar los términos y condiciones de la actividad")


class SinCupoError(Exception):
    def __init__(self) -> None:
        super().__init__("No hay cupo disponible para el horario seleccionado")


class HorarioNoDisponibleError(Exception):
    def __init__(self) -> None:
        super().__init__("El horario seleccionado no está disponible para la actividad")


class TalleRequeridoError(Exception):
    def __init__(self) -> None:
        super().__init__("La actividad requiere informar el talle de cada participante")


class DatosInvalidosError(Exception):
    def __init__(self, motivo: str = "Los datos de los participantes no son válidos") -> None:
        super().__init__(motivo)


class FueraDeVentanaDeInscripcionError(Exception):
    def __init__(self) -> None:
        super().__init__("La inscripción a este turno no está habilitada en este momento")


class SuperposicionHorariaError(Exception):
    def __init__(self) -> None:
        super().__init__("El visitante ya tiene una inscripción en ese horario")