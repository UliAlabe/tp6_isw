class TerminosNoAceptadosError(Exception):
    def __init__(self) -> None:
        super().__init__("Debe aceptar los términos y condiciones de la actividad")


class SinCupoError(Exception):
    def __init__(self) -> None:
        super().__init__("No hay cupo disponible para el horario seleccionado")