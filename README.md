# Sistema de Gestión Jurídica - Módulo de Abogados

Este proyecto implementa una solución integral para la gestión de procesos jurídicos, orquestando el ciclo de vida completo de casos legales, desde la captación del cliente hasta la sentencia final en múltiples instancias. La arquitectura desacoplada utiliza **FastAPI** para la lógica de negocio y **Oracle Database 12+** para la persistencia transaccional, garantizando integridad referencial y escalabilidad.

## 🛠 Arquitectura Técnica

El sistema sigue un patrón de arquitectura en capas:

1.  **Capa de Presentación (Frontend)**:
    -   Implementada en **Vanilla JavaScript (ES6+)**, HTML5 y CSS3.
    -   Gestión de estado asíncrona mediante `async/await` para consumo de APIs.
    -   Manipulación directa del DOM para renderizado dinámico de formularios y tablas.
    -   Comunicación con Backend vía `fetch` API.

2.  **Capa de Lógica de Negocio (Backend)**:
    -   **Framework**: FastAPI (Python 3.10+).
    -   **Validación de Datos**: Pydantic para serialización/deserialización y validación estricta de tipos.
    -   **Driver de Base de Datos**: `oracledb` (Thin mode/Thick mode según configuración de Instant Client).
    -   **Gestión de Archivos**: Almacenamiento local de documentos probatorios (`/storage`) servidos estáticamente.

3.  **Capa de Persistencia (Base de Datos)**:
    -   **Motor**: Oracle Database.
    -   **Modelo**: Relacional normalizado (3FN).
    -   **Integridad**: Uso extensivo de Foreign Keys, Primary Keys compuestas y Constraints.

## 💾 Modelo de Datos (Oracle)

El núcleo del sistema reside en un esquema relacional robusto diseñado para soportar la complejidad procesal colombiana (Civil, Penal, Laboral).

### Entidades Principales

*   **CASO (`PK: NOCASO`)**: Entidad central.
    *   *Regla de Negocio*: Un caso se considera "Activo" si `FECHAFIN` es `NULL`.
    *   *Consecutivo*: Generado programáticamente (`MAX(NOCASO) + 1`) para asegurar unicidad secuencial.
*   **EXPEDIENTE (`PK Compuesta: CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE`)**:
    *   Representa una instancia o momento procesal específico dentro de un caso.
    *   Vincula al Abogado, Lugar (Juzgado/Fiscalía) y la Etapa Procesal.
*   **ESPECIA_ETAPA**: Tabla de configuración que define el flujo de trabajo (workflow) válido para cada especialización (ej. Penal: Indagación -> Imputación -> Acusación...).
*   **SUCESO y RESULTADO**: Tablas de detalle que registran la bitácora de eventos y fallos judiciales asociados a un expediente específico.

## 🚀 Funcionalidades y Lógica de Negocio

### 1. Gestión de Casos (Pestaña "Caso")
El módulo implementa una máquina de estados para la gestión de casos:

*   **Búsqueda Inteligente**:
    *   Consulta de clientes por coincidencia parcial (`LIKE`) en nombre y apellido.
    *   *Lógica*: Al seleccionar un cliente, el sistema dispara dos procesos asíncronos en paralelo:
        1.  Recuperación del **último caso activo** (si existe) para pre-llenado del formulario.
        2.  Poblado del `select` de historial con todos los casos activos asociados al `CODCLIENTE`.
*   **Inmutabilidad de Datos**:
    *   Los casos existentes se cargan en modo **Solo Lectura** (`disabled`).
    *   La edición está restringida para preservar la integridad histórica del proceso.
*   **Creación de Casos**:
    *   Habilita selectivamente los campos (`Fecha Inicio`, `Especialización`, `Valor`).
    *   Fuerza `FECHAFIN = NULL` en la inserción para marcar el caso como abierto.
    *   Asigna automáticamente el consecutivo `NOCASO`.

### 2. Gestión Procesal (Pestaña "Expediente")
Maneja la complejidad de las etapas judiciales:

*   **Navegación Jerárquica**: Selección de Caso -> Carga de Expedientes asociados.
*   **Control de Etapas**:
    *   Validación contra `ESPECIA_ETAPA` para asegurar que el expediente corresponda al flujo correcto de la especialización (Civil, Penal, etc.).
*   **Gestión Documental**:
    *   Subida de archivos (`blob` o referencia a sistema de archivos) vinculados a la llave compuesta del expediente.

## ⚙️ Guía de Instalación y Despliegue

### Prerrequisitos
*   Python 3.9 o superior.
*   Oracle Database (XE, Standard o Enterprise) 12c+.
*   Oracle Instant Client (si se requiere modo Thick).

### 1. Configuración de Base de Datos
Ejecutar los scripts SQL en el siguiente orden estricto para satisfacer dependencias:
1.  `src/db/initDB.sql`: Creación de tablas, constraints y secuencias.
2.  `src/db/inserts.sql`: Carga de datos maestros (Tipos, Especializaciones, Etapas).
3.  `src/db/caso.sql`: (Opcional) Carga de casos de prueba/hipotéticos.

### 2. Configuración del Backend
1.  Navegar al directorio del backend:
    ```bash
    cd src/backend
    ```
2.  Crear y activar entorno virtual:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    # .\venv\Scripts\activate # Windows
    ```
3.  Instalar dependencias:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configurar conexión Oracle en `main.py`:
    *   Verificar variables `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_SERVICE`.
    *   Asegurar que `INSTANT_CLIENT_DIR` apunte a una ruta válida si se usa Windows/Thick mode.

### 3. Ejecución
1.  Iniciar el servidor de aplicaciones (Uvicorn):
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    *La API estará disponible en `http://localhost:8000` y la documentación Swagger en `http://localhost:8000/docs`.*

2.  Desplegar Frontend:
    *   Opción A: Abrir `src/frontend/index.html` directamente en el navegador.
    *   Opción B (Recomendada): Servir con Python o Live Server.
        ```bash
        cd src/frontend
        python -m http.server 5500
        ```

## 🔧 Endpoints Clave (API Reference)

| Método | Endpoint | Descripción Técnica |
| :--- | :--- | :--- |
| `GET` | `/api/cliente/buscar/{n}/{a}` | Búsqueda `LIKE` indexada por nombre/apellido. |
| `GET` | `/api/caso/ultimo/{id}` | Retorna tupla con `MAX(NOCASO)` donde `FECHAFIN IS NULL`. |
| `POST` | `/api/caso/crear` | Transacción atómica para insertar cabecera de caso. |
| `GET` | `/api/expediente/{k1}/{k2}...` | Recuperación por llave compuesta de 4 niveles. |