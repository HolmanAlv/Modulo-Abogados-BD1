# Sistema de Gestión de Casos y Expedientes  Gabinete de Abogados

Sistema web completo para la gestión de casos y expedientes de un gabinete de abogados, desarrollado con **FastAPI** (Python) en el backend, **HTML5/CSS3/JavaScript** en el frontend, y **Oracle** como base de datos.

## Descripción

Este proyecto incluye:
- Backend REST API con FastAPI para gestión de clientes, casos y expedientes
- Frontend web responsivo con interfaz moderna e intuitiva
- Conexión directa a Oracle sin ORMs (para máximo control de BD)
- Documentación automática de API con Swagger
- Módulo de Gestión de Caso y Módulo de Gestión de Expediente

## Guía de Instalación Completa

 Crea un entorno virtual de Python:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Si tienes problemas de ejecución de scripts, ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

4. Instala las dependencias del backend:

```powershell
cd src/backend
pip install -r requirements.txt
```

### Paso 3: Configurar Credenciales de Oracle

Edita `src/backend/main.py` y localiza la sección de configuración de base de datos (aproximadamente líneas 10-20).

Actualiza las credenciales:

```python
DATABASE_CONFIG = {
    "user": "tu_usuario_oracle",
    "password": "tu_contraseña_oracle",
    "dsn": "tu_host:1521/tu_servicio"
}
```

Reemplaza los siguientes valores con los de tu instancia Oracle:
- `tu_usuario_oracle`: Usuario de tu base de datos Oracle
- `tu_contraseña_oracle`: Contraseña del usuario
- `tu_host`: Dirección del servidor Oracle (ej: localhost o 192.168.1.100)
- `tu_servicio`: Nombre del servicio Oracle (ej: ORCL, XE)

### Paso 4: Inicializar la Base de Datos (Opcional)

Si necesitas crear las tablas desde cero:

1. Conéctate a tu instancia Oracle usando SQL*Plus o SQL Developer
2. Ejecuta el script de creación:

```sql
@src/db/initDB.sql
```

3. Carga los datos de prueba:

```sql
@src/db/inserts.sql
```

**Nota:** Si la base de datos ya existe, omite este paso.

## Ejecución del Sistema

### Iniciar el Backend (FastAPI)

Desde la carpeta raíz del proyecto:

```powershell
cd src/backend
python main.py
```

El servidor estará disponible en: **http://localhost:8000**

Para ver la documentación interactiva de la API (Swagger UI):
- Abre en tu navegador: **http://localhost:8000/docs**

### Iniciar el Frontend

En una nueva ventana de PowerShell (desde la carpeta raíz):

```powershell
cd src/frontend
python -m http.server 8001
```

El frontend estará disponible en: **http://localhost:8001**