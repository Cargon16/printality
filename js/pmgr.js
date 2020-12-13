"use strict"

import * as Pmgr from './pmgrapi.js'
import {
    Printer,
    PrinterStates,
    Group,
    Job
} from "./pmgrapi.js";


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
        `<span class="badge badge-dark">${id}</span>`
    ).join(" ");
    let allGroups = showGroupPrinters(printer.id).map((name) =>
        `<span class="badge badge-info">${name}</span>`
    ).join(" ");

    return `
            <tr>
              <th scope="row">${printer.alias}</th>
              <td>${printer.model}</td>
              <td>${printer.location}</td>
              <td>${printer.ip}</td>
              <td>${allJobs}</td>
              <td>${allGroups}</td>
              <td><span class="badge badge-pill ${pillClass[printer.status.toLowerCase()]}">${printer.status}</span></td>
              <td>
                <img src="./img/edit.png" onclick="editModalP(${printer.id})" />
                <img src="./img/delete.png" onclick="deleteRow(${printer.id})" />
              </td>
            </tr>
 `;
}
/*
  function createPrinterItem(printer) {
  const rid = 'x_' + Math.floor(Math.random()*1000000);
  const hid = 'h_'+rid;
  const cid = 'c_'+rid;

  // usar [] en las claves las evalua (ver https://stackoverflow.com/a/19837961/15472)
  const PS = Pmgr.PrinterStates;
  let pillClass = { [PS.PAUSED] : "badge-secondary",
                    [PS.PRINTING] : "badge-success",
                    [PS.NO_INK] : "badge-danger",
                    [PS.NO_PAPER] : "badge-danger" };

  let allJobs = printer.queue.map((id) =>
     `<span class="badge badge-secondary">${id}</span>`
  ).join(" ");

  return `
    <div class="card">
    <div class="card-header" id="${hid}">
        <h4 class="mb-0">
            ${printer.alias}
        </h4>
        <span class="badge badge-pill ${pillClass[printer.status.toLowerCase()]}">${printer.status}</span>
    </div>
    <div>
        <div class="card-body pcard">
            ${printer.model} at ${printer.location}
            <hr>
            ${allJobs}
        </div>
    </div>
    </div>
 `;
}
 */


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
    let allPrinters = group.printers.map((id) =>
        `<span class="badge badge-secondary">${Pmgr.resolve(id).alias}</span>`
    ).join(" ");

    return `
            <tr>
              <th scope="row">${group.name}</th>
              <td>${allPrinters}</td>
              <td>
                <img src="./img/edit.png" onclick="editModalG(${group.id})" />
                <img src="./img/delete.png" onclick="deleteRowg(${group.id})" />

              </td>
            </tr>
 `;
}
/*
function createGroupItem(group) {
  let allPrinters = group.printers.map((id) =>
     `<span class="badge badge-secondary">${Pmgr.resolve(id).alias}</span>`
  ).join(" ");
 return `
    <div class="card">
    <div class="card-header">
        <h4 class="mb-0">
            <b class="pcard">${group.name}</b>
        </h4>
    </div>
    <div class="card-body pcard">
        ${allPrinters}
    </div>
    </div>
`;
}
*/

function createJobItem(file, position) {
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
/*
function createJobItem(job) {
 return `
    <div class="card">
    <div class="card-header">
        <h4 class="mb-0">
            <b class="pcard">${job.fileName}</b>
        </h4>
    </div>
    <div class="card-body pcard">
        ${job.owner} @${Pmgr.resolve(job.printer).alias}
    </div>
    </div>
`;
}
*/

let view = '#impresoras';
function buscar() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search1");
    filter = input.value.toUpperCase();
    if( view == '#impresoras') {
        table = document.getElementById("myTable");
        
    }
    else if( view == '#grupos') {
        table = document.getElementById("myTable1");
        
    }
    else if( view == '#documentos') {
        table = document.getElementById('myWorks');
    }
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("th")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function getJobsFromPrinter(printer) {
    let works = [];

    Pmgr.globalState.jobs.forEach(j => {
        if (j.printer == printer.id) works.push(j);
    });

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
                    <option value= "${i}" >${array[i]}</option>
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
                    <option value= "${i}" >${array[i]}</option>
            `;
        };
    }
    return html;
}



function update(result) {
    try {
        // vaciamos los contenedores
        $("#printer_list").empty();
        $("#group_list").empty();
        $("#files_list").empty();
        // y los volvemos a rellenar con su nuevo contenido
        Pmgr.globalState.printers.forEach(m => $("#printer_list").append(createPrinterItem(m)));
        Pmgr.globalState.groups.forEach(m => $("#group_list").append(createGroupItem(m)));
        Pmgr.globalState.jobs.forEach(m => $("#files_list").append(createJobItem(m)));

        //selects vista impresora
        $("#printers").empty();
        $("#printers").append(getPrinters());
        $("#groups").empty();
        $("#groups").append(getGroups());

        //selects vista grupos
        $("#printersg").empty();
        $("#printersg").append(getPrinters());
        $("#groupsg").empty();
        $("#groupsg").append(getGroups());

        //Selects de imprimir
        //$("#printersg").empty();
        $("#pepito").html(getPrinters());


    } catch (e) {
        console.log('Error actualizando', e);
    }


}


//
// PARTE 2:
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
// Generalmente de la forma $("selector").cosaQueSucede(...)
//
$(function () {
    // Servidor a utilizar. También puedes lanzar tú el tuyo en local (instrucciones en Github)
    const serverUrl = "http://gin.fdi.ucm.es:3128/api/";
    Pmgr.connect(serverUrl);

    // ejemplo de login
    Pmgr.login("g9", "Grupo_09IU").then(d => {
        if (d !== undefined) {
            console.log("login ok!");
            update();
        } else {
            console.log(`error en login (revisa la URL: ${serverUrl}, y verifica que está vivo)`);
            console.log("Generando datos de ejemplo para uso en local...")

            Pmgr.populate();
            update();
        }
    });
});

//Función para ocultar/mostrar las distintas vistas
function ocultar(parent, ajeno, ajeno2) {
    view = parent;
    let msg = parent.slice(1, parent.length);
    $('#search1').attr('placeholder', "Buscar " + msg + "...")
    $(ajeno).hide();
    $(ajeno2).hide();
    $(parent).show();
}

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

    $('.menu').click(function (e) {
        if (e.target.matches("img")) {
            $('.imgmenu').css('backgroundColor', '#acbed4');
            $(e.target).css('backgroundColor', '#718fb3');
        }
    });

    /* Seleccionado impresoras por defecto*/
    $('#i').css('backgroundColor', '#718fb3');


    $('#printers').on('change', function () {
        updateAddOrDeleteButtons();
    });

    $('#groups').on('change', function () {
        updateAddOrDeleteButtons();
    });

    $('#printersg').on('change', function () {
        updateAddOrDeleteGButtons();
    });

    $('#groupsg').on('change', function () {
        updateAddOrDeleteGButtons();
    });
    
});

$(function () {
    $('[data-toggle="popover"]').popover()
})

//script para eliminar una fila nueva a las impresoras
function deleteRow(id) {
    Pmgr.rmPrinter(id).then(update);
}

//script para eliminar una fila de grupos
function deleteRowg(id) {
    Pmgr.rmGroup(id).then(update);
}

//script para eliminar una fila de trabajos pendientes
function deleteWRow(id) {
    Pmgr.rmJob(id).then(update);
}

function checkPrinterModelo(id) {
    let regExp = /^.+$/;

    if (!regExp.test(document.getElementById(id).value)) {
        document.getElementById(id).value = "";
        $(document.getElementById(id)).addClass("is-invalid");
        return false;
    }

    return true;
}

function checkPrinterAlias(id) {
    let regExp = /^.+$/;

    if (!regExp.test(document.getElementById(id).value)) {
        document.getElementById(id).value = "";
        $(document.getElementById(id)).addClass("is-invalid");
        return false;
    }

    return true;
}

function checkPrinterLugar(id) {
    let regExp = /^.+$/;

    if (!regExp.test(document.getElementById(id).value)) {
        document.getElementById(id).value = "";
        $(document.getElementById(id)).addClass("is-invalid");
        return false;
    }

    return true;
}

function checkPrinterIP(id) {
    let regExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/;

    if (!regExp.test(document.getElementById(id).value)) {
        document.getElementById(id).value = "";
        $(document.getElementById(id)).addClass("is-invalid");
        return false;
    }

    return true;
}

//Añadir una nueva impresora
function addRow() {
    if (checkPrinterModelo('modelo') && checkPrinterAlias('alias') && checkPrinterLugar('lugar') && checkPrinterIP('ip')) {
        $('#exampleModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        Pmgr.addPrinter(
            new Printer(
                Pmgr.globalState.printers.length,
                document.getElementById('alias').value,
                document.getElementById('modelo').value,
                document.getElementById('lugar').value,
                document.getElementById('ip').value,
                [],
                PrinterStates.NO_INK
            )
        ).then(update);
    }
}

function checkGroupName(id) {
    let regExp = /^.+$/;

    if (!regExp.test(document.getElementById(id).value)) {
        document.getElementById(id).value = "";
        $(document.getElementById(id)).addClass("is-invalid");
        return false;
    }

    return true;
}

//Añadir un nuevo grupo
function addRowGr() {
    if (checkGroupName('nameg')) {
        $('#exampleModalGr').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        Pmgr.addGroup(
            new Group(
                Pmgr.globalState.groups.length,
                document.getElementById('nameg').value,
                []
            )
        ).then(update);
    }
}

function addFile() {
    let impresora = $("#pepito option:selected").text();
    let p = Pmgr.globalState.printers;
    let y = 0;
    while (y < p.length && p[y].alias != impresora) {
        y++;
    }
   let file = document.getElementById('namefile').files[0].name;

    Pmgr.addJob(
        new Job(
            Pmgr.globalState.jobs.length,
            p[y].id,
            "grupo09",
            file
        )
    ).then(update);
}

//Vincular una impresora a un grupo
function addPrinterToGroup() {
    let impresora = $("#printers option:selected").text();
    if (impresora == "Impresoras...") impresora = $("#printersg option:selected").text();
    let grupo = $("#groups option:selected").text();
    if (grupo == "Grupos...") grupo = $("#groupsg option:selected").text();
    let g = Pmgr.globalState.groups;
    let p = Pmgr.globalState.printers;
    let x = 0,
        y = 0;
    while (x < g.length && g[x].name != grupo) {
        x++;
    }
    while (y < p.length && p[y].alias != impresora) {
        y++;
    }

    let i = 0;
    while (g[x].printers[i] != p[y].id && i < g[x].printers.length) {
        i++;
    }
    if (i == g[x].printers.length) {
        g[x].printers.push(p[y].id);
       // alert("Se ha vinculado la impresora " + impresora + " del grupo " + grupo);
    } else alert("No se ha vinculado la impresora");
    Pmgr.setPrinter(p[y]);
    Pmgr.setGroup(g[x]);
    update();

}

//Desvincular una impresora de un grupo
function delPrinterToGroup() {
    let impresora = $("#printers option:selected").text();
    if (impresora == "Impresoras...") impresora = $("#printersg option:selected").text();
    let grupo = $("#groups option:selected").text();
    if (grupo == "Grupos...") grupo = $("#groupsg option:selected").text();
    let g = Pmgr.globalState.groups;
    let p = Pmgr.globalState.printers;
    let x = 0,
        y = 0;
    while (x < g.length && g[x].name != grupo) {
        x++;
    }
    while (y < p.length && p[y].alias != impresora) {
        y++;
    }
    let i = 0;
    while (g[x].printers[i] != p[y].id && i < g[x].printers.length) {
        i++;
    }
    if (i < g[x].printers.length) {
        g[x].printers.splice(i, 1);
        //alert("Se ha desvinculado la impresora " + impresora + " del grupo " + grupo);
    } else alert("No se ha desvinculado la impresora");

    Pmgr.setPrinter(p[y]);
    Pmgr.setGroup(g[x]);
    update();

}

function updateAddOrDeleteButtons() {
    let printerSelected = $('#printers').val();
    let groupSelected = $('#groups').val();

    if (!isNaN(printerSelected) && !isNaN(groupSelected)) {
        let group = Pmgr.globalState.groups[groupSelected];
        let printer = Pmgr.globalState.printers[printerSelected];

        if (group.printers.indexOf(printer.id) == -1) {
            $('#submit_v').prop("disabled", false);
            $('#submit_v').addClass("submit_v");
            $('#submit_d').prop("disabled", true);
            $('#submit_d').removeClass("submit_d");
        } else {
            $('#submit_v').prop("disabled", true);
            $('#submit_v').removeClass("submit_v");
            $('#submit_d').prop("disabled", false);
            $('#submit_d').addClass("submit_d");
        }
    } else {
        $('#submit_v').prop("disabled", false);
        $('#submit_v').addClass("submit_v");
        $('#submit_d').prop("disabled", false);
        $('#submit_d').addClass("submit_d");
    }
}
$('#editModalP').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
    $('#ipEdit').removeClass("is-invalid");
});
$('#exampleModal').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
    $('#modelo').removeClass("is-invalid");
    $('#alias').removeClass("is-invalid");
    $('#lugar').removeClass("is-invalid");
    $('#ip').removeClass("is-invalid");
});
$('#exampleModalGr').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
    $('#nameg').removeClass("is-invalid");
});
$('#editModalG').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
    $('#nameEdit').removeClass("is-invalid");
});

function updateAddOrDeleteGButtons() {
    let printerSelected = $('#printersg').val();
    let groupSelected = $('#groupsg').val();

    if (!isNaN(printerSelected) && !isNaN(groupSelected)) {
        let group = Pmgr.globalState.groups[groupSelected];
        let printer = Pmgr.globalState.printers[printerSelected];

        if (group.printers.indexOf(printer.id) == -1) {
            $('#submit_vg').prop("disabled", false);
            $('#submit_vg').addClass("submit_v");
            $('#submit_dg').prop("disabled", true);
            $('#submit_dg').removeClass("submit_d");
        } else {
            $('#submit_vg').prop("disabled", true);
            $('#submit_vg').removeClass("submit_v");
            $('#submit_dg').prop("disabled", false);
            $('#submit_dg').addClass("submit_d");
        }
    } else {
        $('#submit_vg').prop("disabled", false);
        $('#submit_vg').addClass("submit_v");
        $('#submit_dg').prop("disabled", false);
        $('#submit_dg').addClass("submit_d");
    }
}

function showGroupPrinters(printerId) {
    let resultado = [];
    let g = Pmgr.globalState.groups;
    for (let i = 0; i < g.length; ++i) {
        for (let j = 0; j < g[i].printers.length; ++j) {
            if (g[i].printers[j] == printerId)
                resultado.push(g[i].name);
        }
    }
    return resultado;
}

let idP;

function editModalP(idPrinter) {
    $('#editModalP').modal('show');
    idP = idPrinter;
}

function editPrinter() {
    //if (checkPrinterAlias('aliasEdit') && checkPrinterLugar('lugarEdit') && checkPrinterIP('ipEdit')) {
       
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        let p = Pmgr.globalState.printers;
        let y = 0;
        while (y < p.length && p[y].id != idP) {
            y++;
        }

        if (document.getElementById('aliasEdit').value != "") {
            if(checkPrinterAlias('aliasEdit')) {
                $('#editModalP').modal('hide');
                p[y].alias = document.getElementById('aliasEdit').value;
            }
        }
        if (document.getElementById('lugarEdit').value != "") {
         if(checkPrinterLugar('lugarEdit')) {
            $('#editModalP').modal('hide');
                p[y].location = document.getElementById('lugarEdit').value;
            }
        }
        if (document.getElementById('ipEdit').value != ""){
            if(checkPrinterIP('ipEdit')) {
                $('#editModalP').modal('hide');
                p[y].ip = document.getElementById('ipEdit').value;
            }
        }

        Pmgr.setPrinter(p[y]);
        update();
    //}
}

let idG = idP + 1;

function editModalG(idGroup) {
    $('#editModalG').modal('show');
    idG = idGroup;
}

function editGroup() {
    if (checkGroupName('nameEdit')) {
        $('#editModalG').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        let g = Pmgr.globalState.groups;
        let y = 0;
        while (y < g.length && g[y].id != idG) {
            y++;
        }

        if (document.getElementById('nameEdit').value != "")
            g[y].name = document.getElementById('nameEdit').value;

        Pmgr.setGroup(g[y]);
        update();
    }
}
function getView() {
    return view;
}

// cosas que exponemos para usarlas desde la consola
/*window.populate = populate;*/
window.Pmgr = Pmgr;
window.getView = getView;
window.createPrinterItem = createPrinterItem;
window.createGroupItem = createGroupItem;
window.createJobItem = createJobItem;
window.ocultar = ocultar;
window.deleteRow = deleteRow;
window.deleteRowg = deleteRowg;
window.deleteWRow = deleteWRow
window.addRow = addRow;
window.addRowGr = addRowGr;
window.addFile = addFile;
window.getPrinters = getPrinters;
window.getGroups = getGroups;
window.addPrinterToGroup = addPrinterToGroup;
window.delPrinterToGroup = delPrinterToGroup;
window.editModalP = editModalP;
window.editPrinter = editPrinter;
window.editModalG = editModalG;
window.editGroup = editGroup;
window.buscar = buscar;