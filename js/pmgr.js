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
              <td>${showGroupPrinters(printer.id)}</td>
              <td>${printer.status}</td>
              <td>
                <img src="./img/edit.png" onclick="editModalP(${printer.id})" />
                <img src="./img/delete.png" onclick="deleteRow(${printer.id})" />
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
                <img src="./img/edit.png" onclick="editModalG(${group.id})" />
                <img src="./img/delete.png" onclick="deleteRowg(${group.id})" />

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
                <img src="./img/delete.png" onclick="deleteWRow(${file.id})" />

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
function deleteRow(id) {
    let p = Pmgr.globalState.printers;
    let k=0;
    while(k < p.length && p[k].id != id) {
        k++;
    }
    if(k != p.length){
      p.splice(k, 1);
    }
    let  g = Pmgr.globalState.groups;
    for(let i =0; i < g.length; ++i){
        let j= 0;
        while(j <g[i].printers.length && g[i].printers[j] != id){
           j++;
        }
        if(j != g[i].printers.length) {
            g[i].printers.splice(j,1);
        }
    }

    let  f = Pmgr.globalState.jobs;
    for(let i =0; i < f.length; ++i){
        if(f[i].printer == id){
           f.splice(i,1);
           i--;
        }
    }
    reloadPrinters();
    reloadGroups();
    reloadFiles();
}

//script para eliminar una fila de grupos
function deleteRowg(id) {
    let g = Pmgr.globalState.groups;
    let k=0;
    while(k < g.length && g[k].id != id) {
        k++;
    }
    if(k != g.length){
      g.splice(k, 1);
    }
    reloadGroups();
    reloadPrinters();
}


//script para eliminar una fila de trabajos pendientes
function deleteWRow(id) {
    let f = Pmgr.globalState.jobs;
    let k=0;
    while(k < f.length && f[k].id != id) {
        k++;
    }
    if(k != f.length){
      f.splice(k, 1);
    }
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

function addPrinterToGroup(){
    let impresora = $( "#printers option:selected" ).text();
    if(impresora == "Impresoras...") impresora = $( "#printersg option:selected" ).text();
    let grupo = $( "#groups option:selected" ).text();
    if(grupo == "Grupos...") grupo = $( "#groupsg option:selected" ).text();
    let  g = Pmgr.globalState.groups;
    let p = Pmgr.globalState.printers;
    let x =0, y =0;
    while(x < g.length && g[x].name != grupo){
        x++;
    }
    while(y < p.length && p[y].alias != impresora){
        y++;
    }

    let i=0;
    while(g[x].printers[i] != p[y].id && i < g[x].printers.length){
        i++;
    }
    if(i == g[x].printers.length){
    g[x].printers.push(p[y].id);
    alert("Se ha vinculado la impresora " + impresora + " del grupo " + grupo );
    }
    else alert("No se ha vinculado la impresora");

    reloadGroups();
    reloadPrinters();

}
function delPrinterToGroup(){
    let impresora = $( "#printers option:selected" ).text();
    if(impresora == "Impresoras...") impresora = $( "#printersg option:selected" ).text();
    let grupo = $( "#groups option:selected" ).text();
    if(grupo == "Grupos...") grupo = $( "#groupsg option:selected" ).text();
    let  g = Pmgr.globalState.groups;
    let p = Pmgr.globalState.printers;
    let x =0, y =0;
    while(x < g.length && g[x].name != grupo){
        x++;
    }
    while(y < p.length && p[y].alias != impresora){
        y++;
    }
    let i=0;
    while(g[x].printers[i] != p[y].id && i < g[x].printers.length){
        i++;
    }
    if(i < g[x].printers.length){
        g[x].printers.splice(i, 1);
        alert("Se ha desvinculado la impresora " + impresora + " del grupo " + grupo );
    }
    else alert("No se ha desvinculado la impresora");
    
    reloadGroups();
    reloadPrinters();

}

function showGroupPrinters(printerId){
    let resultado= "| ";
    let  g = Pmgr.globalState.groups;
    for(let i =0; i < g.length; ++i){
        for(let j=0; j < g[i].printers.length; ++j){
            if(g[i].printers[j] == printerId)
                resultado += g[i].name + " | ";
        }
    }
    return resultado;
}

let idP;

function editModalP(idPrinter){
    $('#editModalP').modal('show');
    idP = idPrinter;
}
function editPrinter(){
    let p = Pmgr.globalState.printers;
    let y =0;
    while(y < p.length && p[y].id != idP){
        y++;
    }

    if( document.getElementById('aliasEdit').value != "")
        p[y].alias =  document.getElementById('aliasEdit').value;
    if(document.getElementById('lugarEdit').value != "")
        p[y].location = document.getElementById('lugarEdit').value;
    if(document.getElementById('ipEdit').value != "")
        p[y].ip = document.getElementById('ipEdit').value;

    reloadPrinters();
}

let idG= idP+1;

function editModalG(idGroup){
    $('#editModalG').modal('show');
    idG = idGroup;
}
function editGroup(){
    let g = Pmgr.globalState.groups;
    let y =0;
    while(y < g.length && g[y].id != idG){
        y++;
    }

    if( document.getElementById('nameEdit').value != "")
        g[y].name =  document.getElementById('nameEdit').value;

    reloadGroups();
    reloadPrinters();
}

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
window.addPrinterToGroup = addPrinterToGroup;
window.delPrinterToGroup = delPrinterToGroup;
window.editModalP = editModalP;
window.editPrinter = editPrinter;
window.editModalG = editModalG;
window.editGroup = editGroup;