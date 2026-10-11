export class Cl_persona {
    constructor(cedula, nombre, apellido, telefono, edad) {
        this._cedula = cedula;
        this._nombre = nombre;
        this._apellido = apellido;
        this._telefono = telefono;
        this._edad = edad;
    }
    set cedula(cedula) {
        this._cedula = cedula;
    }
    get cedula() {
        return this._cedula;
    }
    set nombre(nombre) {
        this._nombre = nombre;
    }
    get nombre() {
        return this._nombre;
    }
    set apellido(apellido) {
        this._apellido = apellido;
    }
    get apellido() {
        return this._apellido;
    }
    set telefono(telefono) {
        this._telefono = telefono;
    }
    get telefono() {
        return this._telefono;
    }
    set edad(edad) {
        this._edad = edad;
    }
    get edad() {
        return this._edad;
    }
    // Método estático para validar cédula (puede llamarse antes de instanciar o dentro del registro)
    static validarCedula(cedula, pasajerosActuales = []) {
        // Limpiamos espacios y convertimos a string
        const cedulaStr = String(cedula || "").trim();

        // 1. Validar que no esté vacía y sea obligatoriamente numérica de 8 dígitos exactos
        if (!/^\d{8}$/.test(cedulaStr)) {
            throw new Error("La cédula debe ser numérica y tener exactamente 8 dígitos.");
        }

        // 2. Validar que no se repita en este mismo autobús/registro
        const repetida = pasajerosActuales.some(p => p.cedula === cedulaStr);
        if (repetida) {
            throw new Error("Ya existe un pasajero registrado con esta misma cédula en la unidad.");
        }

        return cedulaStr; // Retorna la cédula validada y limpia
    }
}
