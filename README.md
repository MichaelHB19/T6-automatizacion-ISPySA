# Suite E2E - Módulo de Monitoreo y Vigilancia Epidemiológica (TP6)

Suite de pruebas funcionales automatizadas de extremo a extremo (E2E) desarrollada bajo el marco normativo de **ISO/IEC/IEEE 29119** (partes 1 a 5) y ejecutada con **Playwright Test** sobre el motor de renderizado **Chromium**.

---

## 1. Requisitos del Sistema
- **Python**: Versión 3.10 o 3.11.
- **Node.js**: Versión v20.x LTS o superior (entorno verificado con `v24.22.0`).
- **Navegador**: Chromium gestionado automáticamente por Playwright.
- **Sistema Operativo**: Windows 10/11 de 64 bits o Linux (Ubuntu / WSL).

---

## 2. Estructura de Directorios del Proyecto
Para que la aplicación Flask resuelva las rutas relativas de outputs y tablas del proyecto analítico, las carpetas deben conservar la relación de hermandad en el mismo nivel:

```text
monitoreo-salud-publica-iso25000/
├── ISPySA-Pneumonia-main/          # Proyecto analítico legado (series CSV, figuras PNG y modelos)
├── monitoreo_salud_publica/        # Aplicación web Flask (app.py, templates, static)
└── e2e-tests/                      # Suite de automatización Playwright
    ├── data/
    │   └── test-data.json          # Datos de prueba desacoplados y oráculos
    ├── helpers/
    │   ├── navigation.js           # Acciones de navegación reutilizables
    │   └── assertions.js           # Oráculos numéricos y validación de recursos
    ├── tests/
    │   ├── t01-t06.spec.js         # Casos de prueba T01 a T06
    │   └── t07-t12.spec.js         # Casos de prueba T07 a T12
    ├── playwright.config.js        # Configuración determinista (workers=1, retries=0, puerto 5001)
    ├── package.json
    └── README.md
```
## 3. Despliegue del Backend (Aplicativo Flask)

### Paso 3.1: Acceder al directorio de la aplicación
Abre una terminal y colócate en la carpeta del aplicativo Flask:

```bash
cd monitoreo_salud_publica
```

### Paso 3.2: Creación del entorno virtual e instalación de librerías Python

- **En Windows (PowerShell):**
  ```powershell
  # 1. Crear el entorno virtual
  python -m venv venv

  # 2. Activar el entorno virtual
  .\venv\Scripts\Activate.ps1

  # 3. Instalar librerías requeridas (Flask >= 3.0, pandas >= 2.0)
  pip install --upgrade pip
  pip install Flask pandas Werkzeug
  ```

- **En Linux / WSL / macOS (Bash):**
  ```bash
  # 1. Crear el entorno virtual
  python3 -m venv venv

  # 2. Activar el entorno virtual
  source venv/bin/activate

  # 3. Instalar librerías requeridas
  pip install --upgrade pip
  pip install Flask pandas Werkzeug
  ```

### Paso 3.3: Iniciar el servidor en el puerto 5001
Debido a la incidencia de infraestructura `OBS-01` (puerto 5000 restringido en ciertos entornos locales), es obligatorio fijar la variable de entorno `PORT=5001` antes de arrancar

- **En Windows (PowerShell):**
  ```powershell
  $env:PORT="5001"
  python app.py
  ```

- **En Linux / WSL (Bash):**
  ```bash
  export PORT=5001
  python3 app.py
  ```

> **Verificación manual previa:** Abre en el navegador `http://127.0.0.1:5001/`. Debe mostrarse la vista de "Resumen Nacional" con los indicadores de 422 y 702 casos. Mantén esta terminal abierta.

---

## 4. Instalación de la Suite de Automatización E2E

Abre una **segunda terminal** y navega hasta el directorio de pruebas:

```bash
cd e2e-tests
```

### Paso 4.1: Instalar dependencias del proyecto Node.js
Instala el paquete `@playwright/test` registrado en `package.json`:

```bash
npm install
```

### Paso 4.2: Descargar el motor Chromium
Instala el binario específico de Chromium controlado por Playwright:

- **En Windows:**
  ```powershell
  npx playwright install chromium
  ```

- **En Linux / WSL (incluyendo librerías compartidas del sistema si fuera necesario):**
  ```bash
  npx playwright install --with-deps chromium
  ```

---

## 5. Ejecución de Pruebas

Asegúrate de que el servidor Flask continúe en ejecución en el puerto 5001.

### A. Ejecución de la primera mitad (T01 a T06)
Ejecuta la validación inicial de los seis primeros casos con un solo trabajador y sin reintentos:
```bash
npm run test:mitad
```
*(Comando directo equivalente: `npx playwright test tests/t01-t06.spec.js --project=chromium`)*.

### B. Ejecución completa de la suite (T01 a T12)
Ejecuta todos los casos de prueba implementados:
```bash
npm test
```

### C. Ejecución de las tres pasadas experimentales
Para conservar los reportes y evidencias aisladas de cada pasada exigida por la metodología:
```bash
# Pasada experimental 1
npm run test:p1

# Pasada experimental 2
npm run test:p2

# Pasada experimental 3
npm run test:p3
```

---

## 6. Visualización de Reportes y Evidencias
Para abrir el reporte HTML interactivo con el registro de tiempos, aserciones y capturas generadas:

```bash
npm run report
```
*(Comando directo equivalente: `npx playwright show-report`)*.