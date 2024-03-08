let arrow2 = document.querySelectorAll(".arrow, .arrowSub, .link_name");
for (var i = 0; i < arrow2.length; i++) {
  arrow2[i].addEventListener("click", (e) => {
    let arrowParent = e.target.parentElement.parentElement;
    arrowParent.classList.toggle("showMenu");
  });
}

// Agrega un evento de click a un elemento con la clase "arrowSub"
document.querySelectorAll(".arrowSub").forEach(function (arrow) {
  arrow.addEventListener("click", function () {
    // Encuentra el elemento padre que contiene el menú desplegable
    var submenu = arrow.closest(".menu-dropdown").querySelector(".submenu-items");
    // Alterna la visibilidad del menú desplegable específico
    submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
  });
});


// Función para verificar y cerrar la barra lateral si la pantalla es menor a 500px de ancho //
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".logo-details");
let profileContent = document.querySelector(".profile-content");
function checkScreenWidth() {
  if (window.innerWidth < 500) {
    sidebar.classList.add("close");
  } else {
    sidebar.classList.remove("close");
  }
}

// Verificar el ancho de la pantalla al cargar la página
checkScreenWidth();
// Verificar el ancho de la pantalla cada vez que cambie el tamaño de la ventana
window.addEventListener("resize", () => {
  checkScreenWidth();
});

sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

profileContent.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});



// Obtén referencias a los checkboxes y la tabla de simbología //
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




// Define una función para manejar la visibilidad de las tablas //
function actualizarTabla(checkbox, tablaId) {
  var tabla = document.getElementById(tablaId);
  tabla.style.display = checkbox.checked ? 'block' : 'none';
}

// Obtén referencias a los checkboxes
var checkboxImgObj = document.getElementById('chkZMP_PDUyOT_ImgObj');
var checkboxZonP = document.getElementById('chkZMP_PDUyOT_ZonP');
var checkboxEtapaCrecimiento = document.getElementById('chkZMP_PDUyOT_EC');
var checkboxPoligonosActuacion = document.getElementById('chkZMP_PDUyOT_PA');

var checkboxPMDU_PMDUYOT = document.getElementById('chkPMDU_PMDUYOT');



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

checkboxPMDU_PMDUYOT.addEventListener('change', function () {
  actualizarTabla(checkboxPMDU_PMDUYOT, 'PMDU_PMDUYOT');
});

