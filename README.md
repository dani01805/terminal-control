# 🚌 TerminalControl

Sistema de gestión y control estadístico para un terminal de pasajeros. Permite registrar flotas de vehículos, chequeo de pasajeros, y calcular estadísticas operativas y financieras en tiempo real.

![Estado](https://img.shields.io/badge/status-funcional-success)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Modelo de Datos](#-modelo-de-datos)
- [Lecciones Aprendidas](#-lecciones-aprendidas)
- [Autor](#-autor)
- [Licencia](#-licencia)

---

## 📖 Descripción

**TerminalControl** es una aplicación web full-stack desarrollada como proyecto de portafolio para demostrar dominio de:

- **POO (Programación Orientada a Objetos)** con clases ES6 en el frontend.
- **Patrón MVC** (Modelo-Vista-Controlador) implementado con JavaScript vanilla modular.
- **Node.js + Express** como backend ligero con persistencia en archivo JSON.
- **Arquitectura desacoplada**: modelos, vistas y controladores en carpetas separadas.

El sistema modela un terminal de pasajeros real: registra vehículos con su línea de transporte, asocia pasajeros a buses específicos, y calcula ganancias por línea y totales del terminal aplicando una tasa configurable por pasajero.

---

## ✨ Características

- ✅ **Registro de vehículos** con validación de placas únicas.
- ✅ **Registro de pasajeros** con validación de cédula única por bus.
- ✅ **Búsqueda en tiempo real** por cédula o línea de transporte.
- ✅ **Panel de estadísticas** con:
  - Total de pasajeros del día.
  - Ganancia total del terminal.
  - Cantidad de líneas activas.
  - Desglose de pasajeros y ganancia **por línea**.
- ✅ **Persistencia automática** en `data.json` sin necesidad de base de datos.
- ✅ **Reconstrucción de objetos reales** al cargar datos (`fromJSON`), preservando la POO.
- ✅ **Mensajes de error/éxito** mediante toasts.
- ✅ **Interfaz responsive** con Bootstrap 5.

---

## 🏗️ Arquitectura

El proyecto sigue estrictamente el patrón **MVC**:

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                                                             │
│   ┌──────────────┐      ┌────────────────┐      ┌────────┐  │
│   │   MODELO     │◄────►│  CONTROLADOR   │◄────►│  VISTA │  │
│   │              │      │                │      │        │  │
│   │ Cl_terminal  │      │ Cl_cTerminal   │      │Cl_vTerm│  │
│   │ Cl_persona   │      │  (eventos,     │      │  (DOM, │  │
│   │ Cl_auto      │      │   fetch,       │      │ render)│  │
│   │              │      │   validación)  │      │        │  │
│   └──────┬───────┘      └───────┬────────┘      └────────┘  │
│          │                      │                           │
│          │                      │ fetch('/api/...')         │
└──────────┼──────────────────────┼───────────────────────────┘
           │                      │
           │                      ▼
           │          ┌───────────────────────┐
           │          │       BACKEND         │
           │          │  server.js (Express)  │
           │          │  ├─ GET /api/datos    │
           │          │  ├─ POST /api/guardar │
           │          │  └─ GET /api/estadis. │
           │          └──────────┬────────────┘
           │                     │
           └─────────────────────┤
                                 ▼
                          ┌─────────────┐
                          │  data.json  │
                          │ (persist.)  │
                          └─────────────┘
```

### Principios aplicados

- **Separación de responsabilidades:** la vista no conoce la lógica de negocio, el modelo no toca el DOM.
- **Encapsulamiento:** atributos privados (`_nombre`, `_cedula`) con getters/setters.
- **Serialización controlada:** métodos `toJSON()` y `fromJSON()` en cada modelo para garantizar consistencia entre memoria y disco.

---

## 🛠️ Tecnologías

| Capa | Tecnología | Uso |
|---|---|---|
| **Backend** | Node.js + Express | Servidor HTTP y API REST |
| **Persistencia** | `fs` (módulo nativo) + JSON | Lectura/escritura de `data.json` |
| **Frontend** | JavaScript ES6+ (módulos) | POO, fetch API, manipulación del DOM |
| **Estilos** | Bootstrap 5 + CSS personalizado | Interfaz responsive |
| **Herramientas** | npm, Git | Gestión de dependencias y versionado |

**Sin frameworks de frontend** (React, Vue, Angular) — todo el frontend es vanilla JS a propósito, para demostrar dominio de los fundamentos.

---

## 🚀 Instalación

### Requisitos previos

- Node.js 18 o superior.
- npm (viene con Node.js).

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/terminal-control.git
cd terminal-control

# 2. Instalar dependencias
npm install

# 3. Arrancar el servidor
npm start
```

La aplicación estará disponible en **http://localhost:3000**.

---

## 🎮 Uso

### Registrar un vehículo

1. Ve a la sección **"Módulo de Registro Operativo"**.
2. Completa: placa, línea, tipo, destino y precio.
3. Presiona **Guardar**.

### Registrar un pasajero

1. Completa: cédula (8 dígitos), nombre, apellido, teléfono (10-11 dígitos), edad y placa del bus.
2. Presiona **Guardar**.

> ⚠️ El pasajero solo se puede registrar si la placa del bus ya existe en el sistema.

### Consultar estadísticas

El panel superior se actualiza automáticamente:
- Pasajeros del día.
- Ganancia total del terminal.
- Líneas activas.
- Desglose de pasajeros y ganancia por línea.

### Buscar pasajeros

Usa la barra de búsqueda para filtrar por **cédula** o **línea** en tiempo real.

---

## 📁 Estructura del Proyecto

```
terminal-control/
│
├── public/                     # Frontend estático
│   ├── index.html
│   ├── styles.css
│   │
│   ├── modelos/                # Capa Modelo
│   │   ├── Cl_persona.js
│   │   ├── Cl_auto.js
│   │   └── Cl_terminal.js
│   │
│   ├── vistas/                 # Capa Vista
│   │   └── Cl_vTerminal.js
│   │
│   ├── controladores/          # Capa Controlador
│   │   └── Cl_cTerminal.js
│   │
│   └── main.js                 # Punto de entrada
│
├── data.json                   # Persistencia (auto-generado)
├── server.js                   # Backend Express
├── package.json
└── README.md
```

## 🔌 API

El backend expone una API REST interna consumida exclusivamente por el frontend. Los endpoints, contratos y esquemas de validación se documentan en la Wiki del repositorio (acceso restringido a colaboradores).

> Por razones de seguridad, no se publican los detalles de la capa de transporte ni las rutas internas del servidor en este README.
---

## 📊 Modelo de Datos

### Clases del Modelo

| Clase | Responsabilidad | Métodos clave |
|---|---|---|
| `Cl_persona` | Representa un pasajero con validaciones de formato | `validar()`, `toJSON()`, `fromJSON()` |
| `Cl_auto` | Representa un vehículo de la flota | `toJSON()`, `fromJSON()` |
| `Cl_terminal` | Gestiona las listas y los cálculos estadísticos | `agregarAuto()`, `agregarPasajero()`, `cargar()`, `guardar()` |

---

## 📚 Lecciones Aprendidas

Durante la fase de integración se documentaron 9 errores relevantes, todos resueltos. Los más representativos:

### 1. **Error de formato en `package.json`**
El servidor no arrancaba por un `package.json` vacío. **Lección:** verificar la configuración antes que el código.

### 2. **Datos anidados bajo `cedula`**
`Cl_persona` esperaba 6 parámetros posicionales, pero se le pasaba un objeto entero. **Lección:** respetar la firma de los constructores.

### 3. **Desajuste `placa` vs `placaAuto`**
La persistencia exportaba una clave y el resto del sistema leía otra. **Lección:** un solo nombre canónico por atributo en toda la arquitectura.

### 4. **Faltaba `controlador.iniciar()` en `main.js`**
El controlador se instanciaba pero nunca disparaba el `fetch('/api/datos')`. **Lección:** verificar la pestaña Network del navegador cuando la app no carga datos.

### 5. **Filtros no tolerantes a la carga desde disco**
`buscarPasajerosPorLinea` solo leía `p.placaAuto`, pero al reconstruir desde `data.json` ese atributo no existía en memoria. **Lección:** los filtros deben ser tolerantes a las dos vías de acceso al mismo dato.

> La bitácora completa con los 9 errores, sus causas raíz y soluciones está disponible en la sección de Wiki del repositorio.

---

## 👤 Autor
DANIEL PIMENTEL

- GitHub:dani01805
- LinkedIn: www.linkedin.com/in/daniel-pimentel-057577342
- Email: danipimentel008@gmail.com

Proyecto desarrollado como parte de mi portafolio personal para demostrar dominio de **JavaScript vanilla, POO, MVC, Node.js y arquitectura full-stack sin frameworks de frontend**.


## Agradecimientos

A la comunidad de desarrollo por las buenas prácticas documentadas y a los principios SOLID y DRY que guiaron la refactorización.

---

⭐ Si este proyecto te resultó útil o interesante, considera darle una estrella en GitHub.