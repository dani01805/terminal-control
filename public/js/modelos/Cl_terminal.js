import Cl_persona from './Cl_persona.js';
import Cl_auto from './Cl_auto.js';

export default class Cl_Terminal {
    constructor({ nombre = "Terminal Central", tasaPasajero = 1 } = {}) {
        this.listaPasajeros = [];
        this.listaAutos = [];
        this.config = {
            nombre: nombre,
            tasaPasajero: Number(tasaPasajero)
        };
    }

    /**
     * Agrega un auto al sistema validando que la placa no esté duplicada.
     * @param {Cl_auto} auto 
     */
    agregarAuto(auto) {
        if (!auto || !(auto instanceof Cl_auto)) {
            throw new Error("El objeto auto no es válido.");
        }

        // Validar que la placa no se repita en el sistema
        const existe = this.listaAutos.some(a => a.placa.toUpperCase() === auto.placa.toUpperCase());
        if (existe) {
            throw new Error(`Ya existe un auto registrado con la placa ${auto.placa}.`);
        }

        this.listaAutos.push(auto);
    }

    /**
     * Agrega un pasajero validando que su cédula no se repita en el mismo bus.
     * @param {Cl_persona} persona 
     * @param {string} placaAuto - Placa del auto donde intenta registrarse
     */
    agregarPasajero(persona, placaAuto) {
        if (!persona || !(persona instanceof Cl_persona)) {
            throw new Error("El objeto persona no es válido.");
        }

        // Verificar que el auto exista en el terminal
        const autoDestino = this.listaAutos.find(a => a.placa.toUpperCase() === placaAuto.toUpperCase());
        if (!autoDestino) {
            throw new Error("El vehículo especificado no está registrado en el terminal.");
        }

        // La cédula es única SOLO dentro del mismo bus
        const repetidoEnBus = this.listaPasajeros.some(
            p => p.cedula === persona.cedula && p.placaAuto?.toUpperCase() === placaAuto.toUpperCase()
        );

        if (repetidoEnBus) {
            throw new Error(`El pasajero con cédula ${persona.cedula} ya está registrado en este autobús.`);
        }

        // Asociamos temporalmente la propiedad del bus al pasajero en memoria si lo requiere la lógica
        persona.placaAuto = placaAuto.toUpperCase();
        this.listaPasajeros.push(persona);
    }

    /**
     * Busca todos los registros de viaje de un pasajero por su número de cédula.
     * @param {string} cedula 
     */
    buscarPasajerosPorCedula(cedula) {
        const cedulaStr = String(cedula || "").trim();
        return this.listaPasajeros.filter(p => p.cedula === cedulaStr);
    }

    /**
     * Busca los pasajeros asociados a una línea de transporte específica a través de sus autos.
     * @param {string} linea 
     */
    buscarPasajerosPorLinea(linea) {
        const lineaStr = String(linea || "").trim().toUpperCase();
        // Identificar placas que pertenecen a esa línea
        const placasLinea = this.listaAutos
            .filter(a => a.linea?.toUpperCase() === lineaStr)
            .map(a => a.placa.toUpperCase());

        return this.listaPasajeros.filter(p => placasLinea.includes(p.placaAuto?.toUpperCase()));
    }

    /**
     * Cuenta la cantidad de pasajeros que han viajado en una línea específica.
     * @param {string} linea 
     */
    contarPasajerosPorLinea(linea) {
        return this.buscarPasajerosPorLinea(linea).length;
    }

    /**
     * Calcula la ganancia generada por una línea (Pasajeros de la línea × tasa del terminal).
     * @param {string} linea 
     */
    gananciaTerminalPorLinea(linea) {
        const totalPasajerosLinea = this.contarPasajerosPorLinea(linea);
        return totalPasajerosLinea * this.config.tasaPasajero;
    }

    /**
     * Retorna el total general de pasajeros registrados en el terminal.
     */
    totalPasajeros() {
        return this.listaPasajeros.length;
    }

    /**
     * Calcula la ganancia total acumulada del terminal por todos los pasajeros.
     */
    gananciaTotalTerminal() {
        return this.totalPasajeros() * this.config.tasaPasajero;
    }

    /**
     * Reemplaza la lista de pasajeros internos mediante objetos reales.
     * @param {Cl_persona[]} lista 
     */
    setPasajeros(lista) {
        this.listaPasajeros = Array.isArray(lista) ? lista : [];
    }

    /**
     * Reemplaza la lista de autos internos mediante objetos reales.
     * @param {Cl_auto[]} lista 
     */
    setAutos(lista) {
        this.listaAutos = Array.isArray(lista) ? lista : [];
    }

    /**
     * Carga los datos de forma asíncrona desde el backend (GET /api/datos).
     */
    async cargar() {
        try {
            const response = await fetch('/api/datos');
            if (!response.ok) {
                throw new Error("Error al obtener los datos del servidor.");
            }
            const data = await response.json();

            // Reconstrucción segura usando los métodos fromJSON de las clases
            if (data.config) {
                this.config = { ...this.config, ...data.config };
            }

            if (Array.isArray(data.autos)) {
                this.listaAutos = data.autos.map(item => Cl_auto.fromJSON ? Cl_auto.fromJSON(item) : new Cl_auto(item));
            }

            if (Array.isArray(data.passengers || data.pasajeros)) {
                const rawPasajeros = data.passengers || data.pasajeros;
                this.listaPasajeros = rawPasajeros.map(item => Cl_persona.fromJSON ? Cl_persona.fromJSON(item) : new Cl_persona(item));
            }
        } catch (error) {
            console.error("Fallo al cargar datos del terminal:", error);
            throw error;
        }
    }

    /**
     * Guarda el estado actual de forma asíncrona en el backend (POST /api/guardar).
     */
    async guardar() {
        try {
            const payload = {
                pasajeros: this.listaPasajeros.map(p => typeof p.toJSON === 'function' ? p.toJSON() : { ...p }),
                autos: this.listaAutos.map(a => typeof a.toJSON === 'function' ? a.toJSON() : { ...a }),
                config: this.config
            };

            const response = await fetch('/api/guardar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Error al guardar los datos en el servidor.");
            }

            return await response.json();
        } catch (error) {
            console.error("Fallo al guardar datos del terminal:", error);
            throw error;
        }
    }
}
