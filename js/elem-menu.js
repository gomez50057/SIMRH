// const menu = {
//   Hidalgo: [
//     { name: "Información Básica", id: "chkInfoGenHGO" },
//     { name: "Población por AGEB", id: "chkPobAGEBHgo" },
//     { name: "PMDU_PMDUYOT", id: "chkPMDU_PMDUYOT" }
//   ],
//   Regiones: [
//     {
//       name: "Información Básica",
//       subItems: [
//         { name: "Región Tula", id: "chkReg01" },
//         { name: "Región Tulancingo", id: "chkReg02" },
//         { name: "Región Pachuca", id: "chkReg03" },
//         { name: "Región Huejutla", id: "chkReg04" },
//         { name: "Región Mineral de la Reforma", id: "chkReg05" },
//         { name: "Región Tizayuca", id: "chkReg06" },
//         { name: "Región Actopan", id: "chkReg07" },
//         { name: "Región Ixmiquilpan", id: "chkReg08" },
//         { name: "Región Zacualtipán", id: "chkReg09" },
//         { name: "Región Apan", id: "chkReg10" },
//         { name: "Región Huichapan", id: "chkReg11" },
//         { name: "Región Jacala", id: "chkReg12" }
//       ]
//     },
//     {
//       name: "Población por AGEB",
//       subItems: [
//         { name: "Región Tula", id: "chkPobAGEBR01" },
//         { name: "Región Tulancingo", id: "chkPobAGEBR02" },
//         { name: "Región Pachuca", id: "chkPobAGEBR03" },
//         { name: "Región Huejutla", id: "chkPobAGEBR04" },
//         { name: "Región Mineral de la Reforma", id: "chkPobAGEBR05" },
//         { name: "Región Tizayuca", id: "chkPobAGEBR06" },
//         { name: "Región Actopan", id: "chkPobAGEBR07" },
//         { name: "Región Ixmiquilpan", id: "chkPobAGEBR08" },
//         { name: "Región Zacualtipán", id: "chkPobAGEBR09" },
//         { name: "Región Apan", id: "chkPobAGEBR10" },
//         { name: "Región Huichapan", id: "chkPobAGEBR11" },
//         { name: "Región Jacala", id: "chkPobAGEBR12" }
//       ]
//     }
//   ],
//   "Zonas Metropolitanas": [
//     {
//       name: "Información Básica",
//       subItems: [
//         { name: "ZMVM", id: "chkDivisionZMVM" },
//         { name: "ZMPachuca", id: "chkInfoZMP" },
//         { name: "ZMTula", id: "chkInfoZMT" },
//         { name: "ZMTulancingo", id: "chkInfoZMTUL" }
//       ]
//     },
//     {
//       name: "Población por AGEB",
//       subItems: [
//         { name: "ZMPachuca", id: "chkPobAGEBZMP" }
//       ]
//     },
//     {
//       name: "PDUyOT ZMP",
//       subItems: [
//         { name: "Imagen Objetivo", id: "chkZMP_PDUyOT_ImgObj" },
//         { name: "Zonificación Primaria", id: "chkZMP_PDUyOT_ZonP" },
//         { name: "Etapas de Crecimiento", id: "chkZMP_PDUyOT_EC" },
//         { name: "Polígonos de Actuación", id: "chkZMP_PDUyOT_PA" }
//       ]
//     }
//   ]
// };


const menu = [
  {
    title: "Estadoos",
    icon: "img/icon/Hidalgo.svg",
    items: [
      { name: "Información Básica", id: "chkInfoGenHGO" },
      { name: "Población por AGEB", id: "chkPobAGEBHgo" },
      { name: "PMDU_PMDUYOT", id: "chkPMDU_PMDUYOT" }
    ]
  },
  {
    title: "Regionalización",
    icon: "img/icon/Regiones.svg",
    items: [
      {
        name: "Información Básica",
        subItems: [
          { name: "Región Tula", id: "chkReg01" },
          { name: "Región Tulancingo", id: "chkReg02" },
          { name: "Región Pachuca", id: "chkReg03" },
          { name: "Región Huejutla", id: "chkReg04" },
          { name: "Región Mineral de la Reforma", id: "chkReg05" },
          { name: "Región Tizayuca", id: "chkReg06" },
          { name: "Región Actopan", id: "chkReg07" },
          { name: "Región Ixmiquilpan", id: "chkReg08" },
          { name: "Región Zacualtipán", id: "chkReg09" },
          { name: "Región Apan", id: "chkReg10" },
          { name: "Región Huichapan", id: "chkReg11" },
          { name: "Región Jacala", id: "chkReg12" }
        ]
      },
      {
        name: "Población por AGEB",
        subItems: [
          { name: "Región Tula", id: "chkPobAGEBR01" },
          { name: "Región Tulancingo", id: "chkPobAGEBR02" },
          { name: "Región Pachuca", id: "chkPobAGEBR03" },
          { name: "Región Huejutla", id: "chkPobAGEBR04" },
          { name: "Región Mineral de la Reforma", id: "chkPobAGEBR05" },
          { name: "Región Tizayuca", id: "chkPobAGEBR06" },
          { name: "Región Actopan", id: "chkPobAGEBR07" },
          { name: "Región Ixmiquilpan", id: "chkPobAGEBR08" },
          { name: "Región Zacualtipán", id: "chkPobAGEBR09" },
          { name: "Región Apan", id: "chkPobAGEBR10" },
          { name: "Región Huichapan", id: "chkPobAGEBR11" },
          { name: "Región Jacala", id: "chkPobAGEBR12" }
        ]
      }
    ]
  },
  {
    title: "Zonas Metropolitanas",
    icon: "img/icon/Zonas_Metropolitanas.svg",
    items: [
      {
        name: "Información Básica",
        subItems: [
          { name: "ZMVM", id: "chkDivisionZMVM" },
          { name: "ZMPachuca", id: "chkInfoZMP" },
          { name: "ZMTula", id: "chkInfoZMT" },
          { name: "ZMTulancingo", id: "chkInfoZMTUL" }
        ]
      },
      {
        name: "Población por AGEB",
        subItems: [
          { name: "ZMPachuca", id: "chkPobAGEBZMP" }
        ]
      },
      {
        name: "PDUyOT ZMP",
        subItems: [
          { name: "Imagen Objetivo", id: "chkZMP_PDUyOT_ImgObj" },
          { name: "Zonificación Primaria", id: "chkZMP_PDUyOT_ZonP" },
          { name: "Etapas de Crecimiento", id: "chkZMP_PDUyOT_EC" },
          { name: "Polígonos de Actuación", id: "chkZMP_PDUyOT_PA" }
        ]
      }
    ]
  }
];


// Función para generar el HTML del menú
function generateMenuHTML(menuData) {
  // Iniciar la construcción del HTML del menú
  let html = '<ul class="nav-links">';

  // Iterar sobre las categorías del menú
  menuData.forEach(category => {
    // Agregar la estructura HTML de cada categoría
    html += `<li>
      <div class="iocn-link">
        <img src="${category.icon}" alt="${category.title}">
        <h2 class="link_name">${category.title}</h2>
        <i class='bx bxs-chevron-down arrow'></i>
      </div>
      <ul class="sub-menu">`;

    // Iterar sobre los elementos de la categoría
    category.items.forEach(item => {
      // Verificar si el elemento tiene subelementos
      if (item.subItems) {
        // Agregar la estructura HTML de los subelementos al submenú
        html += `<li class="menu-dropdown">
            <div>
              <div class="contenedor">
                <p class="titulo_sub">${item.name}</p>
                <i class='bx bxs-chevron-down arrowSub'></i>
              </div>
              <div class="link-sub">
                <span class="link_name">${item.name}</span>
              </div>
              <ul class="submenu-items">`;

        item.subItems.forEach(subItem => {
          html += `<li class="SidebarCheckbox">
              <input type="checkbox" id="${subItem.id}" name="check" value="" />
              <label for="${subItem.id}">
                <span class="checkmark"></span>
                ${subItem.name}
              </label>
            </li>`;
        });

        // Cerrar la estructura HTML de los subelementos y del submenú
        html += `</ul>
            </div>
          </li>`;
      } else {
        // Si el elemento no tiene subelementos, agregarlo como una opción simple
        html += `<li class="SidebarCheckbox">
            <input type="checkbox" id="${item.id}" name="check" value="" />
            <label for="${item.id}">
              <span class="checkmark"></span>
              ${item.name}
            </label>
          </li>`;
      }
    });

    // Cerrar la estructura HTML de la categoría
    html += `</ul>
      </li>`;
  });

  // Cerrar la estructura HTML del menú
  html += `</ul>`;
  
  return html;
}

// Generar el HTML del menú
const menuHTML = generateMenuHTML(menu);

// Insertar el HTML generado en el documento
document.getElementById('menu-container').innerHTML = menuHTML;
