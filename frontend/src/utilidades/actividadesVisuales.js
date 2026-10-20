import imgJardineria from "../imagenes/jardineria.jpg";
import imgPalestra from "../imagenes/palestra.jpg";
import imgSafari from "../imagenes/safari.jpg";
import imgTirolesa from "../imagenes/tirolesa.jpg";

export const IMAGENES_POR_ACTIVIDAD = {
  jardineria: imgJardineria,
  palestra: imgPalestra,
  safari: imgSafari,
  tirolesa: imgTirolesa,
};

export const METADATOS_ECOPARK = {
  tirolesa: {
    imagen: imgTirolesa,
    categoria: "Aventura en Altura",
    lema: "Sobrevolá las copas de los árboles autóctonos",
    destacado: "Vista panorámica",
    recomendacion: "Traer ropa cómoda y calzado deportivo cerrado.",
  },
  safari: {
    imagen: imgSafari,
    categoria: "Fauna Silvestre",
    lema: "Conectá con las especies autóctonas en su hábitat natural",
    destacado: "Recorrido guiado",
    recomendacion: "Actividad ideal para toda la familia. Traé tu cámara.",
  },
  palestra: {
    imagen: imgPalestra,
    categoria: "Escalada & Destreza",
    lema: "Desafiá tus límites en roca natural al aire libre",
    destacado: "Instructores certificados",
    recomendacion: "Se provee arnés de seguridad homologado según tu talle.",
  },
  jardineria: {
    imagen: imgJardineria,
    categoria: "Botánica & Huerta",
    lema: "Aprendé cultivo orgánico y cuidado de flora nativa",
    destacado: "Taller vivencial",
    recomendacion: "Incluye plantín de especie nativa para llevar a casa.",
  },
};

export function obtenerDetallesVisuales(actividadId) {
  return (
    METADATOS_ECOPARK[actividadId] ?? {
      imagen: IMAGENES_POR_ACTIVIDAD[actividadId] ?? imgSafari,
      categoria: "Naturaleza",
      lema: "Experiencia en el parque",
      destacado: "Sustentable",
      recomendacion: "Cuidá el entorno natural durante la visita.",
    }
  );
}

