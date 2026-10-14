import { Cl_persona } from '../modelos/Cl_persona.js';
import { Cl_auto } from '../modelos/Cl_auto.js';

export class Cl_cTerminal {
    constructor(terminal, vista) {
        this.terminal = terminal;
        this.vista = vista;
        this.inicializarEventos();
    }

    /**
     * Inicializa los escuchadores de eventos para formularios y botones de la interfaz.
     */
    inicializarEventos() {
        // Formulario de Pasajero
        const formPasajero = document.querySelector("#form-pasajero");
        if (formPasajero) {
            formPasajero.addEventListener("submit", (e) => this.manejarGuardarPasajero(e));
        }

        // Formulario de Auto
        const formAuto = document.querySelector("#form-auto");
        if (formAuto) {
            formAuto.addEventListener("submit", (e) => this.manejarGuardarAuto(e));
        }

        // Barra de Búsqueda en tiempo real
        if (this.vista.inputBusqueda) {
            this.vista.inputBusqueda.addEventListener("input", (e) => this.manejarBusqueda(e));
        }
    }

    /**
     * Carga inicial de datos desde el backend y refresca la vista completa.
     */
    async iniciar() {
        try {
            await this.terminal.cargar();
            this.actualizarVistaGeneral();
        } catch (error) {
            this.vista.mostrarMensaje("Error al conectar con el servidor para cargar los datos.", "error");
        }
    }

    /**
     * Maneja el evento de guardado de un nuevo pasajero.
     * @param {Event} evento 
     */
    async manejarGuardarPasajero(evento) {
        evento.preventDefault();
        try {
            const datos = this.vista.leerFormularioPasajero();

            // Creación y validación intrínseca mediante la clase Persona
            const persona = new Cl_persona(
                datos.cedula,
                datos.nombre,
                datos.apellido,
                datos.telefono,
                datos.edad,
                datos.placaAuto
            );

            // Intentar registrar en el terminal (validando duplicados en el bus)
            this.terminal.agregarPasajero(persona, datos.placaAuto);

            // Persistencia asíncrona en el servidor
            await this.terminal.guardar();

            // Refrescar interfaz, limpiar y notificar éxito
            this.actualizarVistaGeneral();
            this.vista.limpiarFormulario("form-pasajero");
            this.vista.mostrarMensaje("Pasajero registrado y guardado con éxito.", "success");
        } catch (error) {
            this.vista.mostrarMensaje(error.message, "error");
        }
    }

    /**
     * Maneja el evento de guardado de un nuevo vehículo.
     * @param {Event} evento 
     */
    async manejarGuardarAuto(evento) {
        evento.preventDefault();
        try {
            const datos = this.vista.leerFormularioAuto();

            // Creación y validación intrínseca mediante la clase Auto
            const auto = new Cl_auto(datos);

            // Intentar registrar en el terminal (validando placas únicas)
            this.terminal.agregarAuto(auto);

            // Persistencia asíncrona en el servidor
            await this.terminal.guardar();

            // Refrescar interfaz, limpiar y notificar éxito
            this.actualizarVistaGeneral();
            this.vista.limpiarFormulario("form-auto");
            this.vista.mostrarMensaje("Vehículo registrado y guardado con éxito.", "success");
        } catch (error) {
            this.vista.mostrarMensaje(error.message, "error");
        }
    }

    /**
     * Filtra en memoria (tiempo real) los pasajeros por cédula o línea.
     * @param {Event} evento 
     */
    manejarBusqueda(evento) {
        const query = evento.target.value.trim().toLowerCase();

        if (query === "") {
            this.vista.renderizarPasajeros(this.terminal.listaPasajeros);
            return;
        }

         const filtrados = this.terminal.listaPasajeros.filter(p => {
         const ced = String(p.cedula?.cedula ?? p.cedula ?? "").toLowerCase();
         const lin = String(p.linea ?? "").toLowerCase();
            return ced.includes(query) || lin.includes(query);
});

        this.vista.renderizarPasajeros(filtrados);
    }

    /**
     * Maneja el modal de confirmación devolviendo una Promesa basada en la respuesta del usuario.
     * @param {string} mensaje 
     * @returns {Promise<boolean>}
     */
    manejarConfirmacion(mensaje) {
        return new Promise((resolve) => {
            this.vista.mostrarModal(mensaje, (confirmado) => {
                resolve(confirmado);
            });
        });
    }

    /**
     * Método auxiliar privado para recolectar métricas del modelo y repintar toda la vista.
     */
    actualizarVistaGeneral() {
        // 1. Recolectar datos y estadísticas del modelo
        const totalP = this.terminal.totalPasajeros();
        const gananciaTotal = this.terminal.gananciaTotalTerminal();

        // Obtener líneas únicas desde los autos registrados para calcular rendimiento individual
        const lineasUnicas = [...new Set(this.terminal.listaAutos.map(a => a.linea).filter(Boolean))];
        const lineasEstadisticas = lineasUnicas.map(linea => ({
            linea: linea,
            pasajeros: this.terminal.contarPasajerosPorLinea(linea),
            ganancia: this.terminal.gananciaTerminalPorLinea(linea)
        }));

        // 2. Enviar a la vista para que renderice
        this.vista.renderizarEstadisticas({
            totalPasajeros: totalP,
            gananciaTotal: gananciaTotal,
            lineas: lineasEstadisticas
        });

        this.vista.renderizarAutos(this.terminal.listaAutos);
        this.vista.renderizarPasajeros(this.terminal.listaPasajeros);
    }
}