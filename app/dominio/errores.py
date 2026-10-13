class TerminosNoAceptadosError(Exception):
    def __init__(self) -> None:
        super().__init__("Debe aceptar los términos y condiciones de la actividad")