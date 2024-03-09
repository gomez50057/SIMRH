// Deshabilitar el menú contextual en todo el documento
// document.addEventListener('contextmenu', function (event) {
//   event.preventDefault();
// });

// Desactivar Ctrl + U en la página
// document.addEventListener('keydown', function (event) {
//   if (event.ctrlKey && event.key === 'u') {
//     event.preventDefault(); // Evitar que se abra el código fuente
//   }
// });

const form = document.getElementById('form');
const logo = document.getElementById('logo');
const closeIcon = document.getElementById('close-icon');

logo.addEventListener('click', () => form.classList.toggle('expanded'));
closeIcon.addEventListener('click', () => form.classList.remove('expanded'));

// Definición del sistema de referencia de coordenadas (CRS) en formato EPSG:4326 (latitud y longitud)
const crs84 = new L.Proj.CRS('EPSG:4326',
  '+title=CRS84 +proj=longlat +datum=WGS84 +no_defs',
  {
    resolutions: Array.from({ length: 22 }, (_, i) => 2 ** (21 - i)),
    bounds: L.latLngBounds([-90, -180], [90, 180])
  }
);

var map = L.map('map').setView([20.44819465937593, -98.41534285830343], 8,);
map.attributionControl.setPrefix(''); // Esto elimina cualquier texto de atribución

//Mapa Base
var hidri = L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
  minZoom: 8,
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

var dark = L.tileLayer('http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  minZoom: 8,
  maxZoom: 20,
});
var sat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  minZoom: 8,
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var rel = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
  minZoom: 8,
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var carret = L.tileLayer('http://{s}.google.com/vt/lyrs=h&x={x}&y={y}&z={z}', {
  minZoom: 8,
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var baseMaps = {
  "Mapa Híbrido": hidri,
  "Mapa Satelital ": sat,
  "Mapa Dark": dark,
  "Google Relieve": rel,
  "Google Carreteras": carret,
};
 

// Define the CoordProjection control
L.Control.CoordProjection = L.Control.extend({
  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-control-coord-projection');
    L.DomEvent.disableClickPropagation(container);

    container.innerHTML = 'Lat: <span id="lat"></span> | Lng: <span id="lng"></span>';

    map.on('mousemove', this._updateCoordinates.bind(this));

    return container;
  },

  _updateCoordinates: function (e) {
    this._lat = e.latlng.lat.toFixed(7);
    this._lng = e.latlng.lng.toFixed(7);
    this._container.querySelector('#lat').textContent = this._lat;
    this._container.querySelector('#lng').textContent = this._lng;
  },

  // Método para copiar las coordenadas al portapapeles
  _copyCoordinatesToClipboard: function () {
    const coords = `${this._lat}, ${this._lng}`;

    // Copia las coordenadas al portapapeles
    navigator.clipboard.writeText(coords).then(() => {
      console.log('Coordenadas copiadas al portapapeles: ' + coords);
      alert('Copiado en el portapapeles: ' + coords);
    }).catch(err => {
      console.error('Error al copiar las coordenadas: ', err);
      alert('Error al copiar las coordenadas. Intente nuevamente.');
    });
  }
});

// Crear una instancia del control de coordenadas
L.control.coordProjection = function (options) {
  return new L.Control.CoordProjection(options);
};

// Añadir el control de coordenadas al mapa con el CRS definido
var coordControl = L.control.coordProjection({ crs: crs84 }).addTo(map);

// Initialize a context menu for the entire page
var contextMenu = CtxMenu();

// Add an item to the menu
contextMenu.addItem("Copiar coordenadas", function () {
  // Llama a la función para copiar las coordenadas al portapapeles desde el control de coordenadas
  coordControl._copyCoordinatesToClipboard();
});


//Se agrega un Control de mapas base
var layerControl = L.control.layers(baseMaps, null, { collapsed: false, position: 'bottomleft' }).addTo(map);
// Se agrega una barra de escala
L.control.scale({ position: 'bottomright' }).addTo(map);

//Marca de Agua
L.Control.Watermark = L.Control.extend({
  onAdd: function (map) {
    var img = L.DomUtil.create('img', 'watermark-image');
    img.src = 'img/Logox2.png';
    return img;
  },

  onRemove: function (map) {
    // Nothing to do here
  }
});
L.control.watermark = function (opts) {
  return new L.Control.Watermark(opts);
}
L.control.watermark({ position: 'topright' }).addTo(map);




// Variables globales
var editableLayers;

// Inicializa el mapa
function initMap() {

  L.drawLocal = {
    draw: {
      toolbar: {
        // #TODO: esto debería reorganizarse donde las acciones estén anidadas en actions
        // por ejemplo: actions.undo  o actions.cancel
        actions: {
          title: 'Cancelar dibujo',
          text: 'Cancelar'
        },
        finish: {
          title: 'Finalizar dibujo',
          text: 'Finalizar'
        },
        undo: {
          title: 'Eliminar último punto dibujado',
          text: 'Eliminar último punto'
        },
        buttons: {
          polyline: 'Dibujar una polilínea',
          polygon: 'Dibujar un polígono',
          rectangle: 'Dibujar un rectángulo',
          circle: 'Dibujar un círculo',
          marker: 'Dibujar un marcador',
          circlemarker: 'Dibujar un marcador circular'
        }
      },
      handlers: {
        circle: {
          tooltip: {
            start: 'Haga clic y arrastre para dibujar un círculo.'
          },
          radius: 'Radio'
        },
        circlemarker: {
          tooltip: {
            start: 'Haga clic en el mapa para colocar un marcador circular.'
          }
        },
        marker: {
          tooltip: {
            start: 'Haga clic en el mapa para colocar un marcador.'
          }
        },
        polygon: {
          tooltip: {
            start: 'Haga clic para comenzar a dibujar la forma.',
            cont: 'Haga clic para continuar dibujando la forma.',
            end: 'Haga clic en el primer punto para cerrar esta forma.'
          }
        },
        polyline: {
          error: '<strong>Error:</strong> ¡Las aristas de la forma no pueden cruzarse!',
          tooltip: {
            start: 'Haga clic para comenzar a dibujar la línea.',
            cont: 'Haga clic para continuar dibujando la línea.',
            end: 'Haga clic en el último punto para finalizar la línea.'
          }
        },
        rectangle: {
          tooltip: {
            start: 'Haga clic y arrastre para dibujar un rectángulo.'
          }
        },
        simpleshape: {
          tooltip: {
            end: 'Suelte el mouse para finalizar el dibujo.'
          }
        }
      }
    },
    edit: {
      toolbar: {
        actions: {
          save: {
            title: 'Guardar cambios',
            text: 'Guardar'
          },
          cancel: {
            title: 'Cancelar edición, descartar todos los cambios',
            text: 'Cancelar'
          },
          clearAll: {
            title: 'Borrar todas las capas',
            text: 'Borrar Todo'
          }
        },
        buttons: {
          edit: 'Editar capas',
          editDisabled: 'No hay capas para editar',
          remove: 'Eliminar capas',
          removeDisabled: 'No hay capas para eliminar'
        }
      },
      handlers: {
        edit: {
          tooltip: {
            text: 'Arrastre los manejadores o marcadores para editar las características.',
            subtext: 'Haga clic en cancelar para deshacer los cambios.'
          }
        },
        remove: {
          tooltip: {
            text: 'Haga clic en una característica para eliminarla.'
          }
        }
      }
    }
  };
  // Capa para las características editables
  editableLayers = new L.FeatureGroup().addTo(map);
  var drawControl = new L.Control.Draw({
    draw: {
      polyline: true,
      polygon: true,
      circle: true,
      rectangle: true,
      marker: true,
    },
    edit: {
      featureGroup: editableLayers,
      remove: true,
    },
  });

  map.addControl(drawControl);

  // map.on('draw:created', function (e) {
  //   editableLayers.addLayer(e.layer);
  //   addDownloadIcon();  // Añade el ícono después de crear un polígono
  // });

  map.on('draw:created', function (e) {
    var layer = e.layer;
    editableLayers.addLayer(layer);

    // Añadir medidas a la forma creada
    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
      layer.showMeasurements();
    } else if (layer instanceof L.Circle) {
      layer.showMeasurements();
    }

    addDownloadIcon();  // Añade el ícono después de crear una forma
  });


  // Baja más la barra ajustando el estilo
  var drawContainer = document.querySelector('.leaflet-draw.leaflet-control');
  drawContainer.style.top = '45px';
}

// Agregar el ícono circular de descarga
function addDownloadIcon() {
  // Remover el ícono anterior si existe
  var existingDownloadIcon = document.querySelector('.download-icon');
  if (existingDownloadIcon) {
    existingDownloadIcon.remove();
  }
  // Ajusta la posición del ícono utilizando CSS
  var downloadIconContainer = L.DomUtil.create('div', 'download-icon');
  downloadIconContainer.innerHTML = `<img src="img/Poligono_Descarga.png" style="width: 40px; height: 40px;">`;
  // Agrega el contenedor del ícono de descarga como un elemento secundario al contenedor principal del mapa
  map.getContainer().appendChild(downloadIconContainer);
  downloadIconContainer.addEventListener('click', downloadPolygons);
}

function downloadPolygons() {
  var kmlString = toKML(editableLayers.toGeoJSON());
  var blob = new Blob([kmlString], { type: 'application/vnd.google-earth.kml+xml' });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'poligonos.kml';
  link.click();
}

// Función para convertir GeoJSON a KML
function toKML(geoJson) {
  var kml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  kml += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
  kml += '  <Document>\n';

  geoJson.features.forEach(function (feature) {
    kml += '    <Placemark>\n';
    kml += '      <name>Geometry</name>\n';
    kml += '      <description><![CDATA[Generated by Leaflet]]></description>\n';

    if (feature.geometry.type === 'Polygon') {
      kml += '      <Polygon>\n';
      kml += '        <outerBoundaryIs>\n';
      kml += '          <LinearRing>\n';
      kml += '            <coordinates>\n';

      feature.geometry.coordinates[0].forEach(function (coord) {
        kml += '              ' + coord[0] + ',' + coord[1] + '\n';
      });

      kml += '            </coordinates>\n';
      kml += '          </LinearRing>\n';
      kml += '        </outerBoundaryIs>\n';
      kml += '      </Polygon>\n';
    } else if (feature.geometry.type === 'LineString') {
      kml += '      <LineString>\n';
      kml += '        <coordinates>\n';

      feature.geometry.coordinates.forEach(function (coord) {
        kml += '          ' + coord[0] + ',' + coord[1] + '\n';
      });

      kml += '        </coordinates>\n';
      kml += '      </LineString>\n';
    } else if (feature.geometry.type === 'Point') {
      kml += '      <Point>\n';
      kml += '        <coordinates>' + feature.geometry.coordinates[0] + ',' + feature.geometry.coordinates[1] + '</coordinates>\n';
      kml += '      </Point>\n';
    } else if (feature.geometry.type === 'Circle') {
      // Convertir un círculo Leaflet a KML
      var circleToPolygon = L.circleToPolygon(feature.geometry.coordinates, feature.properties.radius, 36);
      kml += '      <Polygon>\n';
      kml += '        <outerBoundaryIs>\n';
      kml += '          <LinearRing>\n';
      kml += '            <coordinates>\n';

      circleToPolygon.forEach(function (coord) {
        kml += '              ' + coord[0] + ',' + coord[1] + '\n';
      });

      kml += '            </coordinates>\n';
      kml += '          </LinearRing>\n';
      kml += '        </outerBoundaryIs>\n';
      kml += '      </Polygon>\n';
    }
    kml += '    </Placemark>\n';
  });
  kml += '  </Document>\n';
  kml += '</kml>\n';
  return kml;
}

// Llama a initMap cuando la página se carga
document.addEventListener('DOMContentLoaded', function () {
  initMap();
});





var markerUbicacion = null;

// Función para manejar el evento 'click' en el marcador
function handleMarkerClick() {
  map.removeLayer(markerUbicacion);
  // Asignar null al marcador para indicar que ya no existe
  markerUbicacion = null;
}

obtenerUbicacionBtn.addEventListener('click', function () {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var latitud = position.coords.latitude;
        var longitud = position.coords.longitude;
        // Centra el mapa en la ubicación obtenida
        map.setView([latitud, longitud], 17);

        // Elimina el marcador anterior si existe
        if (markerUbicacion) {
          handleMarkerClick();
        }

        // Añade un marcador en la ubicación
        markerUbicacion = L.marker([latitud, longitud]).addTo(map);

        // Agregar el listener 'click' al marcador
        markerUbicacion.on('click', handleMarkerClick);

        // Puedes hacer lo que necesites con la ubicación
        alert('Ubicación encontrada: Latitud ' + latitud + ', Longitud ' + longitud);
      },
      function (error) {
        console.error('Error al obtener la ubicación:', error.message);
        alert('Error al obtener la ubicación. Por favor, inténtalo de nuevo.');
      }
    );
  } else {
    console.error('La geolocalización no es compatible con este navegador.');
    alert('La geolocalización no es compatible con este navegador.');
  }
});





// Descarga en PNG
// L.control.bigImage({position: 'topright'}).addTo(map);
// L.control.bigImage({ position: 'topleft'}).addTo(map);
L.control.bigImage().addTo(map);


// // // Estado // // //

//Estado de Hidalgo
var InfoHGOGen = geoJSONInfoHgo(HgoInfoGen, '#fff');
function geoJSONInfoHgo(data, color) {
  return L.geoJSON(data, {
    style: function (feature) {
      return {
        fillColor: 'rgba(0, 0, 0, 0.4)',
        color: color,
        weight: 2.6,
        fillOpacity: 0.6
      };
    },
    onEachFeature: function (feature, layer) {
      var poblacionMun = feature.properties.POBMUN.toLocaleString();
      var poblacionFem = feature.properties.POBFEM.toLocaleString();
      var poblacionMas = feature.properties.POBMAS.toLocaleString();
      var SupMun = feature.properties.Superficie.toFixed(3) + " km²";

      var PMDU = feature.properties.PMDU;
      var LINKPMDU = feature.properties.LINKPMDU;
      var PMD = feature.properties.PMD;
      var LINKPMD = feature.properties.LINKPMD;
      var ATLAS = feature.properties.ATLAS;
      var LINKATLAS = feature.properties.LINKATLAS;
      var PobEst = feature.properties.POB_ESTATA.toLocaleString();
      layer.bindPopup("<div class='PopupT'>" + feature.properties.NOM_MUN + "</div>" +
        "<b>Población Municipal:</b> " + poblacionMun +
        "<br><b>Mujeres:</b> " + poblacionFem +
        "<br><b>Hombres:</b> " + poblacionMas +
        "<br><b>Superficie:</b> " + SupMun +
        "<br><b>Población Estatal:</b> " + PobEst +
        "<div class='PopupSubT'><b>Instrumentos de Planeación </b></div>");

      // Comprobar si PMDU no es igual a "No existe" y agregar la sección correspondiente
      if (PMDU !== "No existe") {
        layer.setPopupContent(layer.getPopup()._content + "<b>PMDU:</b> " +
          "<a href='" + LINKPMDU + "' target='_blank'>" + feature.properties.NOM_LINK_P +
          "</a>" + "<b> (</b>" + feature.properties.FECH + "<b>)</b>");
      } else {
        layer.setPopupContent(layer.getPopup()._content + "<b>PMDU:</b> " + PMDU);
      }
      layer.setPopupContent(layer.getPopup()._content + "<br><b>PMD:</b> " +
        "<a href='" + LINKPMD + "' target='_blank'>" + "<b> Consultar </b>" +
        "</a>" + "<b> (</b>" + feature.properties.FECHPMD + "<b>)</b>");
      // Comprobar si ATLAS no es igual a "No existe" y agregar la sección correspondiente
      if (ATLAS !== "No existe") {
        layer.setPopupContent(layer.getPopup()._content + "<br><b>Atlas de Riesgos:</b> " +
          "<a href='" + LINKATLAS + "' target='_blank'>" + "<b> Consultar </b>" +
          "</a>" + "<b> (</b>" + feature.properties.FECHATLAS + "<b>)</b>");
      } else {
        layer.setPopupContent(layer.getPopup()._content + "<br><b>Atlas de Riesgos:</b> " + ATLAS);
      }
    }
  }).addTo(map);
}

//chkPMDU_PMDUYOT
var InfoHGO_PMDU_PMDUYOT = geoJSONPMDU_PMDUYOT(PMDU_PMDUYOT);
function geoJSONPMDU_PMDUYOT(data) {
  return L.geoJSON(data, {
    style: function (feature) {
      var PMDU = feature.properties.PMDU;
      var FECH = feature.properties.FECH;
      var fillColor;
      switch (PMDU) {
        case 'El municipio ingreso a SIPDUS el PMDU para dictamen de congruencia':
          fillColor = '#c65911';
          break;
        case 'En proceso de elaboración (SEDATU)':
        case 'En proceso de elaboración':
          fillColor = '#691B31';
          break;
        case 'Instrumento vigente':
          if (FECH === 'en proceso de actualización - 2013' || FECH === 'en proceso de actualización - 2016') {
            fillColor = '#BC955B';
          } else {
            fillColor = '#DDC9A3'; // Otro color si no cumple con la condición adicional
          }
          break;
        case 'No existe':
          fillColor = '#98989A';
          break;
        case 'Solicitado SEDATU':
          fillColor = '#A02142';
          break;
        case 'Susceptible de elaborar':
          fillColor = '#20344c';
          break;
        default:
          fillColor = '#B6DC76'; // Color predeterminado
      }
      return {
        fillColor: fillColor,
        color: fillColor,
        weight: 2.6,
        fillOpacity: 0.6
      };
    },
    onEachFeature: function (feature, layer) {
      var PMDU = feature.properties.PMDU;
      var LINKPMDU = feature.properties.LINKPMDU;
      layer.bindPopup("<div class='PopupT'>" + feature.properties.NOM_MUN + "</div>" +
        "<div class='PopupSubT'><b>Programa Municipal de Desarrollo Urbano</b></div>");

      if (LINKPMDU !== "No aplica") {
        layer.setPopupContent(layer.getPopup()._content + "<b>PMDU:</b> " +
          "<a href='" + LINKPMDU + "'target='_blank'>" + feature.properties.NOM_LINK_P +
          "</a>" + "<b> (</b>" + feature.properties.FECH + "<b>)</b>") + "<b>si teiene:</b> ";
      } else {
        layer.setPopupContent(layer.getPopup()._content + "<b>PMDU:</b> " + PMDU);
      }
    }
  });
}

// // // Regionalización // // //

var Reg01_2020 = geoJSONRegiones(Reg01Tula, 'Pink');
var Reg02_2020 = geoJSONRegiones(Reg02Tulancingo, 'Ivory');
var Reg03_2020 = geoJSONRegiones(Reg03Pachuca, 'Indigo');
var Reg04_2020 = geoJSONRegiones(Reg04Huejutla, 'Olive');
var Reg05_2020 = geoJSONRegiones(Reg05MR, 'Crimson');
var Reg06_2020 = geoJSONRegiones(Reg06Tizayuca, 'Teal');
var Reg07_2020 = geoJSONRegiones(Reg07Actopan, 'Gold');
var Reg08_2020 = geoJSONRegiones(Reg08Ixmiquilpan, 'purple');
var Reg09_2020 = geoJSONRegiones(Reg09Zacualtipan, 'Aqua');
var Reg10_2020 = geoJSONRegiones(Reg10Apan, 'Magenta');
var Reg11_2020 = geoJSONRegiones(Reg11Huichapan, 'Turquoise');
var Reg12_2020 = geoJSONRegiones(Reg12Jacala, 'Plum');
function geoJSONRegiones(data, fillColor) {
  return L.geoJSON(data, {
    style: function (feature) {
      return {
        fillColor: fillColor, // Cambiar a cualquier color que desees
        fillOpacity: 0.6, // Cambiar la opacidad del relleno
        color: 'transparent', // Cambiar el color del borde
        weight: 2, // Cambiar el grosor del borde
      };
    },
    onEachFeature: function (feature, layer) {
      var poblacionMun = feature.properties.POBMUN.toLocaleString();
      var poblacionFem = feature.properties.POBFEM.toLocaleString();
      var poblacionMas = feature.properties.POBMAS.toLocaleString();
      var SupMun = feature.properties.Superficie.toFixed(3) + " km²";

      var PMDU = feature.properties.PMDU;
      var LINKPMDU = feature.properties.LINKPMDU;
      var LINKPMD = feature.properties.LINKPMD;
      var ATLAS = feature.properties.ATLAS;
      var LINKATLAS = feature.properties.LINKATLAS;

      var PobEst = feature.properties.POB_ESTATA.toLocaleString();
      layer.bindPopup("<div class='PopupT'>" + "<b>Región</b> " + feature.properties.NO_Reg + "</div>" +
        "<b>Municipio:</b> " + feature.properties.NOM_MUN +
        "<br><b>Población Municipal:</b> " + poblacionMun +
        "<br><b>Mujeres:</b> " + poblacionFem +
        "<br><b>Hombres:</b> " + poblacionMas +
        "<br><b>Superficie:</b> " + SupMun +
        "<br><b>Población Regiónal:</b> " + PobEst +
        "<div class='PopupSubT'><b>Instrumentos de Planeación </b></div>");
      // Comprobar si PMDU no es igual a "No existe" y agregar la sección correspondiente
      if (PMDU !== "No existe") {
        layer.setPopupContent(layer.getPopup()._content + "<b>PMDU:</b> " +
          "<a href='" + LINKPMDU + "' target='_blank'>" + feature.properties.NOM_LINK_P +
          "</a>" + "<b> (</b>" + feature.properties.FECH + "<b>)</b>");
      } else {
        layer.setPopupContent(layer.getPopup()._content + "<b>PMDU:</b> " + PMDU);
      }
      layer.setPopupContent(layer.getPopup()._content + "<br><b>PMD:</b> " +
        "<a href='" + LINKPMD + "' target='_blank'>" + "<b> Consultar </b>" +
        "</a>" + "<b> (</b>" + feature.properties.FECHPMD + "<b>)</b>");
      // Comprobar si ATLAS no es igual a "No existe" y agregar la sección correspondiente
      if (ATLAS !== "No existe") {
        layer.setPopupContent(layer.getPopup()._content + "<br><b>Atlas de Riesgos:</b> " +
          "<a href='" + LINKATLAS + "' target='_blank'>" + "<b> Consultar </b>" +
          "</a>" + "<b> (</b>" + feature.properties.FECHATLAS + "<b>)</b>");
      } else {
        layer.setPopupContent(layer.getPopup()._content + "<br><b>Atlas de Riesgos:</b> " + ATLAS);
      }
    }
  });
}

// // // Zonas Metropolitanas // // //

// ZMVM
var ZMVM_InfoGene = geoJSONZMVM(zmvm_InfoGeneral);
function geoJSONZMVM(data) {
  return L.geoJSON(data, {
    style: function (feature) {
      var nomEntidad = feature.properties.NOM_ENT;
      var color = nomEntidad === "Hidalgo" ? "#BC955B" :
        nomEntidad === "Estado de México" ? "#691B31" :
          nomEntidad === "Ciudad de México" ? "#3a9680" : "orange";
      return {
        fillColor: color,
        color: color,
        weight: 2.6,
        fillOpacity: 0.45
      };
    },
    onEachFeature: function (feature, layer) {
      var poblacionMun = feature.properties.POBMUN.toLocaleString();
      var poblacionFem = feature.properties.POBFEM.toLocaleString();
      var poblacionMas = feature.properties.POBMAS.toLocaleString();
      var SupMun = feature.properties.Superficie.toFixed(3) + " km²";
      var PobMetro = feature.properties.POBMETRO.toLocaleString();
      layer.bindPopup("<div class='PopupT'>" + feature.properties.NOM_ENT + "</div>" +
        "<b>Nombre del Municipio:</b> " + feature.properties.NOM_MUN +
        "<br><b>Población Municipal:</b> " + poblacionMun +
        "<br><b>Mujeres:</b> " + poblacionFem +
        "<br><b>Hombres:</b> " + poblacionMas +
        "<br><b>Superficie:</b> " + SupMun +
        "<br><b>Población Metropolitana:</b> " + PobMetro);
    }
  });
}

// ZMP, ZMT Y ZMTUL
// var PobZMVM2020 = geoJSONMetropolitanas(zmvm_InfoGeneral, 'Pink', 'transparent');
var InfoZMP = geoJSONMetropolitanas(ZMP_Info, '#B6DC76', 'transparent');
var InfoZMT = geoJSONMetropolitanas(ZMT_Info, 'Aqua', 'transparent');
var InfoZMTUL = geoJSONMetropolitanas(ZMTUL_Info, '#241E4E', 'transparent');
function geoJSONMetropolitanas(data, fillColor, color) {
  return L.geoJSON(data, {
    style: function (feature) {
      return {
        fillColor: fillColor, // Cambiar a cualquier color que desees
        fillOpacity: 0.7, // Cambiar la opacidad del relleno
        color: color, // Cambiar el color del borde
        weight: 2, // Cambiar el grosor del borde
      };
    },
    onEachFeature: function (feature, layer) {
      var poblacionMun = feature.properties.POBMUN.toLocaleString();
      var poblacionFem = feature.properties.POBFEM.toLocaleString();
      var poblacionMas = feature.properties.POBMAS.toLocaleString();
      var SupMun = feature.properties.Superficie.toFixed(3) + " km²";

      var PMDU = feature.properties.PMDU;
      var LINKPMDU = feature.properties.LINKPMDU;

      var LINKPMD = feature.properties.LINKPMD;

      var ATLAS = feature.properties.ATLAS;
      var LINKATLAS = feature.properties.LINKATLAS;

      var PobEst = feature.properties.POB_ESTATA.toLocaleString();

      layer.bindPopup("<div class='PopupT'>" + "<b>Zona Metropolitana de </b> " + feature.properties.NO_Zona + "</div>" +
        "<b>Municipio:</b> " + feature.properties.NOM_MUN +
        "<br><b>Población Municipal:</b> " + poblacionMun +
        "<br><b>Mujeres:</b> " + poblacionFem +
        "<br><b>Hombres:</b> " + poblacionMas +
        "<br><b>Superficie:</b> " + SupMun +
        "<br><b>Población Metropolitana:</b> " + PobEst +
        "<div class='PopupSubT'><b>Instrumentos de Planeación </b></div>");

      // Comprobar si PMDU no es igual a "No existe" y agregar la sección correspondiente
      if (PMDU !== "No existe") {
        layer.setPopupContent(layer.getPopup()._content + "<b>PMDU:</b> " +
          "<a href='" + LINKPMDU + "' target='_blank'>" + feature.properties.NOM_LINK_P +
          "</a>" + "<b> (</b>" + feature.properties.FECH + "<b>)</b>");
      } else {
        layer.setPopupContent(layer.getPopup()._content + "<b>PMDU:</b> " + PMDU);
      }
      layer.setPopupContent(layer.getPopup()._content + "<br><b>PMD:</b> " +
        "<a href='" + LINKPMD + "' target='_blank'>" + "<b> Consultar </b>" +
        "</a>" + "<b> (</b>" + feature.properties.FECHPMD + "<b>)</b>");

      // Comprobar si ATLAS no es igual a "No existe" y agregar la sección correspondiente
      if (ATLAS !== "No existe") {
        layer.setPopupContent(layer.getPopup()._content + "<br><b>Atlas de Riesgos:</b> " +
          "<a href='" + LINKATLAS + "' target='_blank'>" + "<b> Consultar </b>" +
          "</a>" + "<b> (</b>" + feature.properties.FECHATLAS + "<b>)</b>");
      } else {
        layer.setPopupContent(layer.getPopup()._content + "<br><b>Atlas de Riesgos:</b> " + ATLAS);
      }
    }
  });
}

// // // AGEB en General // // //
// Función para asignar un color en función del rango de población por AGEB
function getColor(poblacion) {
  if (poblacion >= 4202) {
    return '#cc2400'; // Color más intenso para el rango más alto
  } else if (poblacion >= 3152) {
    return '#e24800';
  } else if (poblacion >= 2102) {
    return '#fd7601';
  } else if (poblacion >= 1051) {
    return '#ff9a00';
  } else {
    return '#fece2e'; // Color menos intenso para el rango más bajo
  }
}

var PobAGEB_R012020 = createGeoJSONLayer(R01T_poblacionAGEB2020); // REGION 01
var PobAGEB_R022020 = createGeoJSONLayer(R02TUL_poblacionAGEB2020); // REGION 02
var PobAGEB_R032020 = createGeoJSONLayer(R03_poblacionAGEB2020); // REGION 03
var PobAGEB_R042020 = createGeoJSONLayer(R04_poblacionAGEB2020); // REGION 04
var PobAGEB_R052020 = createGeoJSONLayer(R05_poblacionAGEB2020); // REGION 05
var PobAGEB_R062020 = createGeoJSONLayer(R06_poblacionAGEB2020); // REGION 06
var PobAGEB_R072020 = createGeoJSONLayer(R07_poblacionAGEB2020); // REGION 07
var PobAGEB_R082020 = createGeoJSONLayer(R08_poblacionAGEB2020); // REGION 08
var PobAGEB_R092020 = createGeoJSONLayer(R09_poblacionAGEB2020); // REGION 09
var PobAGEB_R102020 = createGeoJSONLayer(R10_poblacionAGEB2020); // REGION 10
var PobAGEB_R112020 = createGeoJSONLayer(R11_poblacionAGEB2020); // REGION 11
var PobAGEB_R122020 = createGeoJSONLayer(R12_poblacionAGEB2020); // REGION 12

var PobAGEB_ZMP2020 = createGeoJSONLayer(ZMP_poblacionAGEB2020); // ZMP AGEB
var PobAGEB_HGO2020 = createGeoJSONLayer(HgoAGEB2020); // Hidalgo AGEB

function createGeoJSONLayer(data) {
  return L.geoJSON(data, {
    style: function (feature) {
      var poblacionTotal = feature.properties.POBTOT;
      var fillColor = getColor(poblacionTotal);
      return {
        fillColor: fillColor,
        fillOpacity: 0.7,
        color: fillColor, // Puedes usar el mismo color de relleno para el borde
        weight: 1,
      };
    },
    onEachFeature: function (feature, layer) {
      var poblacionTotal = feature.properties.POBTOT;
      var poblacionFem = feature.properties.POBFEM;
      var poblacionMas = feature.properties.POBMAS;

      // Verifica si los valores son "Sin Dato" y reemplaza si es necesario
      poblacionTotal = poblacionTotal === "Sin Dato" ? "Sin Dato" : Number(poblacionTotal).toLocaleString();
      poblacionFem = poblacionFem === "Sin Dato" ? "Sin Dato" : Number(poblacionFem).toLocaleString();
      poblacionMas = poblacionMas === "Sin Dato" ? "Sin Dato" : Number(poblacionMas).toLocaleString();

      layer.bindPopup("<b>Clave del Área Geoestadística Básica:</b> " + feature.properties.CVEGEO +
        "<br><b>Municipio:</b> " + feature.properties.NOM_MUN +
        "<br><b>Población por AGEB:</b> " + poblacionTotal +
        "<br><b>Total de Mujeres por AGEB:</b> " + poblacionFem +
        "<br><b>Total de Hombres por AGEB:</b> " + poblacionMas);
    }
  });
}

// // // PDUyOT Zona Metropolitana de Pachuca // // //

var ZMP_Ampliacion_Tren = geoJSONPDUyOTImgObj(ZMP_Ampliacion_Tren, 'darkblue', 'darkblue');
var ZMP_Vialidades_Propuestas = geoJSONPDUyOTImgObj(ZMP_Vialidades_Propuestas, 'cornflowerblue', 'cornflowerblue');
var ZMP_Libramiento_Sur = geoJSONPDUyOTImgObj(ZMP_Libramiento_Sur, 'Gold', 'Gold');
var ZMP_Habilitacion_Tren = geoJSONPDUyOTImgObj(ZMP_Habilitacion_Tren, 'black', 'black');
var ZMP_Estacion_Tren = geoJSONPDUyOTImgObj(ZMP_Estacion_Tren, 'saddlebrown', 'saddlebrown');
var ZMP_Corredor_Tur_Pac_T = geoJSONPDUyOTImgObj(ZMP_Corredor_Tur_Pac_T, 'purple', 'purple');
var ZMP_Corredor_Montana = geoJSONPDUyOTImgObj(ZMP_Corredor_Montana, 'firebrick', 'firebrick');
var ZMP_Corredor_Haciendas = geoJSONPDUyOTImgObj(ZMP_Corredor_Haciendas, 'deeppink', 'deeppink');
var ZMP_CM_UNESCO = geoJSONPDUyOTImgObj(ZMP_CM_UNESCO, '#ee958b', '#ee958b');
var ZMP_Acueducto_Padre_Tembleque = geoJSONPDUyOTImgObj(ZMP_Acueducto_Padre_Tembleque, 'mediumspringgreen', 'mediumspringgreen');
var ZMP_CorredorCySCarrMéxico_Pachuca = geoJSONPDUyOTImgObj(ZMP_CorredorCySCarrMéxico_Pachuca, 'Red', 'Red');
var ZMP_CorredorCySCarrPachuca_CiudadSahagun = geoJSONPDUyOTImgObj(ZMP_CorredorCySCarrPachuca_CiudadSahagun, 'darkorange', 'darkorange');
var ZMP_Parques_Industriales = geoJSONPDUyOTImgObj(ZMP_Parques_Industriales, '#14122c', '#14122c');
var ZMP_CU = geoJSONPDUyOTImgObj(ZMP_CU, 'Orange ', 'Orange ');
var ZMP_CUR = geoJSONPDUyOTImgObj(ZMP_CUR, 'blanchedalmond', 'blanchedalmond');
var ZMP_SCU = geoJSONPDUyOTImgObj(ZMP_SCU, 'coral', 'coral');
var ZMP_ParqueHídrico = geoJSONPDUyOTImgObj(ZMP_ParqueHídrico, '#b3ff19', '#b3ff19');
var ZMP_ParqueEcológico = geoJSONPDUyOTImgObj(ZMP_ParqueEcológico, 'green', 'green');
var ZMP_N1er = geoJSONPDUyOTImgObj(ZMP_N1er, '#416864', '#fff');
var ZMP_N2do = geoJSONPDUyOTImgObj(ZMP_N2do, '#759eff', '#fff');
var ZMP_N3er = geoJSONPDUyOTImgObj(ZMP_N3er, '#e4fff9', '#fff');
var ZMP_PPDU = geoJSONPDUyOTImgObj(ZMP_PPDU, '#a0fb0e02', '#c00000');

function geoJSONPDUyOTImgObj(data, fillColor, color) {
  return L.geoJSON(data, {
    style: function (feature) {
      var style = {
        fillColor: fillColor,
        fillOpacity: 0.4,
        color: color,
        weight: 4
      };
      if (feature.geometry.type === "MultiLineString") {
        style.dashArray = "5, 10";
      }
      return style;
    },
    onEachFeature: function (feature, layer) {
      var popupContent = "<b></b>";
      for (var key in feature.properties) {
        if (feature.properties.hasOwnProperty(key)) {
          var value = feature.properties[key];
          // Verifica si la clave es "Superficie" y agrega "ha" al valor
          if (key === "Superficie") {
            value += " ha";
          }
          popupContent += "<b>" + key + ":</b> " + value + "<br>";
        }
      }
      layer.bindPopup(popupContent);
    }
  });
}


// Zonificación Primaria
var ZMP_Urbano = geoJSONPDUyOT_ZP(ZMP_Urbano, 'khaki');
var ZMP_SUrbanizable = geoJSONPDUyOT_ZP(ZMP_SUrbanizable, 'orange');
var ZMP_SNoU = geoJSONPDUyOT_ZP(ZMP_SNoU, 'yellowgreen');

function geoJSONPDUyOT_ZP(data, color) {
  return L.geoJSON(data, {
    style: function (feature) {
      return {
        fillColor: color, // Cambiar a cualquier color que desees
        fillOpacity: 0.3, // Cambiar la opacidad del relleno
        color: 'transparent', // Cambiar el color del borde
        weight: 4, // Cambiar el grosor del borde
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<b>Zonificación Primaria:</b> " + feature.properties.ZON_PRIM);

    }
  });
}

// Etapas de Crecimiento

var ZMP_ZonaU = geoJSONPDUyOT_EP(ZMP_ZonaU, '#eeef5d');
var ZMP_CP20_22 = geoJSONPDUyOT_EP(ZMP_CP20_22, '#ffcc50');
var ZMP_MP22_27 = geoJSONPDUyOT_EP(ZMP_MP22_27, '#ffa722');
var ZMP_LP27_52 = geoJSONPDUyOT_EP(ZMP_LP27_52, '#ed8900');
var ZMP_Res = geoJSONPDUyOT_EP(ZMP_Res, '#853400');
var ZMP_SueloNoUrbanizable = geoJSONPDUyOT_EP(ZMP_SueloNoUrbanizable, 'yellowgreen');
var ZMP_PoliAct = geoJSONPDUyOT_EP(ZMP_PoliAct, 'dimgrey');

function geoJSONPDUyOT_EP(data, color) {
  return L.geoJSON(data, {
    style: function (feature) {
      return {
        fillColor: color, // Cambiar a cualquier color que desees
        fillOpacity: 0.5, // Cambiar la opacidad del relleno
        color: 'transparent', // Cambiar el color del borde
        weight: 4, // Cambiar el grosor del borde
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<b>Estatus de área :</b> " + feature.properties.ZON_PRIM +
        "<br><b>Etapa:</b> " + feature.properties.ETAPAS);
    }
  });
}

var ZMP_CLogistico = geoJSONPDUyOT_PA(ZMP_CLogistico, '#00008b');
var ZMP_CSalud = geoJSONPDUyOT_PA(ZMP_CSalud, '#6faac8');
var ZMP_ParqIndustrial = geoJSONPDUyOT_PA(ZMP_ParqIndustrial, '#4a1743');
var ZMP_ParqHidrico = geoJSONPDUyOT_PA(ZMP_ParqHidrico, '#baff95');
var ZMP_RastroTipoTIFF = geoJSONPDUyOT_PA(ZMP_RastroTipoTIFF, '#ed40be');
var ZMP_RecintoFerial = geoJSONPDUyOT_PA(ZMP_RecintoFerial, '#f28781');
var ZMP_SubcentroUrb = geoJSONPDUyOT_PA(ZMP_SubcentroUrb, '#ff8041');
var ZMP_SueloUrb = geoJSONPDUyOT_PA(ZMP_SueloUrb, '#ffff3f');

function geoJSONPDUyOT_PA(data, color) {
  return L.geoJSON(data, {
    style: function (feature) {
      return {
        fillColor: color,
        fillOpacity: 0.5,
        color: 'transparent',
        weight: 4,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<b>Uso de área:</b> " + feature.properties.USO);

    }
  });
}


var ZMP_SueloNOUrb = geoJSONPDUyOT_PA02(ZMP_SueloNOUrb, 'yellowgreen');
var ZMP_ZonaUrb = geoJSONPDUyOT_PA02(ZMP_ZonaUrb, 'khaki');

function geoJSONPDUyOT_PA02(data, color) {
  return L.geoJSON(data, {
    style: function (feature) {
      return {
        fillColor: color,
        fillOpacity: 0.5,
        weight: 4,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<b>Estatus de área :</b> " + feature.properties.ZON_PRIM +
        "<br><b>Etapa:</b> " + feature.properties.ETAPAS);
    }
  });
}



// Verifica el estado checkbox
function toggleLayer(layer, checkbox) {
  if (checkbox.checked) {
    layer.addTo(map);
  } else {
    layer.removeFrom(map);
  }
}

// Definir un arreglo de objetos que contengan la información de cada capa
var layers = [
  // // // Estado
  { layer: InfoHGOGen, checkbox: chkInfoGenHGO },
  { layer: InfoHGO_PMDU_PMDUYOT, checkbox: chkPMDU_PMDUYOT },

  // // // Regionalización
  { layer: Reg01_2020, checkbox: chkReg01 },
  { layer: Reg02_2020, checkbox: chkReg02 },
  { layer: Reg03_2020, checkbox: chkReg03 },
  { layer: Reg04_2020, checkbox: chkReg04 },
  { layer: Reg05_2020, checkbox: chkReg05 },
  { layer: Reg06_2020, checkbox: chkReg06 },
  { layer: Reg07_2020, checkbox: chkReg07 },
  { layer: Reg08_2020, checkbox: chkReg08 },
  { layer: Reg09_2020, checkbox: chkReg09 },
  { layer: Reg10_2020, checkbox: chkReg10 },
  { layer: Reg11_2020, checkbox: chkReg11 },
  { layer: Reg12_2020, checkbox: chkReg12 },

  // // // AGEB en general
  // Regionalización
  { layer: PobAGEB_R012020, checkbox: chkPobAGEBR01 },
  { layer: PobAGEB_R022020, checkbox: chkPobAGEBR02 },
  { layer: PobAGEB_R032020, checkbox: chkPobAGEBR03 },
  { layer: PobAGEB_R042020, checkbox: chkPobAGEBR04 },
  { layer: PobAGEB_R052020, checkbox: chkPobAGEBR05 },
  { layer: PobAGEB_R062020, checkbox: chkPobAGEBR06 },
  { layer: PobAGEB_R072020, checkbox: chkPobAGEBR07 },
  { layer: PobAGEB_R082020, checkbox: chkPobAGEBR08 },
  { layer: PobAGEB_R092020, checkbox: chkPobAGEBR09 },
  { layer: PobAGEB_R102020, checkbox: chkPobAGEBR10 },
  { layer: PobAGEB_R112020, checkbox: chkPobAGEBR11 },
  { layer: PobAGEB_R122020, checkbox: chkPobAGEBR12 },
  { layer: PobAGEB_ZMP2020, checkbox: chkPobAGEBZMP }, // ZMP
  { layer: PobAGEB_HGO2020, checkbox: chkPobAGEBHgo }, //Hidalgo

  // // // Zonas Metropolitanas
  { layer: ZMVM_InfoGene, checkbox: chkDivisionZMVM },
  { layer: InfoZMP, checkbox: chkInfoZMP },
  { layer: InfoZMT, checkbox: chkInfoZMT },
  { layer: InfoZMTUL, checkbox: chkInfoZMTUL },

  // // // PDUyOT Zona Metropolitana de Pachuca 
  { layer: ZMP_CM_UNESCO, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_Acueducto_Padre_Tembleque, checkbox: chkZMP_PDUyOT_ImgObj },

  { layer: ZMP_CorredorCySCarrMéxico_Pachuca, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_CorredorCySCarrPachuca_CiudadSahagun, checkbox: chkZMP_PDUyOT_ImgObj },

  { layer: ZMP_ParqueEcológico, checkbox: chkZMP_PDUyOT_ImgObj },

  { layer: ZMP_N1er, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_N2do, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_N3er, checkbox: chkZMP_PDUyOT_ImgObj },

  { layer: ZMP_CU, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_CUR, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_SCU, checkbox: chkZMP_PDUyOT_ImgObj },

  { layer: ZMP_PPDU, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_ParqueHídrico, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_Parques_Industriales, checkbox: chkZMP_PDUyOT_ImgObj },

  { layer: ZMP_Corredor_Montana, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_Corredor_Haciendas, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_Corredor_Tur_Pac_T, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_Ampliacion_Tren, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_Vialidades_Propuestas, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_Libramiento_Sur, checkbox: chkZMP_PDUyOT_ImgObj },
  { layer: ZMP_Habilitacion_Tren, checkbox: chkZMP_PDUyOT_ImgObj },

  { layer: ZMP_Estacion_Tren, checkbox: chkZMP_PDUyOT_ImgObj },

  { layer: ZMP_SNoU, checkbox: chkZMP_PDUyOT_ZonP },
  { layer: ZMP_SUrbanizable, checkbox: chkZMP_PDUyOT_ZonP },
  { layer: ZMP_Urbano, checkbox: chkZMP_PDUyOT_ZonP },
  // { layer: ZMP_PPDU, checkbox: chkZMP_PDUyOT_ZonP },

  { layer: ZMP_ZonaU, checkbox: chkZMP_PDUyOT_EC },
  { layer: ZMP_CP20_22, checkbox: chkZMP_PDUyOT_EC },
  { layer: ZMP_MP22_27, checkbox: chkZMP_PDUyOT_EC },
  { layer: ZMP_LP27_52, checkbox: chkZMP_PDUyOT_EC },
  { layer: ZMP_Res, checkbox: chkZMP_PDUyOT_EC },
  { layer: ZMP_SueloNoUrbanizable, checkbox: chkZMP_PDUyOT_EC },
  { layer: ZMP_PoliAct, checkbox: chkZMP_PDUyOT_EC },

  { layer: ZMP_ZonaUrb, checkbox: chkZMP_PDUyOT_PA },
  { layer: ZMP_SueloNOUrb, checkbox: chkZMP_PDUyOT_PA },

  { layer: ZMP_CLogistico, checkbox: chkZMP_PDUyOT_PA },
  { layer: ZMP_CSalud, checkbox: chkZMP_PDUyOT_PA },
  { layer: ZMP_ParqIndustrial, checkbox: chkZMP_PDUyOT_PA },
  { layer: ZMP_ParqHidrico, checkbox: chkZMP_PDUyOT_PA },
  { layer: ZMP_RastroTipoTIFF, checkbox: chkZMP_PDUyOT_PA },
  { layer: ZMP_RecintoFerial, checkbox: chkZMP_PDUyOT_PA },
  { layer: ZMP_SubcentroUrb, checkbox: chkZMP_PDUyOT_PA },
  { layer: ZMP_SueloUrb, checkbox: chkZMP_PDUyOT_PA },
];

// Asignar eventos para controlar la visibilidad de las capas
layers.forEach(function (layerInfo) {
  layerInfo.checkbox.addEventListener('change', function () {
    toggleLayer(layerInfo.layer, this);
  });
});


var marker;
function initialize() {
  var searchTypeSelector = document.getElementById('search-type-selector');
  var coordinatesInput = document.getElementById('coordinates-input');
  var autocompleteInput = document.getElementById('autocomplete-input');

  // Maneja el cambio en el tipo de búsqueda (por dirección o coordenadas)
  searchTypeSelector.addEventListener('change', function () {
    var selectedOption = searchTypeSelector.value;

    // Muestra u oculta los campos de entrada según el tipo de búsqueda seleccionado
    coordinatesInput.style.display = selectedOption === 'coordinates' ? 'block' : 'none';
    autocompleteInput.style.display = selectedOption === 'address' ? 'block' : 'none';

    // Limpia el mapa y el marcador
    clearMap();
  });

  // Inicializa el autocompletado para la búsqueda por dirección
  var autocomplete = new google.maps.places.Autocomplete(autocompleteInput);

  autocomplete.addListener('place_changed', function () {
    handlePlaceChanged(autocomplete.getPlace());
  });

  // Maneja la entrada de coordenadas manualmente
  coordinatesInput.addEventListener('change', function () {
    var coordinates = coordinatesInput.value.split(',');
    var lat = parseFloat(coordinates[0]);
    var lng = parseFloat(coordinates[1]);

    if (!isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], 14);
      clearMap();
      addMarker([lat, lng]);
    } else {
      alert('Invalid coordinates. Please enter valid latitude and longitude.');
    }
  });
}

function handlePlaceChanged(place) {
  if (!place.geometry) {
    return;
  }

  var lat = place.geometry.location.lat();
  var lng = place.geometry.location.lng();

  map.setView([lat, lng], 14);
  clearMap();
  addMarker([lat, lng]);
}

function clearMap() {
  if (marker) {
    map.removeLayer(marker);
  }
}

function addMarker(coords) {
  marker = L.marker(coords).addTo(map);

  // Agrega un manejador de eventos de clic al marcador
  marker.on('click', function () {
    // Elimina el marcador al hacer clic en él
    clearMap();
  });
}


// Carga la API de Google Maps utilizando un método de callback
function loadGoogleMapsScript() {
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAx5PWFIvSQPNLybUx5RjY0qLPdsC8DBCo&libraries=places&callback=initialize';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}


// Carga la API de Google Maps
loadGoogleMapsScript();

