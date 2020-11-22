class Printer {
    constructor(name, model, place, ip) {
        this._name = name;
        this._model = model;
        this._place = place;
        this._ip = ip;
    }

    get name() {
        return this._name;
    }

    get model() {
        return this._model;
    }

    get place() {
        return this._place;
    }

    get ip() {
        return this._ip;
    }
}

var printers = [
    new Printer("myprinter", "HP DJ 3630", "home", "192.168.1.3"),
    new Printer("Despacho", "HP ENVY 4530", "Work", "192.168.1.55"),
    new Printer("cargonto", "EPSON 3210", "Home", "192.168.20.3"),
]

var printerList;

function loadPrinterList() {
    printerList.innerHTML = "";

    printers.forEach(p => {
        printerList.innerHTML += "<tr>\n" +
            "              <th scope=\"row\">" + p._model + "</th>\n" +
            "              <td>" + p._name + "</td>\n" +
            "              <td>" + p._place + "</td>\n" +
            "              <td>" + p._ip + "</td>\n" +
            "              <td>" + 0 + "</td>\n" +
            "              <td>\n" +
            "                <img src=\"./img/edit.png\" onclick='TODO' />\n" +
            "                <img src=\"./img/delete.png\" onclick='TODO' />\n" +
            "                <img src=\"./img/informacion.png\" data-toggle=\"popover\" data-placement=\"bottom\" title=\"Lista de grupos\"\n" +
            "                  data-content=\"1-Trabajo<br /> 2-Casa\" data-html=\"true\" />\n" +
            "\n" +
            "              </td>\n" +
            "            </tr>";
        console.log(p);
    });
}

window.onload = function () {
    printerList = document.getElementById("printer_list");
    loadPrinterList();
}