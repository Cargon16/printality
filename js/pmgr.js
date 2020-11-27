"use strict"

import * as Pmgr from './pmgrapi.js'
import { Printer, PrinterStates } from "./pmgrapi.js";
import { Group } from "./pmgrapi.js";

/**
 * Librería de cliente para interaccionar con el servidor de PrinterManager (prmgr).
 * Prácticas de IU 2020-21
 *
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas. Recomiendo separar el fichero en 2 partes:
 * - funciones que pueden generar cachos de contenido a partir del modelo, pero que no
 *   tienen referencias directas a la página
 * - un bloque rodeado de $(() => { y } donde está el código de pegamento que asocia comportamientos
 *   de la parte anterior con elementos de la página.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él, que es esencialmente
 * lo que quieras siempre y cuando no digas que lo escribiste tú o me persigas por haberlo escrito mal.
 */

//
// PARTE 1:
// Código de comportamiento, que sólo se llama desde consola (para probarlo) o desde la parte 2,
// en respuesta a algún evento.
//

function createPrinterItem(printer, position) {
    const rid = 'x_' + Math.floor(Math.random() * 1000000);
    const hid = 'h_' + rid;
    const cid = 'c_' + rid;

    // usar [] en las claves las evalua (ver https://stackoverflow.com/a/19837961/15472)
    const PS = Pmgr.PrinterStates;
    let pillClass = {
        [PS.PAUSED]: "badge-secondary",
        [PS.PRINTING]: "badge-success",
        [PS.NO_INK]: "badge-danger",
        [PS.NO_PAPER]: "badge-danger"
    };

    let allJobs = printer.queue.map((id) =>
        `<span class="badge badge-secondary">${id}</span>`
    ).join(" ");

    return `
            <tr>
              <th scope="row">${printer.alias}</th>
              <td>${printer.model}</td>
              <td>${printer.location}</td>
              <td>${printer.ip}</td>
              <td>${getJobsFromPrinter(printer).length}</td>
              <td>${printer.status}</td>
              <td>
                <img src="./img/edit.png" onclick=TODO />
                <img src="./img/delete.png" onclick="deleteRow(${position})" />
              </td>
            </tr>
 `;
}

function createGroupItem(group, position) {
    const rid = 'x_' + Math.floor(Math.random() * 1000000);
    const hid = 'h_' + rid;
    const cid = 'c_' + rid;

    // usar [] en las claves las evalua (ver https://stackoverflow.com/a/19837961/15472)
    /* const PS = Pmgr.PrinterStates;
     let pillClass = {
         [PS.PAUSED]: "badge-secondary",
         [PS.PRINTING]: "badge-success",
         [PS.NO_INK]: "badge-danger",
         [PS.NO_PAPER]: "badge-danger"
     };
 
     let allJobs = group.queue.map((id) =>
         `<span class="badge badge-secondary">${id}</span>`
     ).join(" ");*/

    return `
            <tr>
              <th scope="row">${group.name}</th>
              <td>${group.printers.length}</td>
              <td>
                <img src="./img/edit.png" onclick=TODO />
                <img src="./img/delete.png" onclick="deleteRowg(${position})" />

              </td>
            </tr>
 `;
}
function createFilesItem(file, position) {
    const rid = 'x_' + Math.floor(Math.random() * 1000000);
    const hid = 'h_' + rid;
    const cid = 'c_' + rid;

    // usar [] en las claves las evalua (ver https://stackoverflow.com/a/19837961/15472)
    /* const PS = Pmgr.PrinterStates;
     let pillClass = {
         [PS.PAUSED]: "badge-secondary",
         [PS.PRINTING]: "badge-success",
         [PS.NO_INK]: "badge-danger",
         [PS.NO_PAPER]: "badge-danger"
     };
 
     let allJobs = group.queue.map((id) =>
         `<span class="badge badge-secondary">${id}</span>`
     ).join(" ");*/

    return `
            <tr>
            <th scope="row">${file.id}</th>
            <th scope="row">${file.printer}</th>
            <th scope="row">${file.owner}</th>
              <th scope="row">${file.fileName}</th>
              <td>
                <img src="./img/edit.png" onclick=TODO />
                <img src="./img/delete.png" onclick="deleteWRow(${position})" />

              </td>
            </tr>
 `;
}
function getJobsFromPrinter(printer) {
    let works = [];

    Pmgr.globalState.jobs.forEach(j => { if (j.printer == printer.id) works.push(j) });

    return works;
}
//Array de los alias de las impresoras generadas.
function getNamePrinters() {
    let p = [];
    Pmgr.globalState.printers.forEach(printer => p.push(printer.alias));
    return p;
}

//generar las opciones de impresoras del select
function getPrinters() {
    let html = "<option>Impresoras...</option>";
    let array = getNamePrinters();
    if (array != null) {
        let tam = array.length;
        for (let i = 0; i < tam; i++) {
            html += `
                    <option value= "${array[i]}" >${array[i]}</option>
            `;
        };
    }
    return html;
}
//Array de los alias de los grupos generados.
function getNameGroups() {
    let g = [];
    Pmgr.globalState.groups.forEach(group => g.push(group.name));
    return g;
}

//generar las opciones de impresoras del select
function getGroups() {
    let html = "<option>Grupos...</option>";
    let array = getNameGroups();
    if (array != null) {
        let tam = array.length;
        for (let i = 0; i < tam; i++) {
            html += `
                    <option value= "${array[i]}" >${array[i]}</option>
            `;
        };
    }
    return html;
}

// funcion para generar datos de ejemplo: impresoras, grupos, trabajos, ...
// se puede no-usar, o modificar libremente
async function populate(minPrinters, maxPrinters, minGroups, maxGroups, jobCount) {
    const U = Pmgr.Util;

    // genera datos de ejemplo
    minPrinters = minPrinters || 10;
    maxPrinters = maxPrinters || 20;
    minGroups = minGroups || 1;
    maxGroups = maxGroups || 3;
    jobCount = jobCount || 100;
    let lastId = 0;

    let printers = U.fill(U.randomInRange(minPrinters, maxPrinters),
        () => U.randomPrinter(lastId++));

    let groups = U.fill(U.randomInRange(minPrinters, maxPrinters),
        () => U.randomGroup(lastId++, printers, 50));

    let jobs = [];
    for (let i = 0; i < jobCount; i++) {
        let p = U.randomChoice(printers);
        let j = new Pmgr.Job(lastId++,
            p.id,
            [
                U.randomChoice([
                    "Alice", "Bob", "Carol", "Daryl", "Eduardo", "Facundo", "Gloria", "Humberto"]),
                U.randomChoice([
                    "Fernández", "García", "Pérez", "Giménez", "Hervás", "Haya", "McEnroe"]),
                U.randomChoice([
                    "López", "Gutiérrez", "Pérez", "del Oso", "Anzúa", "Báñez", "Harris"]),
            ].join(" "),
            U.randomString() + ".pdf");
        p.queue.push(j.id);
        jobs.push(j);
    }

    if (Pmgr.globalState.token) {
        console.log("Updating server with all-new data");

        // FIXME: remove old data
        // FIXME: prepare update-tasks
        let tasks = [];
        for (let t of tasks) {
            try {
                console.log("Starting a task ...");
                await t().then(console.log("task finished!"));
            } catch (e) {
                console.log("ABORTED DUE TO ", e);
            }
        }
    } else {
        console.log("Local update - not connected to server");
        Pmgr.updateState({
            jobs: jobs,
            printers: printers,
            groups: groups
        });
    }
}

//
// PARTE 2:
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
// Generalmente de la forma $("selector").cosaQueSucede(...)
//
$(function () {

    // funcion de actualización de ejemplo. Llámala para refrescar interfaz
    function update(result) {
        reloadPrinters();
        reloadGroups();
        reloadFiles();
    }


    // Servidor a utilizar. También puedes lanzar tú el tuyo en local (instrucciones en Github)
    const serverUrl = "http://localhost:8080/api/";
    Pmgr.connect(serverUrl);

    // ejemplo de login
    Pmgr.login("HDY0IQ", "cMbwKQ").then(d => {
        if (d !== undefined) {
            const u = Gb.resolve("HDY0IQ");
            console.log("login ok!", u);
        } else {
            console.log(`error en login (revisa la URL: ${serverUrl}, y verifica que está vivo)`);
            console.log("Generando datos de ejemplo para uso en local...")

            populate();
            update();
        }
    });
});

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
});

//Función para ocultar/mostrar las distintas vistas
function ocultar(parent, ajeno, ajeno2) {
    $(ajeno).hide();
    $(ajeno2).hide();
    $(parent).show();
}

$(document).ready(function () {
    $('.menu').click(function (e) {
        if (e.target.matches("img")) {
            $('.imgmenu').css('backgroundColor', '#acbed4');
            $(e.target).css('backgroundColor', '#718fb3');
        }
    });

    /* Seleccionado impresoras por defecto*/
    $('#i').css('backgroundColor', '#718fb3');
});

$(function () {
    $('[data-toggle="popover"]').popover()
})

//script para eliminar una fila nueva a las impresoras
function deleteRow(row) {
    Pmgr.globalState.printers.splice(row, 1);
    reloadPrinters();
}

//script para eliminar una fila de grupos
function deleteRowg(row) {
    Pmgr.globalState.groups.splice(row, 1);
    reloadGroups();
}


//script para eliminar una fila de trabajos pendientes
function deleteWRow(row) {
    Pmgr.globalState.jobs.splice(row, 1);
    reloadFiles();
}

//script para añadir una fila nueva a las impresoras
function addRow() {
    Pmgr.globalState.printers.push(
        new Printer(
            Pmgr.globalState.printers.length,
            document.getElementById('alias').value,
            document.getElementById('modelo').value,
            document.getElementById('lugar').value,
            document.getElementById('ip').value,
            null,
            PrinterStates.NO_INK
        )
    );

    reloadPrinters();
}

function reloadPrinters() {
    try {
        // vaciamos un contenedor
        $("#printer_list").empty();
        // y lo volvemos a rellenar con su nuevo contenido
        Pmgr.globalState.printers.forEach(m => $("#printer_list").append(createPrinterItem(m, Pmgr.globalState.printers.indexOf(m))));
        // y asi para cada cosa que pueda haber cambiado
        $("#printers").empty();
        $("#printers").append(getPrinters());
        $("#groups").empty();
        $("#groups").append(getGroups());
    } catch (e) {
        console.log('Error actualizando', e);
    }
}
function reloadFilesCosas() {
    //$("#printersg").empty();
    $("#pepito").html(getPrinters());
    // $("#groupsg").empty();
    $("#jorgito").html(getGroups());
}
function reloadGroups() {
    try {
        // vaciamos un contenedor
        $("#group_list").empty();
        // y lo volvemos a rellenar con su nuevo contenido
        Pmgr.globalState.groups.forEach(m => $("#group_list").append(createGroupItem(m, Pmgr.globalState.groups.indexOf(m))));
        // y asi para cada cosa que pueda haber cambiado
        $("#printersg").empty();
        $("#printersg").append(getPrinters());
        $("#groupsg").empty();
        $("#groupsg").append(getGroups());
    } catch (e) {
        console.log('Error actualizando', e);
    }
}

function reloadFiles() {
    try {
        // vaciamos un contenedor
        $("#files_list").empty();
        // y lo volvemos a rellenar con su nuevo contenido
        Pmgr.globalState.jobs.forEach(m => $("#files_list").append(createFilesItem(m, Pmgr.globalState.jobs.indexOf(m))));
        // y asi para cada cosa que pueda haber cambiado

    } catch (e) {
        console.log('Error actualizando', e);
    }
}

function addRowGr() {
    //TODO en implementación js
    Pmgr.globalState.groups.push(
        new Group(
            Pmgr.globalState.groups.length,
            document.getElementById('nameg').value,
            null,
        )
    );

    reloadGroups();
}


$(document).ready(function () { 
    $('#trabajos').on('show.bs.modal', function (e) {
          reloadFilesCosas();
     });
});

// cosas que exponemos para usarlas desde la consola
window.populate = populate;
window.Pmgr = Pmgr;
window.createPrinterItem = createPrinterItem;
window.createGroupItem = createGroupItem;
window.createFilesItem = createFilesItem;
window.ocultar = ocultar;
window.deleteRow = deleteRow;
window.deleteRowg = deleteRowg;
window.deleteWRow = deleteWRow
window.addRow = addRow;
window.addRowGr = addRowGr;
window.getPrinters = getPrinters;
window.getGroups = getGroups;
window.reloadFilesCosas = reloadFilesCosas;