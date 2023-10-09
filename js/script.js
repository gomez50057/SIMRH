let arrow2 = document.querySelectorAll(".arrow, .arrowSub, .arrowSub2");
for (var i = 0; i < arrow2.length; i++) {
  arrow2[i].addEventListener("click", (e) => {
    let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
    arrowParent.classList.toggle("showMenu");
  });
}

// Agrega un evento de clic a un elemento con la clase "arrowSub"
document.querySelectorAll(".arrowSub").forEach(function (arrow) {
  arrow.addEventListener("click", function () {
    // Encuentra el elemento padre que contiene el menú desplegable
    var submenu = arrow.closest(".menu-dropdown").querySelector(".submenu-items");

    // Alterna la visibilidad del menú desplegable específico
    submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
  });
});


//Barra lateral esta cerrada por defecto  

// let sidebar = document.querySelector(".sidebar");
// let sidebarBtn = document.querySelector(".logo");
// let profileContent = document.querySelector(".profile-details");

// sidebarBtn.addEventListener("click", () => {
//   sidebar.classList.toggle("close");
// });

// profileContent.addEventListener("click", () => {
//   sidebar.classList.toggle("close");
// });



//Barra lateral esta abierta por defecto
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".logo-details");
let profileContent = document.querySelector(".profile-details");

sidebar.classList.remove("close");

sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});
profileContent.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});


// Obtén referencias a los checkboxes y la tabla de simbología
var checkboxes = [
  document.getElementById("chkPobAGEBZMP"),
  document.getElementById("chkPobAGEBHgo")
];

// Agrega checkboxes adicionales con nombres similares
for (var i = 1; i <= 12; i++) {
  var checkbox = document.getElementById("chkPobAGEBR" + (i < 10 ? "0" : "") + i);
  checkboxes.push(checkbox);
}

var legend = document.getElementById("legend");

// Agrega oyentes de cambio a los checkboxes
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", actualizarTablaLegend);
});

// Función para actualizar la visibilidad de la tabla
function actualizarTablaLegend() {
  // Verifica el estado de todos los checkboxes
  var mostrarTabla = checkboxes.some(function (checkbox) {
    return checkbox.checked;
  });

  // Muestra u oculta la tabla según la condición
  legend.style.display = mostrarTabla ? "block" : "none";
}




// Define una función para manejar la visibilidad de las tablas
function actualizarTabla(checkbox, tablaId) {
  var tabla = document.getElementById(tablaId);
  tabla.style.display = checkbox.checked ? 'block' : 'none';
}

// Obtén referencias a los checkboxes
var checkboxImgObj = document.getElementById('chkZMP_PDUyOT_ImgObj');
var checkboxZonP = document.getElementById('chkZMP_PDUyOT_ZonP');
var checkboxEtapaCrecimiento = document.getElementById('chkZMP_PDUyOT_EC');
var checkboxPoligonosActuacion = document.getElementById('chkZMP_PDUyOT_PA');


// Agrega oyentes de cambio a los checkboxes
checkboxImgObj.addEventListener('change', function () {
  actualizarTabla(checkboxImgObj, 'ImgObjetivo');
});
checkboxZonP.addEventListener('change', function () {
  actualizarTabla(checkboxZonP, 'ZonP');
});
checkboxEtapaCrecimiento.addEventListener('change', function () {
  actualizarTabla(checkboxEtapaCrecimiento, 'EtapaCrecimiento');
});
checkboxPoligonosActuacion.addEventListener('change', function () {
  actualizarTabla(checkboxPoligonosActuacion, 'PoligonosActuacion');
});


// Referencias a los nuevos checkboxes y tablas utilizando document.getElementById. Por ejemplo:
// var checkboxNuevaOpcion = document.getElementById('chkNuevaOpcion');
// var tablaNuevaOpcion = document.getElementById('TablaNuevaOpcion');


// Después, agrega un nuevo oyente de cambio para el nuevo checkbox.
// checkboxNuevaOpcion.addEventListener('change', function () {
//   actualizarTabla(checkboxNuevaOpcion, 'TablaNuevaOpcion');
// });
