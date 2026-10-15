from types import MappingProxyType

from app.dominio.catalogo_actividades import existe_actividad
from app.dominio.errores import ActividadInexistenteError

_CLAUSULAS_POR_ACTIVIDAD = MappingProxyType(
    {
        "tirolesa": (
            "1. Edad. Pueden participar personas de 8 años o más. La edad que se informa en la inscripción debe ser la real.",
            "2. Equipo. El parque entrega arnés y casco, y el personal los coloca y ajusta antes de cada descenso. El talle informado en la inscripción es el que se prepara.",
            "3. Indicaciones. Hay que seguir en todo momento las instrucciones del guía. No se pueden llevar objetos sueltos, como celulares, llaveros o cámaras sin sujeción.",
            "4. Condiciones personales. No se puede participar bajo los efectos del alcohol u otras sustancias. Cada participante declara no tener una condición médica que le impida realizar la actividad.",
            "5. Clima. El parque puede suspender el turno por viento, lluvia o tormenta y reprogramarlo.",
            "6. Ingreso. Hay que presentar el código QR de la reserva al ingresar. La inscripción se puede hacer hasta 15 minutos antes del inicio del turno.",
            "7. Datos personales. Los datos cargados (nombre, DNI, edad y talle) se usan solo para gestionar la inscripción.",
        ),
        "safari": (
            "1. Edad. Pueden participar personas de cualquier edad. Cada persona, incluidos los bebés, ocupa un lugar del cupo del turno.",
            "2. Dentro del vehículo. Hay que permanecer dentro del vehículo durante todo el recorrido, con las manos y los objetos dentro del mismo.",
            "3. Animales. No se puede tocar, alimentar ni llamar a los animales.",
            "4. Comportamiento. Se pide mantener un tono de voz bajo y no usar flash al sacar fotos.",
            "5. Recorrido. El parque puede modificar o suspender el recorrido por el estado del terreno o el clima, y reprogramar el turno.",
            "6. Ingreso. Hay que presentar el código QR de la reserva al abordar. La inscripción se puede hacer hasta 15 minutos antes del inicio del turno.",
            "7. Datos personales. Los datos cargados (nombre, DNI y edad) se usan solo para gestionar la inscripción.",
        ),
        "palestra": (
            "1. Edad. Pueden participar personas de 12 años o más. La edad que se informa en la inscripción debe ser la real.",
            "2. Equipo. El parque entrega arnés y casco, que el instructor revisa antes de empezar. El talle informado en la inscripción es el que se prepara. Hay que ir con calzado cerrado.",
            "3. Supervisión. Solo se puede escalar con la supervisión del instructor y siguiendo sus indicaciones, sin soltar el seguro en ningún momento.",
            "4. Objetos personales. Antes de empezar hay que retirar anillos, collares y cualquier objeto colgante o suelto.",
            "5. Condiciones personales. No se puede participar bajo los efectos del alcohol u otras sustancias. Cada participante declara estar en condiciones físicas de realizar la actividad y no tener una condición médica que se lo impida.",
            "6. Clima. El parque puede cerrar el muro por lluvia o tormenta y reprogramar el turno.",
            "7. Ingreso. Hay que presentar el código QR de la reserva al ingresar. La inscripción se puede hacer hasta 15 minutos antes del inicio del turno.",
            "8. Datos personales. Los datos cargados (nombre, DNI, edad y talle) se usan solo para gestionar la inscripción.",
        ),
        "jardineria": (
            "1. Edad. Pueden participar personas de cualquier edad. Cada persona, incluidos los bebés, ocupa un lugar del cupo del turno.",
            "2. Herramientas. Se usan los guantes y las herramientas del taller, que hay que devolver al terminar.",
            "3. Plantas. Cada participante puede llevarse la planta que prepare en el taller. El resto del jardín no se toca ni se retira.",
            "4. Salud. Hay que avisar al guía si hay alergia a plantas, polen o picaduras.",
            "5. Higiene. Al finalizar se pide lavarse las manos.",
            "6. Ingreso. Hay que presentar el código QR de la reserva al llegar al taller. La inscripción se puede hacer hasta 15 minutos antes del inicio del turno.",
            "7. Datos personales. Los datos cargados (nombre, DNI y edad) se usan solo para gestionar la inscripción.",
        ),
    }
)


def terminos_y_condiciones(actividad_id: str) -> str:
    if not existe_actividad(actividad_id):
        raise ActividadInexistenteError()
    return "\n".join(_CLAUSULAS_POR_ACTIVIDAD[actividad_id])
