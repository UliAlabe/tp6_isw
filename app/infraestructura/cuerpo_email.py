from app.dominio.catalogo_actividades import listar_actividades


def asunto_confirmacion(reserva: dict) -> str:
    return f"Confirmación de inscripción {reserva['codigo']}"


def texto_confirmacion(reserva: dict) -> str:
    nombres = {actividad["id"]: actividad["nombre"] for actividad in listar_actividades()}
    actividad = nombres.get(reserva["actividad_id"], reserva["actividad_id"])
    horario = reserva["horario"].strftime("%d/%m/%Y %H:%M")
    participantes = "\n".join(
        f"- {p['nombre']} (DNI {p['dni']})" for p in reserva["participantes"]
    )
    return (
        f"¡Tu inscripción quedó confirmada!\n\n"
        f"Código de reserva: {reserva['codigo']}\n"
        f"Actividad: {actividad}\n"
        f"Horario: {horario} hs\n\n"
        f"Participantes:\n{participantes}\n\n"
        f"Presentá el QR adjunto al llegar al parque."
    )
