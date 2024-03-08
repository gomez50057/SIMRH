const crs84 = new L.Proj.CRS('EPSG:4326',
    '+title=CRS84 +proj=longlat +datum=WGS84 +no_defs',
    {
        resolutions: Array.from({ length: 22 }, (_, i) => 2 ** (21 - i)),
        bounds: L.latLngBounds([-90, -180], [90, 180])
    }
);



L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    minZoom: 2,
}).addTo(map);

L.Control.CoordProjection = L.Control.extend({
    options: {
        position: 'bottomright',
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control-coord-projection');
        L.DomEvent.disableClickPropagation(container);
        container.innerHTML = 'Lat: <span id="lat"></span> | Lng: <span id="lng"></span>';

        container.addEventListener('click', function () {
            const lat = document.getElementById('lat').textContent;
            const lng = document.getElementById('lng').textContent;
            const coords = `${lat}, ${lng}`;

            navigator.clipboard.writeText(coords).then(() => {
                console.log('Coordenadas copiadas al portapapeles: ' + coords);
                alert('Coordenadas copiadas al portapapeles: ' + coords);
            }).catch(err => {
                console.error('Error al copiar las coordenadas: ', err);
                alert('Error al copiar las coordenadas. Intente nuevamente.');
            });
        });

        map.on('mousemove', function (e) {
            container.querySelector('#lat').textContent = e.latlng.lat.toFixed(7);
            container.querySelector('#lng').textContent = e.latlng.lng.toFixed(7);
        });

        return container;
    }
});

L.control.coordProjection = function (options) {
    return new L.Control.CoordProjection(options);
};

L.control.coordProjection({ crs: crs84 }).addTo(map);

map.on('contextmenu', function (e) {
    const lat = e.latlng.lat.toFixed(7);
    const lng = e.latlng.lng.toFixed(7);
    const coords = `${lat}, ${lng}`;

    navigator.clipboard.writeText(coords).then(() => {
        console.log('Coordenadas copiadas al portapapeles: ' + coords);
        alert('Coordenadas copiadas al portapapeles: ' + coords);
    }).catch(err => {
        console.error('Error al copiar las coordenadas: ', err);
        alert('Error al copiar las coordenadas. Intente nuevamente.');
    });
});
