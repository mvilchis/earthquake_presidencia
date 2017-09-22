// Main logic for leaflet map


//Leaflet normal customize
var mexico_coordinates =[19.4326, -99.1332];
var map = new L.Map('map', { maxZoom: 16,
                           minZoom: 5,
                           scrollWheelZoom: false
                         }).setView(mexico_coordinates,14);
var basemap = new L.TileLayer("http://{s}.google.com/vt/?hl=es&x={x}&y={y}&z={z}&s={s}&apistyle=s.t%3A5|p.l%3A53%2Cs.t%3A1314|p.v%3Aoff%2Cp.s%3A-100%2Cs.t%3A3|p.v%3Aon%2Cs.t%3A2|p.v%3Aoff%2Cs.t%3A4|p.v%3Aoff%2Cs.t%3A3|s.e%3Ag.f|p.w%3A1|p.l%3A100%2Cs.t%3A18|p.v%3Aoff%2Cs.t%3A49|s.e%3Ag.s|p.v%3Aon|p.s%3A-19|p.l%3A24%2Cs.t%3A50|s.e%3Ag.s|p.v%3Aon|p.l%3A15&style=47,37", {
    subdomains: ['mt0','mt1','mt2','mt3'],
    zIndex: -1,
    detectRetina: true,
    scrollWheelZoom: false
  });
map.addLayer(basemap);
//Status text
var status_text = {
            "1":"Edificios fuera de riesgo",
            "2" :"Edificios require inspección adicional",
            "0" :"Edifcios con estado desconocido",
            "-1":"Edificios en estado de riesgo",
          }


// Fuse search options
var searchOptions = {
  title: 'Busca tu edificio',
  placeholder: 'Busca tu edificio',
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
  // Divide by type
  var img_url;
  if (feature.properties.TYPE.toLowerCase() == "edificio") {
    img_url="edificio";
  } else if (feature.properties.TYPE.toLowerCase() == "escuela") {
    img_url = "escuela";
  }else if (feature.properties.TYPE.toLowerCase() == "casa") {
    img_url = "casa";
  }else if (feature.properties.TYPE.toLowerCase() == "hospital") {
    img_url = "hospital";
  }
  if (feature.properties.STATUS==1){
    img_url+="_verde";
  }else if(feature.properties.STATUS==-1){
    img_url+="_rojo";
  }else if (feature.properties.STATUS == 2){
    img_url +="_amarillo";
  }else {
    img_url+="_gris";
  }
  img_url+=".png";
  var tag = status_text[feature.properties.STATUS];
  return L.marker(latlng,
      {tags: [tag],
      icon: L.icon({iconUrl: 'img/'+img_url,
      iconSize: [28, 28],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76]}) }
    );
}
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

 var div = L.DomUtil.create('div', 'info legend'),
           grades = [50000, 60000, 70000, 80000, 90000],
           labels = [];

  div.innerHTML += '<p><b>Guia de color</b></p>';
  div.innerHTML += '<p><i style="background:#00CC99"></i>Edificio fuera de riesgo </p>' ;
  div.innerHTML += '<p><i style="background:#dbd530"></i>Edificio require inspección adicional</p>' ;
  div.innerHTML += '<p><i style="background:#8C8C8C"></i>Edifcio con estado desconocido</p>' ;
  div.innerHTML += '<p><i style="background:#FF6666"></i> Edificio en estado de riesgo</p>' ;

       return div;
};

legend.addTo(map);


// Add popups
function onEachFeatureOption(feature, layer){
  // Bind layer to feature
  feature.layer = layer;
  if (feature.properties.STATUS == 1) {
    var status_label =  "<span style='font-weight:700;color:white;'>ES SEGURO</span>";
    var color = "#00CC99";
  } else if (feature.properties.STATUS == 0) {
    var status_label =  "<span style='font-weight:700;color:white;'>SE DESCONOCE</span>";
    var color = "#8C8C8C";
  } else if  (feature.properties.STATUS == 2) {
    var status_label =  "<span style='font-weight:700;color:white;'>REQUIRE INSPECCIÓN ADICIONAL</span>";
    var color = "#dbd530";
  } else {
    var status_label =  "<span style='font-weight:700;color:white;'>NO ES SEGURO</span>";
    var color = "#FF6666";
  }
  var more_info=feature.properties.MORE_INFO;
  if (more_info != "") {
    more_info ='<span style="font-size:15px;color:white;">Mas informacion: <b>'+ more_info+'</b></span>';
  }
  layer.bindPopup('<div class="uno" style="background:'+color+'">'+
                  '<div style="padding:20px">'+
                  '<span style="font-size:15px;color:white;"><i class="fa fa-map-marker" aria-hidden="true"></i>  EL ESTADO DEL EDIFICIO:' + status_label + '</span></br></br>'+
                  '<span style="font-size:20px;color:white;">'+ feature.properties.ADDRESS+'</span>'+'</br></br>'+
                  '<span style="font-size:15px;color:white;">Tipo de edificacion:' + '<b>'+feature.properties.TYPE +'</b></span>'+'</br>'+
                  more_info +"</br></div></div>");
}

L.control.tagFilterButton({
	data: Object.keys(status_text).map(function(key){
      return status_text[key];
    }),
  filterOnEveryClick: true,
  clearText:"Quitar filtro",
}).addTo( map );
