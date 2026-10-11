// Cl_Auto.js
// Representa UN bus/autobús del terminal.
// La placa es la clave única del bus.

export class Cl_Auto {
    constructor({ placa, linea, tipo, activo = true, destino, precio }) {
        this._placa = placa;
        this._linea = linea;
        this._tipo = tipo;
        this._activo = activo;
        this._destino = destino;
        this._precio = precio;
    }

    // --- Getters y Setters ---
    set placa(v) { this._placa = v; }
    get placa() { return this._placa; }

    set linea(v) { this._linea = v; }
    get linea() { return this._linea; }

    set tipo(v) { this._tipo = v; }
    get tipo() { return this._tipo; }

    set activo(v) { this._activo = Boolean(v); }
    get activo() { return this._activo; }

    set destino(v) { this._destino = v; }
    get destino() { return this._destino; }

    set precio(v) { this._precio = Number(v); }
    get precio() { return this._precio; }

    // --- Validación de esta instancia ---
    // Solo verifica que los datos tengan formato correcto.
    // La unicidad de placa la maneja Cl_Terminal.
    validar() {
        const placaStr = String(this._placa || "").trim().toUpperCase();
        if (placaStr === "") {
            throw new Error("La placa del vehículo no puede estar vacía.");
        }
        if (!/^[A-Z0-9]{5,8}$/.test(placaStr)) {
            throw new Error("La placa debe tener entre 5 y 8 caracteres alfanuméricos.");
        }
        this._placa = placaStr;

        if (!String(this._linea || "").trim()) {
            throw new Error("Debe indicar la línea comercial del bus.");
        }
        if (!String(this._tipo || "").trim()) {
            throw new Error("Debe indicar el tipo de bus.");
        }
        if (!String(this._destino || "").trim()) {
            throw new Error("Debe indicar el destino del bus.");
        }
        const precioNum = Number(this._precio);
        if (!Number.isFinite(precioNum) || precioNum <= 0) {
            throw new Error("El precio del pasaje debe ser un número mayor a 0.");
        }

        return true;
    }

    // --- Serialización para guardar en el backend ---
    toJSON() {
        return {
            placa: this._placa,
            linea: this._linea,
            tipo: this._tipo,
            activo: this._activo,
            destino: this._destino,
            precio: this._precio
        };
    }

    // --- Reconstrucción desde el backend ---
    static fromJSON(obj) {
        return new Cl_Auto({
            placa: obj.placa,
            linea: obj.linea,
            tipo: obj.tipo,
            activo: obj.activo,
            destino: obj.destino,
            precio: obj.precio
        });
    }
}