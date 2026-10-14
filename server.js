const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware para procesar cuerpos JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta public/
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '.')));

/**
 * Función auxiliar para leer y asegurar la existencia de data.json
 */
function obtenerDatos() {
    if (!fs.existsSync(DATA_FILE)) {
        const datosIniciales = {
            pasajeros: [],
            autos: [],
            config: { nombre: "TerminalControl", tasa: 1 }
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(datosIniciales, null, 2), 'utf-8');
    }
    try {
        const contenido = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(contenido);
    } catch (error) {
        throw new Error("El archivo data.json está corrupto o mal formado.");
    }
}

// GET /api/datos → Devuelve todo el contenido de data.json
app.get('/api/datos', (req, res) => {
    try {
        const datos = obtenerDatos();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/guardar → Recibe y sobrescribe data.json
app.post('/api/guardar', (req, res) => {
    try {
        const body = req.body;
        
        // Validación de que el body sea un objeto válido
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return res.status(400).json({ error: "El cuerpo de la petición debe ser un objeto JSON válido." });
        }

        const { pasajeros, autos, config } = body;
        if (!Array.isArray(pasajeros) || !Array.isArray(autos) || !config) {
            return res.status(400).json({ error: "Estructura de datos incompleta o mal formada." });
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), 'utf-8');
        res.json({ mensaje: "Datos guardados correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error interno al guardar los datos en el servidor." });
    }
});

// GET /api/estadisticas → Calcula y devuelve las métricas financieras y operativas
// GET /api/estadisticas → Calcula y devuelve las métricas financieras y operativas
app.get('/api/estadisticas', (req, res) => {
    try {
        const datos = obtenerDatos();
        const pasajeros = datos.pasajeros || [];
        const autos = datos.autos || [];
        const tasa = datos.config?.tasa || 1;

        const totalPasajeros = pasajeros.length;

        // Extraer líneas únicas desde los autos registrados (soportando _linea o linea)
        const lineasUnicas = [...new Set(autos.map(a => a.linea || a._linea).filter(Boolean))];

        const porLinea = lineasUnicas.map(linea => {
            // Contar pasajeros asociados a la línea contemplando placa, _placa o placaAuto
            const pasajerosLinea = pasajeros.filter(p => {
                const lineaPasajero = p.linea || p._linea;
                if (lineaPasajero && lineaPasajero.toLowerCase() === linea.toLowerCase()) return true;
                
                const placaAsociada = p.placa || p._placa || p.placaAuto;
                if (placaAsociada) {
                    const autoEncontrado = autos.find(a => {
                        const placaAuto = a.placa || a._placa;
                        return placaAuto && placaAuto.toUpperCase() === placaAsociada.toUpperCase();
                    });
                    return autoEncontrado && (autoEncontrado.linea || autoEncontrado._linea).toLowerCase() === linea.toLowerCase();
                }
                return false;
            }).length;

            const ganancia = pasajerosLinea * tasa;
            return {
                linea,
                pasajeros: pasajerosLinea,
                ganancia
            };
        });

        const gananciaTotal = porLinea.reduce((acc, item) => acc + item.ganancia, 0);

        res.json({
            totalPasajeros,
            gananciaTotal,
            porLinea
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Arrancar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`TerminalControl corriendo en http://localhost:${PORT}`);
});