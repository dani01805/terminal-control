// Cl_Persona.js
// Representa UN pasajero que aborda un bus del terminal.
// Atributos: cédula, nombre, apellido, teléfono, edad y placa del bus donde viaja.

export class Cl_Persona {
    constructor(cedula, nombre, apellido, telefono, edad, placa) {
        this._cedula = cedula;
        this._nombre = nombre;
        this._apellido = apellido;
        this._telefono = telefono;
        this._edad = edad;
        this._placa = placa; // bus en el que viaja
    }

    // --- Getters y Setters ---
    set cedula(v) { this._cedula = v; }
    get cedula() { return this._cedula; }

    set nombre(v) { this._nombre = v; }
    get nombre() { return this._nombre; }

    set apellido(v) { this._apellido = v; }
    get apellido() { return this._apellido; }

    set telefono(v) { this._telefono = v; }
    get telefono() { return this._telefono; }

    set edad(v) { this._edad = v; }
    get edad() { return this._edad; }

    set placa(v) { this._placa = v; }
    get placa() { return this._placa; }

    // --- Validación de esta instancia ---
    // Revisa que los campos tengan el formato correcto.
    // La unicidad de cédula por bus la maneja Cl_Terminal.
    validar() {
        const cedulaStr = String(this._cedula || "").trim();
        
        if (!/^\d{8}$/.test(cedulaStr)) {
            throw new Error("La cédula debe ser numérica y tener exactamente 8 dígitos.");
        }
        this._cedula = cedulaStr;

        if (!String(this._nombre || "").trim()) {
            throw new Error("El nombre es obligatorio.");
        }
        if (!String(this._apellido || "").trim()) {
            throw new Error("El apellido es obligatorio.");
        }
        if (!/^\d{10,11}$/.test(String(this._telefono || "").trim())) {
            throw new Error("El teléfono debe tener entre 10 y 11 dígitos.");
        }
        const edadNum = Number(this._edad);
        if (!Number.isInteger(edadNum) || edadNum <= 0 || edadNum > 120) {
            throw new Error("La edad debe ser un número válido entre 1 y 120.");
        }
        if (!String(this._placa || "").trim()) {
            throw new Error("Debe indicar la placa del bus en el que viaja el pasajero.");
        }

        return true;
    }

    // --- Serialización para guardar en el backend ---
    toJSON() {
        return {
            cedula: this._cedula,
            nombre: this._nombre,
            apellido: this._apellido,
            telefono: this._telefono,
            edad: this._edad,
            placa: this._placa
        };
    }

    // --- Reconstrucción desde el backend ---
    static fromJSON(obj) {
        return new Cl_Persona(
            obj.cedula,
            obj.nombre,
            obj.apellido,
            obj.telefono,
            obj.edad,
            obj.placa
        );
    }
}
