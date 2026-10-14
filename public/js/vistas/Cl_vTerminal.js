export class Cl_vTerminal {
    constructor() {
        // Referencias a los elementos del DOM basados en los IDs estándar
        this.statPasajeros = document.querySelector("#stat-pasajeros");
        this.statGanancia = document.querySelector("#stat-ganancia");
        this.tablaGananciaPorLinea = document.querySelector("#tabla-ganancia-por-linea");
        this.statLineasActivas = document.querySelector("#stat-lineas") // las lienas activas
        this.tablaAutos = document.querySelector("#tabla-autos");
        this.tablaPasajeros = document.querySelector("#tabla-pasajeros");
        this.inputBusqueda = document.querySelector("#input-busqueda");

        // Elementos de UI y Modales
        this.modalConfirmacion = document.querySelector("#modal-confirmacion");
        this.modalMensaje = document.querySelector("#modal-mensaje");
        this.btnModalConfirmar = document.querySelector("#btn-modal-confirmar");
        this.btnModalCancelar = document.querySelector("#btn-modal-cancelar");
        this.areaMensajes = document.querySelector("#area-mensajes");
    }

    /**
     * Renderiza las estadísticas globales y la tabla de rendimiento por línea en el panel superior.
     * @param {Object} datos - Contiene totalPasajeros, gananciaTotal y un arreglo de estadísticas por línea.
     */
    renderizarEstadisticas({ totalPasajeros = 0, gananciaTotal = 0, lineas = [] } = {}) {
        if (this.statPasajeros) this.statPasajeros.textContent = totalPasajeros;
        if (this.statGanancia) this.statGanancia.textContent = `$${gananciaTotal.toFixed(2)}`;
        if (this.statLineasActivas) this.statLineasActivas.textContent = lineas.length;

        if (this.tablaGananciaPorLinea) {
            if (lineas.length === 0) {
                this.tablaGananciaPorLinea.innerHTML = `<tr><td colspan="3" class="text-center">Sin registros de líneas</td></tr>`;
                return;
            }

            this.tablaGananciaPorLinea.innerHTML = lineas.map(item => `
                <tr>
                    <td>${item.linea}</td>
                    <td>${item.pasajeros}</td>
                    <td>$${item.ganancia.toFixed(2)}</td>
                </tr>
            `).join('');
        }
    }

    /**
     * Renderiza la tabla de vehículos registrados en el terminal.
     * @param {Array} lista - Arreglo de objetos Cl_Auto.
     */
    renderizarAutos(lista = []) {
        if (!this.tablaAutos) return;

        if (lista.length === 0) {
            this.tablaAutos.innerHTML = `<tr><td colspan="6" class="text-center">No hay vehículos registrados</td></tr>`;
            return;
        }

        this.tablaAutos.innerHTML = lista.map(auto => `
            <tr>
                <td>${auto.placa}</td>
                <td>${auto.linea}</td>
                <td>${auto.tipo}</td>
                <td>${auto.destino}</td>
                <td>$${Number(auto.precio || 0).toFixed(2)}</td>
                <td>${auto.estado || 'Activo'}</td>
            </tr>
        `).join('');
    }

    /**
     * Renderiza la tabla de pasajeros registrados.
     * @param {Array} lista - Arreglo de objetos Cl_Persona asociados a sus buses.
     */
       renderizarPasajeros(lista = []) {
    if (!this.tablaPasajeros) return;

    if (lista.length === 0) {
        this.tablaPasajeros.innerHTML = `<tr><td colspan="7" class="text-center">No hay pasajeros registrados</td></tr>`;
        return;
    }

    this.tablaPasajeros.innerHTML = lista.map(item => {
        const p = item.cedula && typeof item.cedula === 'object' ? item.cedula : item;
        return `
            <tr>
                <td>${p.cedula}</td>
                <td>${p.nombre}</td>
                <td>${p.apellido}</td>
                <td>${p.telefono}</td>
                <td>${p.edad}</td>
                <td>${p.placaAuto || p.placa || 'N/A'}</td>
                <td>${p.linea || 'N/A'}</td>
            </tr>
        `;
    }).join('');
}
    /**
     * Muestra un modal de confirmación con acciones personalizadas.
     * @param {string} mensaje - Texto de advertencia o consulta.
     * @param {Function} callback - Función a ejecutar si se confirma.
     */
    mostrarModal(mensaje, callback) {
        if (!this.modalConfirmacion) return;

        if (this.modalMensaje) {
            this.modalMensaje.textContent = mensaje;
        }

        this.modalConfirmacion.style.display = 'block';

        // Limpieza previa de eventos para evitar duplicidad
        const confirmarHandler = () => {
            this.cerrarModal();
            if (typeof callback === 'function') callback(true);
            limpiarEventos();
        };

        const cancelarHandler = () => {
            this.cerrarModal();
            if (typeof callback === 'function') callback(false);
            limpiarEventos();
        };

        const limpiarEventos = () => {
            if (this.btnModalConfirmar) this.btnModalConfirmar.removeEventListener('click', confirmarHandler);
            if (this.btnModalCancelar) this.btnModalCancelar.removeEventListener('click', cancelarHandler);
        };

        if (this.btnModalConfirmar) this.btnModalConfirmar.addEventListener('click', confirmarHandler, { once: true });
        if (this.btnModalCancelar) this.btnModalCancelar.addEventListener('click', cancelarHandler, { once: true });
    }

    /**
     * Cierra el modal de confirmación visual.
     */
    cerrarModal() {
        if (this.modalConfirmacion) {
            this.modalConfirmacion.style.display = 'none';
        }
    }

    /**
     * Muestra un mensaje flotante (toast) de éxito o error en la interfaz.
     * @param {string} mensaje 
     * @param {string} tipo - 'success' o 'error'
     */
    mostrarMensaje(mensaje, tipo = 'success') {
        if (!this.areaMensajes) return;

        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
        alerta.role = 'alert';
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        this.areaMensajes.appendChild(alerta);

        // Auto-remover mensaje tras 4 segundos
        setTimeout(() => {
            alerta.remove();
        }, 4000);
    }

    /**
     * Lee y extrae los datos del formulario de pasajeros del DOM.
     * @returns {Object} Objeto plano con los campos del pasajero.
     */
    leerFormularioPasajero() {
        return {
            cedula: document.querySelector("#input-cedula")?.value.trim() || "",
            nombre: document.querySelector("#input-nombre")?.value.trim() || "",
            apellido: document.querySelector("#input-apellido")?.value.trim() || "",
            telefono: document.querySelector("#input-telefono")?.value.trim() || "",
            edad: document.querySelector("#input-edad")?.value.trim() || "",
            placaAuto: document.querySelector("#input-placa-asociada")?.value.trim().toUpperCase() || ""
        };
    }

    /**
     * Lee y extrae los datos del formulario de autos del DOM.
     * @returns {Object} Objeto plano con los campos del vehículo.
     */
    leerFormularioAuto() {
        return {
            placa: document.querySelector("#input-placa")?.value.trim().toUpperCase() || "",
            linea: document.querySelector("#input-linea")?.value.trim() || "",
            tipo: document.querySelector("#input-tipo")?.value.trim() || "",
            destino: document.querySelector("#input-destino")?.value.trim() || "",
            precio: document.querySelector("#input-precio")?.value.trim() || "0"
        };
    }

    /**
     * Limpia los campos de un formulario específico mediante su ID.
     * @param {string} idFormulario 
     */
    limpiarFormulario(idFormulario) {
        const form = document.querySelector(`#${idFormulario}`);
        if (form && typeof form.reset === 'function') {
            form.reset();
        }
    }

    /**
     * Limpia el campo de búsqueda de la interfaz.
     */
    limpiarBusqueda() {
        if (this.inputBusqueda) {
            this.inputBusqueda.value = "";
        }
    }
}