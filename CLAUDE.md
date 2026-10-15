# CLAUDE.md — Hoja de estilos del proyecto

> Documento que define **cómo vamos a escribir y entregar el código**. Claude debe leerlo antes de escribir cualquier línea y respetarlo siempre.

## 1. El proyecto en 3 líneas

- **App:** inscripción de visitantes a actividades del parque (Tirolesa, Safari, Palestra, Jardinería).
- **Web responsive, mobile-first** (se usa desde el celular).
- **TDD solo en el backend.** El frontend se prueba a mano.

## 2. Stack

| Parte | Tecnología |
|-------|-----------|
| Lenguaje del backend | Python 3.14 (con type hints) |
| Backend | FastAPI + Uvicorn |
| Tests unitarios | unittest |
| Tests de endpoints | `TestClient` de FastAPI (requiere `httpx`) |
| Mocks | `unittest.mock` (viene con Python) |
| Email | `smtplib` (Mailtrap en desarrollo) |
| Código QR | `qrcode` |
| Persistencia | SQLite (`sqlite3`, viene con Python); en los tests, repositorios en memoria |
| Frontend | React |
| Estilos | Tailwind CSS |

No agregar librerías fuera de esta lista sin consultar. Las dependencias del backend van en `requirements.txt` y se instalan dentro de un entorno virtual (`venv`).

## 3. Nombrado (PEP 8)

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos y módulos | `snake_case` | `inscripcion_service.py` |
| Tests | `test_nombre.py` | `test_inscripcion_service.py` |
| Componentes React | `PascalCase` (archivo y componente) | `FormularioInscripcion.jsx` |
| Clases | `PascalCase` | `InscripcionService` |
| Interfaces (clases abstractas o `Protocol`) | `PascalCase`, sin prefijo `I` | `ServicioEmail` |
| Funciones y variables | `snake_case` | `validar_cupo` |
| Constantes | `MAYUSCULAS_CON_GUION_BAJO` | `MAX_PERSONAS` |
| Booleanos | prefijo `es_`, `tiene_`, `hay_` | `hay_cupo`, `requiere_talle` |
| Funciones | empiezan con verbo | `enviar_email` |
| Atributos o métodos internos | prefijo `_` | `_calcular_cupo` |

- El **dominio va en español** (`Inscripcion`, `Visitante`). Los términos técnicos quedan en inglés (`handler`, `middleware`).
- Sin tildes ni ñ en nombres de archivos, variables o funciones.
- Sin abreviaturas raras: `cantidad_personas`, no `cant_pers`.

## 4. Estilo del código

- **4 espacios** de indentación, comillas dobles, máximo 100 caracteres por línea.
- Type hints en todas las funciones (parámetros y retorno).
- Imports ordenados: librería estándar, librerías externas, código propio.
- Usar f-strings para armar textos.
- Prohibido `from modulo import *`.
- Funciones cortas que hacen una sola cosa.
- Errores de negocio como clases propias que heredan de `Exception` (`SinCupoError`, `TalleRequeridoError`), no strings ni `ValueError` genéricos.
- Comentarios solo para explicar el porqué, nunca el qué.
- Sin `print()` ni código comentado en los commits.

## 5. Frontend

- **Mobile-first:** se diseña primero para celular.
- **Sin reglas de negocio:** el frontend no decide si hay cupo, solo muestra lo que responde el backend.
- Mensajes de error claros ("Ese horario ya no tiene cupo, elegí otro").

## 6. Comunicación frontend ↔ backend

- API REST con JSON, rutas bajo `/api`.
- El frontend llama al backend **solo** desde `frontend/src/api/`, nunca con `fetch` suelto en un componente.

| Método | Ruta | Para qué |
|--------|------|----------|
| GET | `/api/actividades` | Listar actividades |
| GET | `/api/actividades/{id}/horarios` | Horarios y cupos disponibles |
| POST | `/api/inscripciones` | Crear inscripción |

Ejemplo de `POST /api/inscripciones`:

```json
{
  "actividadId": "tirolesa",
  "horario": "2026-10-17T10:00:00-03:00",
  "email": "visitante@correo.com",
  "aceptaTerminos": true,
  "cantidadPersonas": 1,
  "participantes": [
    { "nombre": "Ana Pérez", "dni": "30111222", "edad": 28, "talle": "M" }
  ]
}
```

Los errores siempre tienen el mismo formato:

```json
{ "error": { "codigo": "SIN_CUPO", "mensaje": "No hay cupo para ese horario" } }
```

| Código | HTTP |
|--------|------|
| `DATOS_INVALIDOS`, `TERMINOS_NO_ACEPTADOS`, `TALLE_REQUERIDO` | 400 |
| `ACTIVIDAD_NO_ENCONTRADA` (`ActividadInexistenteError`) | 404 |
| `SIN_CUPO`, `HORARIO_NO_DISPONIBLE`, `FUERA_DE_VENTANA`, `SUPERPOSICION_HORARIA` | 409 |

## 7. Tests unitarios (unittest)

- Un archivo de test por archivo de código (`test_*.py`), dentro de la carpeta `tests/`.
- Funciones `test_` con nombres en español que describen el comportamiento:

```python
def test_debe_rechazar_la_inscripcion_cuando_no_hay_cupo_para_el_horario(self):
    # Arrange: preparar datos
    # Act y Assert: ejecutar y verificar
    with self.assertRaises(SinCupoError):
        self.servicio.inscribir(datos)
```

- Patrón **Arrange / Act / Assert**, una verificación principal por test.
- Email y QR se reemplazan por `MagicMock`; los repositorios, por versiones en memoria.
- Los datos de ejemplo repetidos van en setUp. y en métodos auxiliares (_datos_validos, _participante_valido).
- Los tests no dependen unos de otros.

## 8. TDD y commits

Un ciclo por cada prueba de usuario: **Red → Green → Refactor**, al menos un commit por fase.

Formato: `tipo(alcance): fase - descripción`

```
test(inscripcion): red - rechaza inscripción sin cupo
feat(inscripcion): green - valida cupo disponible
refactor(inscripcion): extraer validación de cupo
```

- `test` = Red, `feat` o `fix` = Green, `refactor` = Refactor, `docs` = documentación.
- Un commit no mezcla fases. Green y Refactor nunca dejan tests en rojo.
- Push al terminar cada criterio (después de su refactor).
- **Prohibido** squash o rebase que junte commits: el historial es la evidencia del TDD.

## 9. Comandos

```bash
python -m unittest discover -v   # correr tests
uvicorn app.main:app --reload    # levantar backend
venv\Scripts\Activate.ps1        # levantar el entorno de prueba
```
