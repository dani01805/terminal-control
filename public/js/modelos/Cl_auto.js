export  class Cl_auto {
    constructor({placa, linea, tipo, activo = true, destino, precio}){
        this._placa = placa;
        this._linea = linea;
        this._tipo = tipo;
        this._activo = activo;
        this._destino = destino;
        this._precio = precio;
    }
    set placa(placa) {
        this._placa = placa;
    }   
    get placa() {
        return this._placa;
    }   
    set linea(linea) {
        this._linea = linea;
    }       
    get linea() {
        return this._linea;
    }
    set tipo(tipo) {
        this._tipo = tipo;
    }
    get tipo() {
        return this._tipo;
    }   
    set activo(activo) {
        this._activo = Boolean(activo);
    }           
    get activo() {
        return this._activo;
    }
    set destino(destino) {
        this._destino = destino;
    }   
    get destino() {
        return this._destino;
    }
    set precio(precio) {
        this._precio = Number(precio);
    }   
    get precio() {   
        return this._precio;
    }

}