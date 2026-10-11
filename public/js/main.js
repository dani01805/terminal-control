import { Cl_terminal } from './modelos/Cl_terminal.js';
import { Cl_vTerminal } from './vistas/Cl_vTerminal.js';
import { Cl_cTerminal } from './controladores/Cl_cTerminal.js';

document.addEventListener("DOMContentLoaded", () => {
    const modelo = new Cl_terminal();
    const vista = new Cl_vTerminal();
    const controlador = new Cl_cTerminal(modelo, vista);
});