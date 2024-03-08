const simbologiaData = {
  PMDU_PMDUYOT: [
    { color: "#c65911", text: "El municipio ingresó a SIPDUS el PMDU para dictamen de congruencia" },
    { color: "#691B31", text: "En proceso de elaboración" },
    { color: "#DDC9A3", text: "Instrumento vigente" },
    { color: "#BC955B", text: "Instrumento vigente en proceso de actualización" },
    { color: "#98989A", text: "No existe" },
    { color: "#A02142", text: "Solicitado SEDATU" },
    { color: "#20344c", text: "Susceptible de elaborar" }
  ],
  legend: [
    { color: "#cc2400", text: "4202 +" },
    { color: "#e24800", text: "3152-4201" },
    { color: "#fd7601", text: "2102-3151" },
    { color: "#ff9a00", text: "1051-2101" },
    { color: "#fece2e", text: "0-1050" }
  ],
  ImgObjetivo: [
    { color: "darkblue", text: "Ampliación Tren Suburbano" },
    { color: "cornflowerblue", text: "Vialiades Propuestas" },
    { color: "Gold", text: "Libramiento Sur de Pachuca" },
    { color: "black", text: "Habilitación Tren Pachuca" },
    { color: "saddlebrown", text: "Estación Tren Pachuca" },
    { color: "purple", text: "Corredor Turístico Pachuca - Tula de Allende" },
    { color: "firebrick", text: "Corredor de la Montaña" },
    { color: "deeppink", text: "Corredor de las Haciendas" },
    { color: "#ee958b", text: "Comarca Minera UNESCO" },
    { color: "mediumspringgreen", text: "Complejo Hidráulico Acueducto Padre Tembleque" },
    { color: "Red", text: "Corredor Comercio y Servicios Carretera México - Pachuca" },
    { color: "darkorange", text: "Corredor Comercio y Servicios Carretera Pachuca - Ciudad Sahagún" },
    { color: "#14122c", text: "Conjunto de Parques Industriales" },
    { color: "Orange", text: "CU Centros Urbanos" },
    { color: "coral", text: "SCU Subcentros Urbanos" },
    { color: "blanchedalmond", text: "CUR Centro Urbano Rural" },
    { color: "#b3ff19", text: "Parque Hídrico" },
    { color: "green", text: "Parque Ecológico" },
    { color: "#416864", text: "Nodo de Primer Orden" },
    { color: "#759eff", text: "Nodo de Segundo Orden" },
    { color: "#e4fff9", text: "Nodo de Tercer Orden" },
    { color: "#c00000", text: "Programa Parcial de Desarrollo Urbano" }
  ],
  ZonP: [
    { color: "khaki", text: "Suelo Urbano" },
    { color: "orange", text: "Suelo Urbanizable" },
    { color: "yellowgreen", text: "Suelo no urbanizable" }
  ],
  EtapaCrecimiento: [
    { color: "#eeef5d", text: "Zona Urbana" },
    { color: "#ffcc50", text: "Corto Plazo (2020-2022)" },
    { color: "#ffa722", text: "Mediano Plazo (2022-2027)" },
    { color: "#ed8900", text: "Largo Plazo (2027-2052)" },
    { color: "#853400", text: "Reserva (Condicionado)" },
    { color: "dimgrey", text: "Polígono de Actuación (Condicionado)" },
    { color: "yellowgreen", text: "Suelo No Urbanizable" },
    { color: "#fff", text: "Programa Parcial de Desarrollo Urbano Zona" }
  ],
  PoligonosActuacion: [
    { color: "#00008b", text: "Clúster Logístico" },
    { color: "#6faac8", text: "Clúster Salud" },
    { color: "#4a1743", text: "Parque Industrial" },
    { color: "#baff95", text: "Parque Hidrico" },
    { color: "#ed40be", text: "Rastro Tipo TIFF" },
    { color: "#f28781", text: "Recinto Ferial" },
    { color: "#ff8041", text: "Subcentro Urbano" },
    { color: "#ffff3f", text: "Suelo Urbanizable" }
  ]
};

// Función para crear la tabla de simbología
function crearTablaSimbologia(tablaId, data) {
  const tabla = document.getElementById(tablaId);
  const tableBody = tabla.querySelector("table");

  data.forEach(item => {
    const row = document.createElement("tr");
    const colorCell = document.createElement("td");
    const textCell = document.createElement("td");
    const colorDiv = document.createElement("div");

    colorDiv.className = "legend-color";
    colorDiv.style.background = item.color;

    colorCell.appendChild(colorDiv);
    textCell.textContent = item.text;

    row.appendChild(colorCell);
    row.appendChild(textCell);

    tableBody.appendChild(row);
  });
}

// Iterar sobre los datos de simbología y crear las tablas correspondientes
Object.entries(simbologiaData).forEach(([tablaId, data]) => {
  crearTablaSimbologia(tablaId, data);
});
