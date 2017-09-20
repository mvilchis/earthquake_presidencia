// Main logic for leaflet map


//Leaflet normal customize
var mexico_coordinates =[19.4326, -99.1332];
var map = new L.Map('map', { maxZoom: 14,
                           minZoom: 5,
                           scrollWheelZoom: false
                         }).setView(mexico_coordinates,13);
var basemap = new L.TileLayer("http://{s}.google.com/vt/?hl=es&x={x}&y={y}&z={z}&s={s}&apistyle=s.t%3A5|p.l%3A53%2Cs.t%3A1314|p.v%3Aoff%2Cp.s%3A-100%2Cs.t%3A3|p.v%3Aon%2Cs.t%3A2|p.v%3Aoff%2Cs.t%3A4|p.v%3Aoff%2Cs.t%3A3|s.e%3Ag.f|p.w%3A1|p.l%3A100%2Cs.t%3A18|p.v%3Aoff%2Cs.t%3A49|s.e%3Ag.s|p.v%3Aon|p.s%3A-19|p.l%3A24%2Cs.t%3A50|s.e%3Ag.s|p.v%3Aon|p.l%3A15&style=47,37", {
    subdomains: ['mt0','mt1','mt2','mt3'],
    zIndex: -1,
    detectRetina: true,
    scrollWheelZoom: false
  });
map.addLayer(basemap);
// Fuse search options
var searchOptions = {
  title: 'Busca tu edificio',
  placeholder: 'Busca tu edificio'
};

// Add search control
var searchCtrl = L.control.fuseSearch(searchOptions);
searchCtrl.addTo(map);
searchCtrl.indexFeatures(edificios, ['NAME', 'ADDRESS']);

// Add school marker
var myLayer = L.geoJson(edificios, {
                onEachFeature: onEachFeatureOption,
                pointToLayer: pointToLayerOption

              }).addTo(map);


function pointToLayerOption(feature, latlng) {
  if (feature.properties.STATUS==1){
    return L.marker(latlng,
      {icon: L.icon({   iconUrl: 'img/edificio-verde.png',
      iconSize: [28, 38],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76]}) }
    );
  }
  else if (feature.properties.STATUS == 0) {
    return L.marker(latlng,
      {icon: L.icon({   iconUrl: 'img/edificio.png',
      iconSize: [38, 38],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76]}) }
    );
  }

}

// Add popups
function onEachFeatureOption(feature, layer){
  // Bind layer to feature
  feature.layer = layer;
  if (feature.properties.STATUS == 1) {
    var status_label =  "Si es seguro"
  }else {
    var status_label =  "No es seguro"
  }
  var more_info=feature.properties.MORE_INFO;
  if (more_info != "") {
    more_info ='Mas informacion: '+ more_info;
  }
  layer.bindPopup('<b>' + feature.properties.ADDRESS + '</b> </br>'
        + 'El estado del edificio:' + status_label + '</br>'
        + more_info );
}
